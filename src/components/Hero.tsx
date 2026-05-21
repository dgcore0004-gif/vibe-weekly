import { ArrowRight, TrendingUp, Cpu, Globe } from "./Icons";

interface HeroProps {
  weekNumber: number;
  lastUpdated: string;
  totalCollected: number;
  onScrollToFeed: () => void;
  onSubscribe: () => void;
}

const TOPICS = [
  "Cursor", "Claude Code", "MCP", "Agent Workflow",
  "AI IDE", "Browser Agent", "Design-to-Code",
];

export function Hero({ weekNumber, lastUpdated, totalCollected, onScrollToFeed, onSubscribe }: HeroProps) {
  const dateStr = lastUpdated ? new Date(lastUpdated).toLocaleDateString("ko-KR") : "";

  return (
    <section className="relative overflow-hidden border-b border-zinc-800 px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute h-64 w-64 rounded-full bg-cyan-500/8 blur-3xl translate-x-32" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-600/10 px-3 py-1 text-xs text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 pulse-dot" />
          Week #{weekNumber} · {totalCollected}개 수집 · 검증 완료
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          이번 주 AI 개발자들이{" "}
          <span className="gradient-text">실제로 쓰기 시작한</span>
          <br />
          Workflow
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-sm text-zinc-400 leading-relaxed sm:text-base">
          뉴스가 아닌 <strong className="text-zinc-200">실전 패턴</strong>을 추적합니다.
          Reddit, X, GitHub, HN에서 검증된 AI 코딩 워크플로우만 큐레이션.
        </p>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {TOPICS.map((t) => (
            <span key={t} className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-colors cursor-default">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onScrollToFeed}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
          >
            이번 주 트렌드 보기
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onSubscribe}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors"
          >
            Newsletter 구독
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-center">
          {[
            { icon: TrendingUp, label: "수집 건수", value: String(totalCollected) },
            { icon: Cpu, label: "AI 요약", value: "자동화" },
            { icon: Globe, label: "업데이트", value: dateStr },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon size={16} className="text-zinc-600" />
              <span className="text-base font-semibold text-zinc-200">{value}</span>
              <span className="text-xs text-zinc-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
