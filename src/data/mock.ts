export type Tag =
  | "MCP"
  | "Agent"
  | "AI IDE"
  | "Frontend"
  | "Fullstack"
  | "Workflow"
  | "Prompting"
  | "Automation"
  | "Design-to-Code"
  | "Browser Use";

export type Risk = "low" | "medium" | "high";
export type Sort = "hot" | "new" | "discussed" | "practical";

export interface TrendPost {
  id: string;
  title: string;
  summary: string;
  source: "Reddit" | "X" | "GitHub" | "HN" | "Discord" | "YouTube";
  url: string;
  tags: Tag[];
  practicalScore: number;
  risk: Risk;
  tools: string[];
  redditMentions?: number;
  githubStars?: number;
  xReposts?: number;
  weekNumber: number;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  starsToday: number;
  language: string;
  url: string;
  tags: Tag[];
  aiSummary: string;
}

export interface CommunitySignal {
  keyword: string;
  mentions: number;
  trend: "up" | "down" | "stable";
  source: string;
}

export const CURRENT_WEEK = 21;
export const LAST_UPDATED = "2026-05-21 09:00 KST";
export const TOTAL_COLLECTED = 142;

export const trendPosts: TrendPost[] = [
  {
    id: "1",
    title: "Claude Code + MCP 조합이 사실상 표준으로 자리 잡는 중",
    summary:
      "Cursor Agent Mode 대신 Claude Code를 직접 터미널에서 쓰는 개발자들이 급증. MCP로 Supabase, GitHub, Browserbase를 연결해 end-to-end 자동화 구성.",
    source: "Reddit",
    url: "#",
    tags: ["MCP", "Agent", "AI IDE"],
    practicalScore: 95,
    risk: "medium",
    tools: ["Claude Code", "MCP", "Supabase", "GitHub MCP"],
    redditMentions: 847,
    githubStars: 12400,
    xReposts: 2300,
    weekNumber: 21,
  },
  {
    id: "2",
    title: "Playwright MCP로 브라우저 자동화 — 스크린샷 없이 DOM 직접 제어",
    summary:
      "기존 browser-use 대비 Playwright MCP가 훨씬 안정적이라는 평가. 특히 form 입력, 로그인 플로우, 다중 탭 처리에서 성능 차이 큼.",
    source: "X",
    url: "#",
    tags: ["MCP", "Browser Use", "Automation"],
    practicalScore: 88,
    risk: "low",
    tools: ["Playwright MCP", "Claude Code", "Node.js"],
    redditMentions: 312,
    xReposts: 1850,
    weekNumber: 21,
  },
  {
    id: "3",
    title: "Lovable → Supabase → Cloudflare Workers 풀스택 스택이 인기",
    summary:
      "Design-to-Code부터 배포까지 90분 만에 완성하는 워크플로우. Lovable로 UI 생성, Supabase로 백엔드, Cloudflare Workers로 엣지 배포.",
    source: "GitHub",
    url: "#",
    tags: ["Design-to-Code", "Fullstack", "Automation"],
    practicalScore: 92,
    risk: "low",
    tools: ["Lovable", "Supabase", "Cloudflare Workers", "TanStack Start"],
    redditMentions: 220,
    githubStars: 3400,
    xReposts: 990,
    weekNumber: 21,
  },
  {
    id: "4",
    title: "Multi-Agent 패턴: Planner → Executor → Reviewer",
    summary:
      "단일 LLM 호출 대신 역할을 나눠 품질을 높이는 접근. Planner가 태스크 분해, Executor가 코드 생성, Reviewer가 검증. 토큰 비용은 3~4배 증가.",
    source: "HN",
    url: "#",
    tags: ["Agent", "Workflow", "Prompting"],
    practicalScore: 79,
    risk: "high",
    tools: ["Claude API", "LangGraph", "CrewAI"],
    redditMentions: 445,
    xReposts: 1200,
    weekNumber: 21,
  },
  {
    id: "5",
    title: "v0 + shadcn/ui 컴포넌트를 Cursor에 붙여넣는 워크플로우",
    summary:
      "v0에서 컴포넌트 생성 후 복사 → Cursor에서 프로젝트에 맞게 수정. 디자인 시스템 없이도 일관된 UI를 빠르게 만드는 방법.",
    source: "X",
    url: "#",
    tags: ["Design-to-Code", "Frontend", "AI IDE"],
    practicalScore: 85,
    risk: "low",
    tools: ["v0", "Cursor", "shadcn/ui", "Tailwind"],
    redditMentions: 178,
    xReposts: 3100,
    weekNumber: 21,
  },
  {
    id: "6",
    title: "Context7 MCP — 항상 최신 라이브러리 문서를 컨텍스트에 주입",
    summary:
      "hallucination 줄이는 핵심 도구로 급부상. Claude Code에 연결하면 npm 패키지 최신 문서를 자동으로 참조해 deprecated API 사용 빈도 대폭 감소.",
    source: "GitHub",
    url: "#",
    tags: ["MCP", "Prompting", "Workflow"],
    practicalScore: 91,
    risk: "low",
    tools: ["Context7 MCP", "Claude Code", "Cursor"],
    githubStars: 8700,
    xReposts: 2800,
    weekNumber: 21,
  },
];

