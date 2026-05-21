import { useState } from "react";
import { X, Mail, CheckCircle } from "./Icons";

interface SubscribeModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubscribeModal({ open, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<"beginner" | "advanced">("advanced");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-md p-1 text-zinc-600 hover:text-zinc-300 transition-colors">
          <X size={14} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 border border-purple-600/30">
            <Mail size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">Newsletter 구독</h3>
            <p className="text-xs text-zinc-500">매주 금요일 · AI Workflow 큐레이션</p>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle size={40} className="text-green-400" />
            <p className="text-sm font-medium text-zinc-200">구독 완료!</p>
            <p className="text-xs text-zinc-500">다음 주 금요일에 뵙겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">이메일</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">레벨</label>
              <div className="flex gap-2">
                {(["beginner", "advanced"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors ${
                      level === l
                        ? "border-purple-600 bg-purple-600/20 text-purple-300"
                        : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >
                    {l === "beginner" ? "🌱 입문자" : "⚡ 실무자"}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-500 transition-colors">
              구독하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
