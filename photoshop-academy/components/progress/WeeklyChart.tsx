"use client";

import { useMemo } from "react";
import { useProgress } from "@/lib/store";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function shortLabel(d: Date) {
  const wd = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()} ${wd}`;
}

interface WeeklyChartProps {
  mounted: boolean;
}

export function WeeklyChart({ mounted }: WeeklyChartProps) {
  const dailyMinutes = useProgress((s) => s.dailyMinutes);

  const days = useMemo(() => {
    const out: { key: string; date: Date; minutes: number }[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const key = dateKey(d);
      out.push({
        key,
        date: d,
        minutes: mounted ? dailyMinutes[key] ?? 0 : 0,
      });
    }
    return out;
  }, [dailyMinutes, mounted]);

  const todayKey = dateKey(new Date());
  const max = Math.max(60, ...days.map((d) => d.minutes));
  const totalWeek = days.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <section aria-label="이번 주 학습 시간" className="mt-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          이번 주 학습 시간
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          합계 {totalWeek}분
        </span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <ul className="flex items-end justify-between gap-2" role="list">
          {days.map((d) => {
            const pct = max === 0 ? 0 : Math.round((d.minutes / max) * 100);
            const isToday = d.key === todayKey;
            return (
              <li
                key={d.key}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <span
                  className={`text-xs font-semibold ${
                    d.minutes > 0
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                  aria-hidden
                >
                  {d.minutes}분
                </span>
                <div
                  className="flex h-24 w-full items-end justify-center"
                  role="img"
                  aria-label={`${shortLabel(d.date)} ${d.minutes}분 학습`}
                >
                  <div
                    className={`w-full max-w-[28px] rounded-t-md transition-all ${
                      isToday
                        ? "bg-orange-500"
                        : d.minutes > 0
                          ? "bg-orange-300 dark:bg-orange-500/60"
                          : "bg-slate-200 dark:bg-slate-800"
                    }`}
                    style={{
                      height: `${Math.max(pct, d.minutes > 0 ? 8 : 4)}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-[11px] ${
                    isToday
                      ? "font-semibold text-orange-600 dark:text-orange-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {shortLabel(d.date)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
