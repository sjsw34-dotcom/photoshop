import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { LEVEL_SECTIONS } from "@/lib/curriculum";
import { getAllLessons, type LessonRecord } from "@/lib/lessons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "커리큘럼",
  description: "포토샵 아카데미 80레슨 전체 지도",
};

function lessonMap(): Map<string, LessonRecord> {
  const map = new Map<string, LessonRecord>();
  for (const l of getAllLessons()) map.set(l.slug, l);
  return map;
}

export default function CurriculumPage() {
  const records = lessonMap();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
          커리큘럼 지도
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          80레슨으로 가는 길
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          네 개 레벨로 나누어 기초부터 실무까지 차근차근 올라가요. 각 레벨의
          마지막 실습 프로젝트가 졸업 조건이에요.
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {LEVEL_SECTIONS.map((section) => (
          <section
            key={section.level}
            id={`level-${section.level}`}
            className="scroll-mt-24"
          >
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Level {section.level}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {section.emoji} {section.name.split(" · ")[1] ?? section.name}
                  </h2>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {section.estimatedWeeks}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  졸업 조건.
                </span>{" "}
                {section.graduation}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {section.groups.map((group) => (
                <div key={group.name}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {group.name}
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {group.lessons.map((l) => {
                      const rec = records.get(l.slug);
                      const ready = !!rec?.hasContent;
                      const href = ready
                        ? `/lessons/${l.level}/${l.slug}`
                        : `#lesson-${l.order}`;
                      return (
                        <li key={l.slug} id={`lesson-${l.order}`}>
                          <Link
                            href={href}
                            aria-disabled={!ready}
                            className={cn(
                              "group block h-full rounded-xl border p-4 transition-colors",
                              l.isProject
                                ? "border-orange-300 bg-orange-50 dark:border-orange-500/60 dark:bg-orange-950/30"
                                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
                              ready
                                ? "hover:border-orange-400 hover:shadow-sm dark:hover:border-orange-500"
                                : "cursor-not-allowed opacity-70",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="tabular-nums">#{l.order}</span>
                                  {l.isProject ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 font-semibold text-orange-600 dark:text-orange-300">
                                      <Sparkles aria-hidden className="h-3 w-3" />
                                      실습
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">
                                  {l.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  예상 {l.duration}분
                                </p>
                              </div>
                              <span
                                aria-hidden
                                className={cn(
                                  "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                  ready
                                    ? "bg-orange-500 text-white group-hover:bg-orange-600"
                                    : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
                                )}
                              >
                                {ready ? (
                                  <ArrowRight className="h-4 w-4" />
                                ) : (
                                  <Lock className="h-3.5 w-3.5" />
                                )}
                              </span>
                            </div>
                            {ready ? (
                              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                지금 배울 수 있어요
                              </p>
                            ) : (
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                콘텐츠 준비 중
                              </p>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
