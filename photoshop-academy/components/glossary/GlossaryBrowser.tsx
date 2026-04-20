"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  CATEGORY_LABELS,
  type GlossaryCategory,
  type GlossaryItem,
} from "@/lib/glossary";
import { cn } from "@/lib/utils";

interface GlossaryBrowserProps {
  items: GlossaryItem[];
  lessonTitles: Record<string, { title: string; level: number; hasContent: boolean }>;
}

const CATEGORIES: (GlossaryCategory | "all")[] = [
  "all",
  "basic",
  "layer",
  "tool",
  "color",
  "effect",
  "advanced",
];

export function GlossaryBrowser({ items, lessonTitles }: GlossaryBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.easyDefinition.toLowerCase().includes(q)
      );
    });
  }, [items, query, category]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex flex-1 items-center">
          <Search
            aria-hidden
            className="absolute left-3 h-4 w-4 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="용어를 한글/영문으로 검색해요"
            className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-2 focus:outline-offset-0 focus:outline-orange-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            aria-label="용어 검색"
          />
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const label = c === "all" ? "전체" : CATEGORY_LABELS[c];
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-orange-500/60",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        {filtered.length}개의 용어
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          조건에 맞는 용어가 없어요. 검색어를 바꿔보세요.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item) => (
            <li
              key={item.term}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {item.term}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.english}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {item.easyDefinition}
              </p>
              {item.analogy ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  🍎 {item.analogy}
                </p>
              ) : null}
              {item.relatedLessons.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.relatedLessons.map((slug) => {
                    const lesson = lessonTitles[slug];
                    if (!lesson) return null;
                    return (
                      <Link
                        key={slug}
                        href={
                          lesson.hasContent
                            ? `/lessons/${lesson.level}/${slug}`
                            : `/curriculum`
                        }
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                          lesson.hasContent
                            ? "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 dark:text-orange-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                        )}
                      >
                        {lesson.title}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
