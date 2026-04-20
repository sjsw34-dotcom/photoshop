import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Clock, Home } from "lucide-react";
import {
  getAvailableLessonParams,
  getLessonForRoute,
  getNextLesson,
  getPrevLesson,
} from "@/lib/lessons";
import { LEVELS } from "@/lib/constants";
import { LessonFeedback } from "@/components/lesson/LessonFeedback";
import { LessonProgressBar } from "@/components/lesson/LessonProgressBar";
import { LessonTracker } from "@/components/lesson/LessonTracker";
import { NextLessonCard } from "@/components/lesson/NextLessonCard";
import { ScrollToTop } from "@/components/lesson/ScrollToTop";

interface LessonPageProps {
  params: Promise<{ level: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAvailableLessonParams();
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { level, slug } = await params;
  const lesson = getLessonForRoute(level, slug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.objectives[0] ?? lesson.title,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { level, slug } = await params;
  const lesson = getLessonForRoute(level, slug);
  if (!lesson || !lesson.hasContent) notFound();

  const levelInfo = LEVELS[lesson.level];
  const prev = getPrevLesson(slug);
  const next = getNextLesson(slug);

  const { default: LessonContent } = await import(
    `@/content/lessons/${lesson.folder}/${lesson.slug}.mdx`
  );

  return (
    <>
      <LessonProgressBar />
      <LessonTracker slug={lesson.slug} />

      <article className="mx-auto w-full max-w-3xl px-4 pb-20 pt-6 sm:px-6">
        <nav
          aria-label="breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-300"
          >
            <Home aria-hidden className="h-3.5 w-3.5" />홈
          </Link>
          <ChevronRight aria-hidden className="h-3.5 w-3.5 text-slate-400" />
          <Link
            href={`/curriculum#level-${lesson.level}`}
            className="hover:text-orange-600 dark:hover:text-orange-300"
          >
            {levelInfo.name}
          </Link>
          <ChevronRight aria-hidden className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate text-slate-700 dark:text-slate-200">
            {lesson.title}
          </span>
        </nav>

        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
            <span>{levelInfo.emoji} {levelInfo.name}</span>
            {lesson.groupLabel ? (
              <>
                <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {lesson.groupLabel}
                </span>
              </>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {lesson.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="h-3.5 w-3.5" />
              예상 {lesson.duration}분
            </span>
            <span aria-hidden>·</span>
            <span>레슨 #{lesson.order}</span>
          </div>
          {lesson.objectives.length > 0 ? (
            <ul className="mt-6 list-disc space-y-1 rounded-xl border border-slate-200 bg-slate-50 px-6 py-4 pl-9 text-sm text-slate-700 marker:text-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {lesson.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          ) : null}
        </header>

        <div className="lesson-body">
          <LessonContent />
        </div>

        <LessonFeedback slug={lesson.slug} />

        <nav
          aria-label="레슨 이동"
          className="mt-10 grid gap-3 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={
                prev.hasContent
                  ? `/lessons/${prev.level}/${prev.slug}`
                  : `/curriculum#lesson-${prev.order}`
              }
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/60"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">← 이전 레슨</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={
                next.hasContent
                  ? `/lessons/${next.level}/${next.slug}`
                  : `/curriculum#lesson-${next.order}`
              }
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/60 sm:text-right"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">다음 레슨 →</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">
                {next.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        <NextLessonCard currentSlug={lesson.slug} />
      </article>

      <ScrollToTop />
    </>
  );
}
