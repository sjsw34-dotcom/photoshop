"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Flame, Sparkles, Trophy } from "lucide-react";
import { PracticeGallery, type GalleryLesson } from "@/components/progress/PracticeGallery";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { LEVELS, type LevelId } from "@/lib/constants";
import { useProgress } from "@/lib/store";

interface DashboardLesson {
  slug: string;
  title: string;
  level: LevelId;
  order: number;
  duration: number;
  hasContent: boolean;
  hasPractice: boolean;
}

interface LevelSummary {
  level: LevelId;
  total: number;
  firstAvailableSlug: string | null;
}

interface DashboardContentProps {
  lessons: DashboardLesson[];
  levels: LevelSummary[];
}

function formatDate(d: Date) {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
}

export function DashboardContent({ lessons, levels }: DashboardContentProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const streak = useProgress((s) => s.streak);
  const totalMinutes = useProgress((s) => s.totalMinutes);
  const longestStreak = useProgress((s) => s.longestStreak);
  const lastLessonSlug = useProgress((s) => s.lastLessonSlug);
  const lessonsState = useProgress((s) => s.lessons);

  const lessonBySlug = new Map(lessons.map((l) => [l.slug, l]));

  const levelStats = levels.map((lv) => {
    const inLevel = lessons.filter((l) => l.level === lv.level);
    const completed = inLevel.filter(
      (l) => lessonsState[l.slug]?.status === "completed",
    ).length;
    return {
      ...lv,
      completed,
      pct: lv.total === 0 ? 0 : Math.round((completed / lv.total) * 100),
    };
  });

  const completedAll = lessons.filter(
    (l) => lessonsState[l.slug]?.status === "completed",
  ).length;
  const overallPct =
    lessons.length === 0 ? 0 : Math.round((completedAll / lessons.length) * 100);

  const resumeCandidate = (() => {
    if (lastLessonSlug && lessonBySlug.has(lastLessonSlug)) {
      const l = lessonBySlug.get(lastLessonSlug)!;
      if (l.hasContent) return l;
    }
    const inProgress = lessons.find(
      (l) =>
        l.hasContent && lessonsState[l.slug]?.status === "in_progress",
    );
    if (inProgress) return inProgress;
    const firstReady = lessons.find(
      (l) => l.hasContent && lessonsState[l.slug]?.status !== "completed",
    );
    return firstReady ?? null;
  })();

  const resumeState = resumeCandidate
    ? lessonsState[resumeCandidate.slug]
    : null;

  const recentCompleted = Object.entries(lessonsState)
    .filter(([, v]) => v.status === "completed" && v.completedAt)
    .sort(
      (a, b) =>
        new Date(b[1].completedAt ?? 0).getTime() -
        new Date(a[1].completedAt ?? 0).getTime(),
    )
    .slice(0, 5)
    .map(([slug, v]) => ({
      slug,
      lesson: lessonBySlug.get(slug),
      completedAt: v.completedAt,
    }))
    .filter((x) => !!x.lesson);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            내 진도
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            오늘도 한 걸음 나아가요
          </h1>
          <p
            className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
            suppressHydrationWarning
          >
            <Calendar aria-hidden className="h-4 w-4" />
            {formatDate(new Date())}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-300">
          <Flame aria-hidden className="h-4 w-4" />
          <span>연속 {mounted ? streak : 0}일</span>
          {mounted && longestStreak > streak ? (
            <span className="ml-1 text-xs font-normal text-orange-500/70">
              최고 {longestStreak}일
            </span>
          ) : null}
        </div>
      </header>

      <section aria-label="이어서 학습하기" className="mb-10">
        {resumeCandidate ? (
          <Link
            href={`/lessons/${resumeCandidate.level}/${resumeCandidate.slug}?resume=1`}
            className="group relative block overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 transition-shadow hover:shadow-lg dark:border-orange-500/40 dark:from-orange-950/30 dark:to-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                  📍 이어서 학습하기
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {LEVELS[resumeCandidate.level].name} · #{resumeCandidate.order}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
                  {resumeCandidate.title}
                </h2>
                {mounted && resumeState ? (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    체크리스트 {resumeState.checklistDone.length}개 완료 ·
                    {" "}
                    {resumeState.quizScore === null
                      ? "퀴즈 미응시"
                      : `퀴즈 ${resumeState.quizScore}점`}
                  </p>
                ) : null}
              </div>
              <span
                aria-hidden
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition-transform group-hover:translate-x-1"
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              아직 열려 있는 레슨이 없어요. 커리큘럼을 먼저 둘러볼까요
            </p>
            <Link
              href="/curriculum"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-300"
            >
              커리큘럼 보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <section aria-label="레벨별 진행률" className="mb-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            레벨별 진행률
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            전체 {mounted ? overallPct : 0}% ({mounted ? completedAll : 0}/{lessons.length})
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {levelStats.map((lv) => {
            const info = LEVELS[lv.level];
            return (
              <div
                key={lv.level}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-50">
                    {info.emoji} {info.name}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {mounted ? lv.completed : 0} / {lv.total}
                  </span>
                </div>
                <ProgressBar
                  current={mounted ? lv.pct : 0}
                  showPercentage
                  label=""
                />
              </div>
            );
          })}
        </div>
      </section>

      <PracticeGallery
        lessons={lessons
          .filter((l) => l.hasPractice)
          .map<GalleryLesson>((l) => ({
            slug: l.slug,
            title: l.title,
            level: l.level,
            order: l.order,
            hasContent: l.hasContent,
          }))}
      />

      <section aria-label="최근 완료한 레슨" className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-50">
          최근 완료한 레슨
        </h2>
        {mounted && recentCompleted.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {recentCompleted.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/lessons/${r.lesson!.level}/${r.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900"
                >
                  <Trophy aria-hidden className="h-5 w-5 text-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900 dark:text-slate-50">
                      {r.lesson!.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {LEVELS[r.lesson!.level].name} · #{r.lesson!.order}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {r.completedAt
                      ? new Date(r.completedAt).toLocaleDateString("ko-KR")
                      : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <Sparkles aria-hidden className="h-5 w-5 text-orange-500" />
            아직 완료한 레슨이 없어요. 첫 레슨을 끝내면 여기에 기록돼요.
          </div>
        )}
      </section>
    </div>
  );
}
