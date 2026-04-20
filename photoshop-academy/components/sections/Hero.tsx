import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,theme(colors.orange.100),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,theme(colors.orange.900/.3),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-12 md:py-24 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-500">
            디자인공학과 복학생을 위한 학습 플랫폼
          </p>
          <h1
            id="hero-heading"
            className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-50"
          >
            기초부터 천천히,
            <br />
            포토샵을 내 것으로
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
            하루 1시간씩 꾸준히. 3-4개월 뒤에는 학과 과제를 혼자 해냅니다.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-400">
            동영상 없이도 따라할 수 있게 설계했습니다. 기초가 전혀 없어도 괜찮아요.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/lessons/0/what-is-photoshop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow"
            >
              무료로 시작하기
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link
              href="/curriculum"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              커리큘럼 먼저 보기
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            가입 필요 없음 · 진도 자동 저장 · 모바일 지원
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md" aria-hidden>
          <div className="absolute -inset-6 -z-10 rounded-[40px] bg-orange-500/10 blur-3xl" />
          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                Level 0 · 레슨 1
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                약 40분
              </span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">
              포토샵이 뭐고 왜 쓰나요
            </h3>
            <ol className="mt-5 space-y-3 text-sm">
              {[
                { n: 1, text: "포토샵을 일상 비유로 이해하기", active: true },
                { n: 2, text: "포토샵이 잘하는 일 세 가지", active: false },
                { n: 3, text: "오늘 배운 것 스스로 확인", active: false },
              ].map((item) => (
                <li key={item.n} className="flex items-start gap-3">
                  <span
                    className={
                      item.active
                        ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white"
                        : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }
                  >
                    {item.n}
                  </span>
                  <span
                    className={
                      item.active
                        ? "pt-1 text-slate-900 dark:text-slate-100"
                        : "pt-1 text-slate-500 dark:text-slate-400"
                    }
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-xs dark:bg-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                진도 자동 저장 중
              </span>
              <span className="font-semibold text-orange-500 tabular-nums">
                1 / 3
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
