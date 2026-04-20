import type { Metadata } from "next";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import { getGlossary } from "@/lib/glossary";
import { getAllLessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "용어 사전",
  description: "포토샵에서 자주 쓰는 용어를 쉬운 말로 풀어두었어요",
};

export default function GlossaryPage() {
  const items = getGlossary();
  const lessons = getAllLessons();
  const lessonTitles: Record<
    string,
    { title: string; level: number; hasContent: boolean }
  > = {};
  for (const l of lessons) {
    lessonTitles[l.slug] = {
      title: l.title,
      level: l.level,
      hasContent: l.hasContent,
    };
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
          용어 사전
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          낯선 말을 쉬운 말로
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          레슨에서 나오는 용어를 일상 비유와 함께 정리했어요. 검색으로
          빠르게 찾을 수 있어요.
        </p>
      </header>

      <GlossaryBrowser items={items} lessonTitles={lessonTitles} />
    </div>
  );
}
