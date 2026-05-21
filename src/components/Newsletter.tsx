import { useState } from "react";
import { Mail, CheckCircle } from "./Icons";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="rounded-2xl border border-purple-600/20 bg-gradient-to-br from-purple-600/10 via-zinc-900 to-cyan-600/5 p-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20 border border-purple-600/30">
          <Mail size={20} className="text-purple-400" />
        </div>
      </div>

      <h2 className="mb-2 text-xl font-bold text-zinc-100">
        매주 금요일, 실전 AI Workflow만 정리해서
      </h2>
      <p className="mb-6 text-sm text-zinc-500">
        뉴스 복붙 없음. 실제로 써본 개발자들의 패턴만. 구독자 2,400명+
      </p>

      {submitted ? (
        <div className="flex items-center justify-center gap-2 text-green-400">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">구독 완료! 다음 주 금요일에 뵙겠습니다.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
          <input
            type="email"
            required
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-purple-500 transition-all"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
          >
            구독하기
          </button>
        </form>
      )}

      <p className="mt-4 text-xs text-zinc-600">스팸 없음 · 언제든 구독 취소 가능 · 매주 금요일 발송</p>
    </section>
  );
}
