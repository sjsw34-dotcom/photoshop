"use client";

import { BADGES } from "@/lib/badges";
import { cn } from "@/lib/utils";

interface BadgeGalleryProps {
  earned: string[];
  mounted: boolean;
}

export function BadgeGallery({ earned, mounted }: BadgeGalleryProps) {
  const earnedSet = new Set(earned);
  const earnedCount = mounted ? earnedSet.size : 0;

  return (
    <section aria-label="획득한 배지" className="mt-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          배지
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {earnedCount} / {BADGES.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {BADGES.map((b) => {
          const got = mounted && earnedSet.has(b.id);
          return (
            <li
              key={b.id}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition-colors",
                got
                  ? "border-orange-200 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-950/30"
                  : "border-slate-200 bg-white opacity-60 grayscale dark:border-slate-800 dark:bg-slate-900",
              )}
              title={got ? b.description : `잠김: ${b.description}`}
            >
              <span
                aria-hidden
                className={cn(
                  "text-3xl",
                  got ? "" : "opacity-50",
                )}
              >
                {b.emoji}
              </span>
              <p
                className={cn(
                  "text-xs font-semibold",
                  got
                    ? "text-orange-700 dark:text-orange-200"
                    : "text-slate-500 dark:text-slate-400",
                )}
              >
                {b.name}
              </p>
              <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {b.description}
              </p>
              <span className="sr-only">
                {got ? "획득함" : "아직 획득 전"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
