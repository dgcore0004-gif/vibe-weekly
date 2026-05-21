import { Radio, TrendingUp, TrendingDown, Minus } from "./Icons";
import type { CommunitySignal } from "../data/types";

export function CommunityRadar({ signals }: { signals: CommunitySignal[] }) {
  const max = Math.max(...signals.map((s) => s.mentions));

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Radio size={16} className="text-cyan-400" />
        <h2 className="text-sm font-semibold text-zinc-200">Community Radar</h2>
        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
          Reddit · X · GitHub · HN
        </span>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800">
        {signals.map((signal, i) => {
          const TrendIcon = signal.trend === "up" ? TrendingUp : signal.trend === "down" ? TrendingDown : Minus;
          const trendColor = signal.trend === "up" ? "text-green-400" : signal.trend === "down" ? "text-red-400" : "text-zinc-500";
          const barWidth = Math.round((signal.mentions / max) * 100);

          return (
            <div key={signal.keyword} className="flex items-center gap-4 px-4 py-3">
              <span className="w-5 text-xs text-zinc-600 font-mono">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-mono font-medium text-zinc-200 truncate">#{signal.keyword}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <TrendIcon size={14} className={trendColor} />
                    <span className="text-xs font-medium text-zinc-400">{signal.mentions.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${signal.trend === "up" ? "bg-purple-500" : signal.trend === "down" ? "bg-zinc-600" : "bg-zinc-700"}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs text-zinc-600">{signal.source}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
