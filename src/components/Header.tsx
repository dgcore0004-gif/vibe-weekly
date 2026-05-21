import { useState } from "react";
import { Search, Rss, Zap } from "./Icons";

interface HeaderProps {
  onSearch: (q: string) => void;
  onSubscribe: () => void;
}

export function Header({ onSearch, onSubscribe }: HeaderProps) {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-600">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Vibe Weekly</span>
          </div>

          <div className="flex-1" />

          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="툴, 워크플로우 검색..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="h-8 w-52 rounded-md border border-zinc-800 bg-zinc-900 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-purple-600 transition-all"
            />
          </div>

          <button
            onClick={onSubscribe}
            className="flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500 transition-colors"
          >
            <Rss size={14} />
            구독
          </button>
        </div>
      </div>
    </header>
  );
}
