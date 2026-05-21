import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SummaryCards } from "./components/SummaryCards";
import { FilterBar } from "./components/FilterBar";
import { TrendCard } from "./components/TrendCard";
import { GitHubSection } from "./components/GitHubSection";
import { CommunityRadar } from "./components/CommunityRadar";
import { Newsletter } from "./components/Newsletter";
import { SubscribeModal } from "./components/SubscribeModal";
import type { SiteData, Tag, Sort } from "./data/types";
import { Zap, Loader2 } from "./components/Icons";

export default function App() {
  const feedRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [activeSort, setActiveSort] = useState<Sort>("hot");

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then((d: SiteData) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function scrollToFeed() {
    feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filtered = (data?.trendPosts ?? [])
    .filter((p) => {
      const matchTag = activeTag ? p.tags.includes(activeTag) : true;
      const q = searchQuery.toLowerCase();
      const matchSearch = q
        ? p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tools.some((t) => t.toLowerCase().includes(q))
        : true;
      return matchTag && matchSearch;
    })
    .sort((a, b) => {
      if (activeSort === "hot") {
        const sig = (p: typeof a) =>
          (p.redditMentions ?? 0) + (p.xReposts ?? 0) + (p.githubStars ?? 0) / 10;
        return sig(b) - sig(a);
      }
      if (activeSort === "practical") return b.practicalScore - a.practicalScore;
      if (activeSort === "discussed")
        return (
          (b.redditMentions ?? 0) +
          (b.xReposts ?? 0) -
          ((a.redditMentions ?? 0) + (a.xReposts ?? 0))
        );
      return 0;
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 size={24} className="text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header onSearch={setSearchQuery} onSubscribe={() => setSubscribeOpen(true)} />

      <Hero
        weekNumber={data?.weekNumber ?? 0}
        lastUpdated={data?.lastUpdated ?? ""}
        totalCollected={data?.totalCollected ?? 0}
        onScrollToFeed={scrollToFeed}
        onSubscribe={() => setSubscribeOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
        {data && (
          <section>
            <SummaryCards cards={data.summaryCards} />
          </section>
        )}

        <section ref={feedRef} className="scroll-mt-20">
          <div className="mb-5 flex items-center gap-2">
            <Zap size={16} className="text-purple-400" />
            <h2 className="text-sm font-semibold text-zinc-200">이번 주 트렌드 피드</h2>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
              {filtered.length}개
            </span>
          </div>

          <div className="mb-5">
            <FilterBar
              activeTag={activeTag}
              activeSort={activeSort}
              onTagChange={setActiveTag}
              onSortChange={setActiveSort}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 py-16 text-center">
              <p className="text-sm text-zinc-600">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <TrendCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {data && <GitHubSection repos={data.githubTrending} />}
        {data && <CommunityRadar signals={data.communitySignals} />}

        <Newsletter />
      </main>

      <footer className="border-t border-zinc-800 px-4 py-8 text-center text-xs text-zinc-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={14} className="text-purple-500" />
          <span className="font-medium text-zinc-500">Vibe Weekly</span>
        </div>
        <p>AI 개발자들을 위한 주간 바이브코딩 트렌드 레이더</p>
        <p className="mt-1">매주 금요일 자동 업데이트 · 실전 workflow 중심 큐레이션</p>
      </footer>

      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  );
}
