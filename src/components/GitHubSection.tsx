import { Star, TrendingUp, ExternalLink } from "./Icons";
import type { GitHubRepo } from "../data/types";

const LANG_COLORS: Record<string, string> = {
  Python: "bg-blue-500",
  TypeScript: "bg-sky-400",
  JavaScript: "bg-yellow-400",
  Go: "bg-cyan-400",
  Rust: "bg-orange-500",
};

export function GitHubSection({ repos }: { repos: GitHubRepo[] }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-purple-400" />
        <h2 className="text-sm font-semibold text-zinc-200">GitHub Trending</h2>
        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">이번 주</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {repos.map((repo) => (
          <div key={repo.name} className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900">
            <div className="mb-2 flex items-start justify-between gap-2">
              <a href={repo.url} target="_blank" rel="noopener noreferrer"
                className="font-mono text-sm font-medium text-zinc-200 hover:text-purple-300 transition-colors">
                {repo.name}
              </a>
              <ExternalLink size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
            </div>

            <p className="mb-3 text-xs leading-relaxed text-zinc-500">{repo.description}</p>

            <div className="mb-3 rounded-md border border-cyan-600/20 bg-cyan-500/5 px-3 py-2">
              <p className="text-xs text-cyan-300/80 leading-relaxed">💡 {repo.aiSummary}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {repo.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0">
                <span className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${LANG_COLORS[repo.language] ?? "bg-zinc-500"}`} />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {repo.stars.toLocaleString()}
                  <span className="text-green-400">+{repo.starsToday}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