export const githubTrending: GitHubRepo[] = [
  {
    name: "microsoft/markitdown",
    description: "PDF, Office, HTML을 Markdown으로 변환하는 LLM 친화적 파서",
    stars: 48200,
    starsToday: 1240,
    language: "Python",
    url: "#",
    tags: ["Automation", "Workflow"],
    aiSummary: "RAG 파이프라인의 문서 전처리 단계로 사실상 표준이 되고 있음",
  },
  {
    name: "browser-use/browser-use",
    description: "AI 에이전트가 브라우저를 직접 제어하는 라이브러리",
    stars: 35800,
    starsToday: 890,
    language: "Python",
    url: "#",
    tags: ["Browser Use", "Agent"],
    aiSummary: "Playwright MCP에 비해 설정 간단. 단순 자동화에 적합",
  },
  {
    name: "anthropics/claude-code",
    description: "터미널에서 Claude를 직접 사용하는 AI 코딩 CLI",
    stars: 29100,
    starsToday: 760,
    language: "TypeScript",
    url: "#",
    tags: ["AI IDE", "Agent", "MCP"],
    aiSummary: "이번 주 가장 많이 언급된 도구. MCP 생태계와 함께 급성장",
  },
  {
    name: "vercel/ai",
    description: "Next.js에서 AI 기능을 쉽게 추가하는 Vercel AI SDK",
    stars: 18600,
    starsToday: 420,
    language: "TypeScript",
    url: "#",
    tags: ["Frontend", "Fullstack"],
    aiSummary: "useChat, useCompletion 훅으로 AI 채팅 UI 5분 만에 구현 가능",
  },
];

export const communitySignals: CommunitySignal[] = [
  { keyword: "claude code", mentions: 4820, trend: "up", source: "Reddit + X" },
  { keyword: "MCP server", mentions: 3140, trend: "up", source: "GitHub + Discord" },
  { keyword: "vibe coding", mentions: 2890, trend: "up", source: "X" },
  { keyword: "cursor agent", mentions: 2110, trend: "stable", source: "Reddit" },
  { keyword: "browser-use", mentions: 1780, trend: "up", source: "GitHub" },
  { keyword: "lovable", mentions: 1430, trend: "up", source: "X + Discord" },
  { keyword: "langchain", mentions: 980, trend: "down", source: "Reddit" },
  { keyword: "autogen", mentions: 640, trend: "down", source: "HN" },
];

export const summaryCards = {
  trendingTool: {
    name: "Claude Code",
    change: "+284%",
    description: "터미널 기반 AI 코딩의 새 표준",
  },
  hotTopic: {
    name: "MCP Explosion",
    description: "이번 주 신규 MCP 서버 47개 등록",
  },
  topWorkflow: {
    name: "Claude Code + Context7 + Playwright",
    description: "문서 참조 → 코드 생성 → 브라우저 검증 자동화",
  },
  communityQuote: {
    text: '"Cursor에서 Claude Code로 갈아탔는데 돌아갈 생각이 없어요"',
    author: "r/ClaudeAI 주간 top comment",
  },
};
