import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-orange-500 py-16 text-white md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,theme(colors.orange.400),transparent_60%)]"
      />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="cta-heading"
          className="text-3xl font-bold tracking-tight md:text-4xl"
        >
          오늘 첫 레슨을 시작해봐요
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
          40분이면 충분합니다. 어려우면 여기서 멈추셔도 괜찮아요.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/lessons/0/what-is-photoshop"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-orange-600 shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
          >
            Level 0 · 레슨 1 시작하기
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/80">
          가입 필요 없음 · 진도 자동 저장 · 모바일 지원
        </p>
      </div>
    </section>
  );
}
