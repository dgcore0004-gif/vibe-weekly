/**
 * 주간 바이브코딩 트렌드 수집 스크립트
 * 실행: node scripts/collect.mjs
 * 필요 환경변수: ANTHROPIC_API_KEY, REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET
 * 선택 환경변수: GITHUB_TOKEN (rate limit 증가용)
 */

import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../public/data.json");

const AI_KEYWORDS = [
  "claude", "cursor", "mcp", "agent", "vibe coding", "ai coding",
  "copilot", "llm", "gpt", "langchain", "langgraph", "browser-use",
  "lovable", "bolt", "windsurf", "cline", "continue", "aider",
  "anthropic", "openai", "gemini", "ollama", "local llm",
];

const SUBREDDITS = ["ClaudeAI", "LocalLLaMA", "cursor", "MachineLearning", "webdev"];

const AI_TAGS = ["MCP", "Agent", "AI IDE", "Frontend", "Fullstack", "Workflow", "Prompting", "Automation", "Design-to-Code", "Browser Use"];

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

function isAIRelated(text) {
  const lower = text.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

// ── Reddit ──────────────────────────────────────────────────────────────────

async function getRedditToken() {
  const creds = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "VibeWeekly/1.0 (automated curation bot)",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Reddit auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function fetchRedditPosts(token) {
  const posts = [];

  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(
        `https://oauth.reddit.com/r/${sub}/hot?limit=20&t=week`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "VibeWeekly/1.0 (automated curation bot)",
          },
        }
      );
      if (!res.ok) continue;

      const data = await res.json();
      const items = (data.data?.children ?? [])
        .map((c) => c.data)
        .filter((p) => p.score > 50 && isAIRelated(p.title + " " + (p.selftext ?? "")))
        .map((p) => ({
          type: "reddit",
          source: "Reddit",
          title: p.title,
          body: p.selftext?.slice(0, 500) ?? "",
          url: `https://reddit.com${p.permalink}`,
          score: p.score,
          comments: p.num_comments,
          subreddit: p.subreddit,
        }));

      posts.push(...items);
      await sleep(1000);
    } catch (e) {
      console.warn(`Reddit ${sub} 실패:`, e.message);
    }
  }

  return posts.slice(0, 30);
}

// ── Hacker News ──────────────────────────────────────────────────────────────

async function fetchHNStories() {
  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids = await res.json();

    const stories = await Promise.all(
      ids.slice(0, 80).map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then((r) => r.json())
          .catch(() => null)
      )
    );

    return stories
      .filter((s) => s && s.title && isAIRelated(s.title + " " + (s.url ?? "")))
      .map((s) => ({
        type: "hn",
        source: "HN",
        title: s.title,
        body: "",
        url: s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
        score: s.score ?? 0,
        comments: s.descendants ?? 0,
      }))
      .slice(0, 15);
  } catch (e) {
    console.warn("HN 수집 실패:", e.message);
    return [];
  }
}

// ── GitHub ───────────────────────────────────────────────────────────────────

async function fetchGitHubRepos() {
  const queries = [
    "topic:mcp-server stars:>100",
    "topic:ai-agent stars:>200",
    "browser-use OR browser-agent stars:>500",
    "vibe-coding OR ai-coding stars:>100",
    "claude-code OR claude-mcp stars:>50",
  ];

  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "VibeWeekly/1.0",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {}),
  };

  const seen = new Set();
  const repos = [];

  for (const q of queries) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=8`;
      const res = await fetch(url, { headers });
      if (!res.ok) continue;

      const data = await res.json();
      for (const r of data.items ?? []) {
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        repos.push({
          name: r.full_name,
          description: r.description ?? "",
          stars: r.stargazers_count,
          language: r.language ?? "Unknown",
          url: r.html_url,
          topics: r.topics ?? [],
          pushedAt: r.pushed_at,
        });
      }
      await sleep(1200);
    } catch (e) {
      console.warn(`GitHub 쿼리 실패 (${q}):`, e.message);
    }
  }

  return repos
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 12);
}

// ── Claude API 분석 ──────────────────────────────────────────────────────────

async function analyzeWithClaude(client, redditPosts, hnStories, githubRepos) {
  const itemsText = [
    "=== Reddit Posts ===",
    ...redditPosts.map((p, i) =>
      `[R${i + 1}] ${p.title}\nURL: ${p.url}\nScore: ${p.score}, Comments: ${p.comments}\n${p.body}`
    ),
    "\n=== Hacker News ===",
    ...hnStories.map((s, i) =>
      `[H${i + 1}] ${s.title}\nURL: ${s.url}\nScore: ${s.score}`
    ),
    "\n=== GitHub Repos ===",
    ...githubRepos.map((r, i) =>
      `[G${i + 1}] ${r.name} (⭐${r.stars})\n${r.description}\nTopics: ${r.topics.join(", ")}`
    ),
  ].join("\n\n");

  const prompt = `당신은 AI 개발자 커뮤니티를 위한 주간 트렌드 큐레이터입니다.
