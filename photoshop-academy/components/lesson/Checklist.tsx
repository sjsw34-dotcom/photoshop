"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistProps {
  lessonSlug: string;
  items: ChecklistItem[];
  title?: string;
}

const EMPTY_CHECKLIST: readonly string[] = Object.freeze([]);

export function Checklist({ lessonSlug, items, title = "스스로 확인하기" }: ChecklistProps) {
  const initLesson = useProgress((s) => s.initLesson);
  const updateChecklist = useProgress((s) => s.updateChecklist);
  const done = useProgress(
    (s) => s.lessons[lessonSlug]?.checklistDone ?? EMPTY_CHECKLIST,
  );

  useEffect(() => {
    initLesson(lessonSlug);
  }, [lessonSlug, initLesson]);

  const doneCount = items.filter((it) => done.includes(it.id)).length;

  return (
    <section
      aria-label={title}
      className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          ✅ {title}
        </h3>
        <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">
          {doneCount} / {items.length}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const checked = done.includes(item.id);
          return (
            <li key={item.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:bg-white dark:hover:bg-slate-800",
                  checked && "opacity-80",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    updateChecklist(lessonSlug, item.id, e.target.checked)
                  }
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    checked
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-500",
                  )}
                >
                  {checked ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span
                  className={cn(
                    "text-[0.95rem] leading-relaxed text-slate-800 dark:text-slate-200",
                    checked && "line-through decoration-emerald-500/70",
                  )}
                >
                  {item.text}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
