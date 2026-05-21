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

export interface SiteData {
  weekNumber: number;
  lastUpdated: string;
  totalCollected: number;
  trendPosts: TrendPost[];
  githubTrending: GitHubRepo[];
  communitySignals: CommunitySignal[];
  summaryCards: {
    trendingTool: { name: string; change: string; description: string };
    hotTopic: { name: string; description: string };
    topWorkflow: { name: string; description: string };
    communityQuote: { text: string; author: string };
  };
}
