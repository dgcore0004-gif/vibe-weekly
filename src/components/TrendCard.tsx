import {
  ExternalLink, GitCommitHorizontal, MessageCircle,
  Repeat2, AlertTriangle, CheckCircle, AlertCircle,
} from "./Icons";
import type { TrendPost } from "../data/types";

const SOURCE_COLORS: Record<TrendPost["source"], string> = {
  Reddit: "text-orange-400 bg-orange-500/10 border-orange-600/20",
  X: "text-sky-400 bg-sky-500/10 border-sky-600/20",
  GitHub: "text-zinc-300 bg-zinc-700/30 border-zinc-600/30",
  HN: "text-amber-400 bg-amber-500/10 border-amber-600/20",
  Discord: "text-indigo-400 bg-indigo-500/10 border-indigo-600/20",
  YouTube: "text-red-400 bg-red-500/10 border-red-600/20",
};

const RISK_CONFIG = {
  low: { icon: CheckCircle, color: "text-green-400", label: "안정" },
  medium: { icon: AlertCircle, color: "text-amber-400", label: "보통" },
  high: { icon: AlertTriangle, color: "text-red-400", label: "주의" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "bg-green-500" : score >= 75 ? "bg-amber-500" : "bg-zinc-600";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-zinc-400">{score}</span>
    </div>
  );
}

export function TrendCard({ post }: { post: TrendPost }) {
  const risk = RISK_CONFIG[post.risk];
  const RiskIcon = risk.icon;

  return (
    <article className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${SOURCE_COLORS[post.source]}`}>
            {post.source}
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-zinc-800 bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
        <a href={post.url} target="_blank" rel="noopener noreferrer"
          className="shrink-0 rounded-md p-1 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-300">
          <ExternalLink size={14} />
        </a>
      </div>

      <h3 className="mb-2 text-sm font-semibold leading-snug text-zinc-100">{post.title}</h3>
      <p className="mb-4 text-xs leading-relaxed text-zinc-500">{post.summary}</p>

      <div className="mb-4 flex flex-wrap gap-1">
        {post.tools.map((t) => (
          <span key={t} className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-400">{t}</span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-3 text-zinc-600 text-xs">
          {post.redditMentions && (
            <span className="flex items-center gap-1">
              <MessageCircle size={12} />{post.redditMentions.toLocaleString()}
            </span>
          )}
          {post.githubStars && (
            <span className="flex items-center gap-1">
              <GitCommitHorizontal size={12} />{post.githubStars.toLocaleString()}
            </span>
          )}
          {post.xReposts && (
            <span className="flex items-center gap-1">
              <Repeat2 size={12} />{post.xReposts.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <RiskIcon size={12} className={risk.color} />
            <span className={`text-xs ${risk.color}`}>{risk.label}</span>
          </div>
          <ScoreBar score={post.practicalScore} />
        </div>
      </div>
    </article>
  );
}
