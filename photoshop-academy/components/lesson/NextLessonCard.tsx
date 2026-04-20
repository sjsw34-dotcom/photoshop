import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { getNextLesson } from "@/lib/lessons";
import { LEVELS } from "@/lib/constants";

interface NextLessonCardProps {
  currentSlug: string;
}

export function NextLessonCard({ currentSlug }: NextLessonCardProps) {
  const next = getNextLesson(currentSlug);

  if (!next) {
    return (
      <div className="my-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
          마지막 레슨
        </p>
        <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-50">
          🎉 커리큘럼의 끝까지 오셨어요
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          수고하셨어요. 배운 걸 실전에 써볼 차례예요.
        </p>
      </div>
    );
  }

  const levelInfo = LEVELS[next.level];
  const locked = !next.hasContent;
  const href = locked
    ? `/curriculum#lesson-${next.order}`
    : `/lessons/${next.level}/${next.slug}`;

  return (
    <Link
      href={href}
      className="my-10 block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/60 dark:hover:bg-slate-900"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
        다음 레슨
      </p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {next.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {levelInfo.name} · 예상 {next.duration}분
          </p>
        </div>
        <span
          aria-hidden
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </span>
      </div>
      {locked ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          다음 레슨은 아직 준비 중이에요. 커리큘럼 지도에서 전체 흐름을 볼 수 있어요.
        </p>
      ) : null}
    </Link>
  );
}
