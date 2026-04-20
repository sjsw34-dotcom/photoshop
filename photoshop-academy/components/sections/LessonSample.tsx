import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LessonSample() {
  return (
    <section
      aria-labelledby="sample-heading"
      className="border-y border-slate-200 bg-slate-50 py-16 md:py-24 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Sample Lesson
          </p>
          <h2
            id="sample-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50"
          >
            Level 0 · 첫 레슨을 지금 열어볼 수 있어요
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            가입이나 로그인 없이, 진짜 레슨이 어떤 모양인지 바로 확인해봐요.
          </p>
        </div>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-950">
          <header className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-semibold text-orange-500">
              레슨 1 · 포토샵이 뭐고 왜 쓰나요
            </span>
            <span className="text-slate-500 dark:text-slate-400">약 40분</span>
          </header>

          <h3 className="mt-5 text-xl font-bold text-slate-900 md:text-2xl dark:text-slate-50">
            🍎 일상 비유로 먼저 이해하기
          </h3>

          <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-800 md:text-lg dark:text-slate-200">
            <p>
              포토샵은{" "}
              <strong className="text-orange-600 dark:text-orange-400">
                똑똑한 도화지
              </strong>
              예요.
            </p>
            <p>
              한 번 그려도 지울 수 있어요. 색을 바꾸거나, 크기를 키울 수도 있어요.
              옆에 다른 그림을 겹쳐 붙일 수도 있어요.
            </p>
            <p>종이 도화지로는 못 하는 일을, 컴퓨터 도화지라서 할 수 있어요.</p>
            <p className="pt-2 text-slate-600 dark:text-slate-300">
              예를 들어 볼게요. 사진 한 장이 너무 어둡다고 해봐요. 포토샵에
              불러오면 밝기를 쉽게 올릴 수 있어요.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              발췌는 여기까지예요. 정식 레슨에는 스크린샷과 체크리스트가 이어져요.
            </p>
            <Link
              href="/lessons/0/what-is-photoshop"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              이어서 읽기
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
