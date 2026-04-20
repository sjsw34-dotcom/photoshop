"use client";

import { Download } from "lucide-react";
import { useProgress } from "@/lib/store";

interface PracticeFileProps {
  href: string;
  label?: string;
  sizeHint?: string;
  lessonSlug?: string;
}

export function PracticeFile({
  href,
  label = "연습 파일 다운로드",
  sizeHint,
  lessonSlug,
}: PracticeFileProps) {
  const mark = useProgress((s) => s.markPracticeDownloaded);

  return (
    <div className="my-6 flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900/60 dark:bg-orange-950/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-orange-700 dark:text-orange-200">
          🎨 연습 파일
        </p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          {label}
          {sizeHint ? (
            <span className="ml-2 text-slate-500 dark:text-slate-400">
              ({sizeHint})
            </span>
          ) : null}
        </p>
      </div>
      <a
        href={href}
        download
        onClick={() => lessonSlug && mark(lessonSlug)}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        <Download aria-hidden className="h-4 w-4" />
        다운로드
      </a>
    </div>
  );
}
