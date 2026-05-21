import type { Tag, Sort } from "../data/types";

const TAGS: Tag[] = [
  "MCP", "Agent", "AI IDE", "Frontend", "Fullstack",
  "Workflow", "Prompting", "Automation", "Design-to-Code", "Browser Use",
];

const SORTS: { value: Sort; label: string }[] = [
  { value: "hot", label: "🔥 Hot" },
  { value: "new", label: "✨ New" },
  { value: "discussed", label: "💬 Most Discussed" },
  { value: "practical", label: "⚡ Most Practical" },
];

interface FilterBarProps {
  activeTag: Tag | null;
  activeSort: Sort;
  onTagChange: (tag: Tag | null) => void;
  onSortChange: (sort: Sort) => void;
}

export function FilterBar({ activeTag, activeSort, onTagChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Tag filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onTagChange(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeTag === null
              ? "bg-purple-600 text-white"
              : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
          }`}
        >
          All
        </button>
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(activeTag === tag ? null : tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === tag
                ? "bg-purple-600 text-white"
                : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value as Sort)}
        className="h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-400 outline-none focus:border-purple-600 shrink-0"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