아래 수집된 원시 데이터를 분석해서 JSON을 생성하세요.

수집 데이터:
${itemsText}

다음 JSON 형식으로 응답하세요 (다른 텍스트 없이 JSON만):

{
  "trendPosts": [
    // Reddit/HN에서 가장 실전적인 6~8개 선별
    {
      "id": "고유ID",
      "title": "한국어로 번역/요약한 제목 (원제 의미 유지)",
      "summary": "3~4문장 한국어 요약. 실제 개발자에게 유용한 내용 중심.",
      "source": "Reddit|HN|X|GitHub|Discord|YouTube",
      "url": "원본URL",
      "tags": ["MCP", "Agent", "AI IDE", "Frontend", "Fullstack", "Workflow", "Prompting", "Automation", "Design-to-Code", "Browser Use" 중 1~3개],
      "practicalScore": 0~100 (실전 적용 가능성),
      "risk": "low|medium|high",
      "tools": ["언급된 도구들"],
      "redditMentions": 숫자 또는 null,
      "githubStars": 숫자 또는 null,
      "xReposts": 숫자 또는 null,
      "weekNumber": ${getWeekNumber()}
    }
  ],
  "githubTrending": [
    // GitHub에서 가장 주목할 4개
    {
      "name": "owner/repo",
      "description": "한국어 설명",
      "stars": 숫자,
      "starsToday": 추정값,
      "language": "언어",
      "url": "URL",
      "tags": ["태그"],
      "aiSummary": "AI 개발자 관점에서 1~2문장 실용적 요약"
    }
  ],
  "communitySignals": [
    // 자주 등장한 키워드 8개, 많이 언급된 순
    {
      "keyword": "키워드",
      "mentions": 추정 언급수,
      "trend": "up|down|stable",
      "source": "출처"
    }
  ],
  "summaryCards": {
    "trendingTool": {
      "name": "이번 주 가장 뜨는 툴",
      "change": "+XX%",
      "description": "한 줄 설명"
    },
    "hotTopic": {
      "name": "이번 주 핫 토픽",
      "description": "한 줄 설명"
    },
    "topWorkflow": {
      "name": "가장 공유된 워크플로우",
      "description": "한 줄 설명"
    },
    "communityQuote": {
      "text": "커뮤니티에서 인상적인 한 마디 (따옴표 포함)",
      "author": "출처"
    }
  }
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude 응답에서 JSON 파싱 실패");
  return JSON.parse(jsonMatch[0]);
}

// ── 메인 ─────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🚀 Vibe Weekly 수집 시작...");

  // 기존 데이터 백업 (실패 시 fallback)
  let existingData = null;
  try {
    existingData = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
  } catch {}

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // 1. Reddit 수집
  console.log("📡 Reddit 수집 중...");
  let redditPosts = [];
  try {
    const token = await getRedditToken();
    redditPosts = await fetchRedditPosts(token);
    console.log(`  → ${redditPosts.length}개 수집`);
  } catch (e) {
    console.warn("  Reddit 실패:", e.message);
  }

  // 2. HN 수집
  console.log("📡 Hacker News 수집 중...");
  const hnStories = await fetchHNStories();
  console.log(`  → ${hnStories.length}개 수집`);

  // 3. GitHub 수집
  console.log("📡 GitHub 수집 중...");
  const githubRepos = await fetchGitHubRepos();
  console.log(`  → ${githubRepos.length}개 수집`);

  const totalCollected = redditPosts.length + hnStories.length + githubRepos.length;
  console.log(`\n📊 총 ${totalCollected}개 수집 완료`);

  if (totalCollected === 0) {
    console.error("❌ 수집된 데이터가 없습니다. 기존 데이터 유지.");
    process.exit(1);
  }

  // 4. Claude 분석
  console.log("\n🤖 Claude로 분석 중...");
  let analyzed;
  try {
    analyzed = await analyzeWithClaude(client, redditPosts, hnStories, githubRepos);
  } catch (e) {
    console.error("Claude 분석 실패:", e.message);
    if (existingData) {
      console.log("기존 데이터 유지.");
      process.exit(0);
    }
    process.exit(1);
  }

  // 5. 최종 데이터 조합
  const output = {
    weekNumber: getWeekNumber(),
    lastUpdated: new Date().toISOString(),
    totalCollected,
    ...analyzed,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n✅ data.json 업데이트 완료 (Week #${output.weekNumber})`);
  console.log(`   트렌드: ${output.trendPosts?.length ?? 0}개`);
  console.log(`   GitHub: ${output.githubTrending?.length ?? 0}개`);
  console.log(`   시그널: ${output.communitySignals?.length ?? 0}개`);
}

main().catch((e) => {
  console.error("❌ 수집 실패:", e);
  process.exit(1);
});
