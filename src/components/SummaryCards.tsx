import { TrendingUp, Flame, GitBranch, MessageSquare } from "./Icons";
import type { SiteData } from "../data/types";

type Cards = SiteData["summaryCards"];

export function SummaryCards({ cards }: { cards: Cards }) {
  const items = [
    {
      icon: TrendingUp,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-600/20",
      label: "Trending Tool",
      title: cards.trendingTool.name,
      sub: cards.trendingTool.change,
      subColor: "text-green-400",
      desc: cards.trendingTool.description,
    },
    {
      icon: Flame,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-600/20",
      label: "Hot Topic",
      title: cards.hotTopic.name,
      sub: "이번 주",
      subColor: "text-amber-400",
      desc: cards.hotTopic.description,
    },
    {
      icon: GitBranch,
      iconColor: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-600/20",
      label: "Most Shared Workflow",
      title: cards.topWorkflow.name,
      sub: "검증됨",
      subColor: "text-cyan-400",
      desc: cards.topWorkflow.description,
    },
    {
      icon: MessageSquare,
      iconColor: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-600/20",
      label: "Community Signal",
      title: cards.communityQuote.text,
      sub: "",
      subColor: "",
      desc: cards.communityQuote.author,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((c) => (
        <div key={c.label} className={`rounded-xl border ${c.borderColor} ${c.bgColor} p-4 transition-all hover:scale-[1.01]`}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{c.label}</span>
            <c.icon size={16} className={c.iconColor} />
          </div>
          <div className="mb-1 flex items-baseline gap-2">
            <p className="text-sm font-semibold text-zinc-100 leading-snug line-clamp-2">{c.title}</p>
            {c.sub && <span className={`shrink-0 text-xs font-medium ${c.subColor}`}>{c.sub}</span>}
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
