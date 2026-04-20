"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ImageOff, Sparkles } from "lucide-react";
import { defaultPractice, useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface GalleryLesson {
  slug: string;
  title: string;
  level: number;
  order: number;
  hasContent: boolean;
}

interface PracticeGalleryProps {
  lessons: GalleryLesson[];
}

export function PracticeGallery({ lessons }: PracticeGalleryProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lessonsState = useProgress((s) => s.lessons);

  if (lessons.length === 0) return null;

  const uploadedCount = mounted
    ? lessons.filter(
        (l) => (lessonsState[l.slug]?.practice ?? defaultPractice).state === "uploaded",
      ).length
    : 0;
  const partialCount = mounted
    ? lessons.filter(
        (l) => (lessonsState[l.slug]?.practice ?? defaultPractice).state === "partial",
      ).length
    : 0;
  const waitingCount = mounted ? lessons.length - uploadedCount : lessons.length;

  return (
    <section aria-label="내 실습 갤러리" className="mt-10">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          🌱 내 성장 기록
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          완성 <span className="font-semibold text-orange-600 dark:text-orange-300">{uploadedCount}장</span>
          {partialCount > 0 ? (
            <>
              {" · "}진행 중 <span className="font-semibold text-amber-600 dark:text-amber-300">{partialCount}장</span>
            </>
          ) : null}
          {" · "}대기 <span className="font-semibold text-slate-700 dark:text-slate-200">{waitingCount}장</span>
        </p>
      </div>

      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        이 갤러리는 오직 너만 봐요. 비어있는 칸이 채워질수록 네 포트폴리오가 완성돼요.
      </p>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {lessons.map((l) => {
          const practice =
            lessonsState[l.slug]?.practice ?? defaultPractice;
          const state = mounted ? practice.state : "pending";
          const thumb =
            practice.after?.thumbDataUrl ?? practice.before?.thumbDataUrl ?? null;
          const href = l.hasContent
            ? `/lessons/${l.level}/${l.slug}`
            : `/curriculum#lesson-${l.order}`;
          return (
            <li key={l.slug}>
              <Link
                href={href}
                className={cn(
                  "group block overflow-hidden rounded-xl border transition-colors",
                  state === "uploaded"
                    ? "border-orange-300 hover:border-orange-500 dark:border-orange-500/60"
                    : state === "partial"
                    ? "border-amber-300 hover:border-amber-500 dark:border-amber-500/60"
                    : state === "deferred"
                    ? "border-amber-200 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-950/20"
                    : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900",
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {thumb ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={thumb}
                      alt={`${l.title} 결과 썸네일`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      {state === "deferred" ? (
                        <span className="inline-flex flex-col items-center gap-1 text-amber-600 dark:text-amber-300">
                          <Clock className="h-6 w-6" />
                          <span className="text-xs font-medium">나중에</span>
                        </span>
                      ) : (
                        <span className="inline-flex flex-col items-center gap-1 text-slate-400">
                          <ImageOff className="h-6 w-6" />
                          <span className="text-xs">대기 중</span>
                        </span>
                      )}
                    </div>
                  )}
                  {state === "partial" ? (
                    <span className="absolute bottom-1 left-1 rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      1 / 2
                    </span>
                  ) : state === "uploaded" ? (
                    <span className="absolute bottom-1 left-1 rounded-full bg-orange-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      완성
                    </span>
                  ) : null}
                </div>
                <div className="p-2.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    #{l.order}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-50">
                    {l.title}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {uploadedCount === 0 && mounted ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
          <p>
            첫 한 쌍을 올리면 여기 갤러리의 칸이 컬러로 바뀌어요. 네 사진으로
            오늘 한 장 시작해봐요.
          </p>
        </div>
      ) : null}
    </section>
  );
}
