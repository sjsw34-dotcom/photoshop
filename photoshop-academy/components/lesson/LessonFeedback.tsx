"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

interface LessonFeedbackProps {
  slug: string;
}

export function LessonFeedback({ slug }: LessonFeedbackProps) {
  const current = useProgress((s) => s.lessons[slug]?.feedback ?? null);
  const setFeedback = useProgress((s) => s.setFeedback);

  const vote = (value: "up" | "down") => {
    setFeedback(slug, current === value ? null : value);
  };

  return (
    <section
      aria-label="레슨 피드백"
      className="my-8 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900"
    >
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        이 레슨은 어땠어요
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => vote("up")}
          aria-pressed={current === "up"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            current === "up"
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
          )}
        >
          <ThumbsUp aria-hidden className="h-4 w-4" />
          도움됐어요
        </button>
        <button
          type="button"
          onClick={() => vote("down")}
          aria-pressed={current === "down"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            current === "down"
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
          )}
        >
          <ThumbsDown aria-hidden className="h-4 w-4" />
          좀 더 다듬어주세요
        </button>
      </div>
    </section>
  );
}
