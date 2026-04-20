"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  Check,
  Download,
  MessageSquare,
  MonitorSmartphone,
  Moon,
  RotateCcw,
  Sun,
  Upload,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { useProgress, type ImportPayload } from "@/lib/store";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "라이트", icon: Sun },
  { value: "dark", label: "다크", icon: Moon },
  { value: "system", label: "시스템 설정 따르기", icon: MonitorSmartphone },
];

function todayStamp() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isValidPayload(data: unknown): data is ImportPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.lessons === "object" &&
    typeof d.streak === "number" &&
    typeof d.totalMinutes === "number"
  );
}

export function SettingsContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { theme, setTheme } = useTheme();
  const resetAll = useProgress((s) => s.resetAll);
  const importState = useProgress((s) => s.importState);

  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);
  const [resetInput, setResetInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => {
    setError(null);
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleReset = () => {
    if (resetStep === 0) {
      setResetStep(1);
      return;
    }
    if (resetStep === 1) {
      setResetStep(2);
      return;
    }
    if (resetInput.trim() !== "RESET") {
      setError("RESET 을 정확히 입력해 주세요");
      return;
    }
    resetAll();
    setResetStep(0);
    setResetInput("");
    flash("진도를 모두 초기화했어요");
  };

  const cancelReset = () => {
    setResetStep(0);
    setResetInput("");
    setError(null);
  };

  const handleExport = () => {
    const state = useProgress.getState();
    const payload: ImportPayload = {
      lessons: state.lessons,
      streak: state.streak,
      lastStudyDate: state.lastStudyDate,
      totalMinutes: state.totalMinutes,
      longestStreak: state.longestStreak,
      currentLevel: state.currentLevel,
      lastLessonSlug: state.lastLessonSlug,
      earnedBadges: state.earnedBadges,
      dailyMinutes: state.dailyMinutes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `photoshop-academy-progress-${todayStamp()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash("진도 파일을 내보냈어요");
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!isValidPayload(data)) {
        setError("파일 형식이 맞지 않아요. 내보낸 JSON 파일을 선택해 주세요");
        return;
      }
      importState(data);
      flash("진도를 불러왔어요");
    } catch {
      setError("파일을 읽지 못했어요. JSON 형식이 맞는지 확인해 주세요");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
          설정
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          내 학습 환경 관리
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          테마, 진도, 데이터를 원하는 대로 조정할 수 있어요.
        </p>
      </header>

      {toast ? (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          <Check aria-hidden className="h-4 w-4" />
          {toast}
        </div>
      ) : null}
      {error ? (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
        >
          <AlertTriangle aria-hidden className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      <section
        aria-labelledby="theme-heading"
        className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2
          id="theme-heading"
          className="text-base font-bold text-slate-900 dark:text-slate-50"
        >
          테마
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          눈이 편한 테마를 골라 주세요.
        </p>
        <fieldset className="mt-4" aria-label="테마 선택">
          <legend className="sr-only">테마 선택</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const selected = mounted && theme === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                    selected
                      ? "border-orange-400 bg-orange-50 text-orange-900 dark:border-orange-500 dark:bg-orange-950/30 dark:text-orange-100"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                  )}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={opt.value}
                    checked={selected}
                    onChange={() => setTheme(opt.value)}
                    className="sr-only"
                  />
                  <Icon aria-hidden className="h-4 w-4" />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>

      <section
        aria-labelledby="data-heading"
        className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2
          id="data-heading"
          className="text-base font-bold text-slate-900 dark:text-slate-50"
        >
          데이터 관리
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          다른 기기로 옮기고 싶다면 내보내고 불러오세요.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download aria-hidden className="h-4 w-4" />
            진도 JSON 내보내기
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Upload aria-hidden className="h-4 w-4" />
            JSON 불러오기
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section
        aria-labelledby="reset-heading"
        className="mb-8 rounded-2xl border border-rose-200 bg-rose-50/60 p-6 dark:border-rose-900/60 dark:bg-rose-950/30"
      >
        <h2
          id="reset-heading"
          className="flex items-center gap-2 text-base font-bold text-rose-900 dark:text-rose-100"
        >
          <AlertTriangle aria-hidden className="h-4 w-4" />
          진도 초기화
        </h2>
        <p className="mt-1 text-sm text-rose-800/80 dark:text-rose-200/80">
          모든 체크리스트, 퀴즈 점수, 스트릭이 사라져요. 되돌릴 수 없어요.
        </p>

        {resetStep === 0 ? (
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-700 dark:bg-slate-900 dark:text-rose-200 dark:hover:bg-rose-900/40"
          >
            <RotateCcw aria-hidden className="h-4 w-4" />
            모든 진도 초기화
          </button>
        ) : null}

        {resetStep === 1 ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-rose-900 dark:text-rose-100">
              정말 초기화하시겠어요. 한 번 더 확인할게요.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
              >
                네, 계속 진행
              </button>
              <button
                type="button"
                onClick={cancelReset}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                취소
              </button>
            </div>
          </div>
        ) : null}

        {resetStep === 2 ? (
          <div className="mt-4 space-y-3">
            <label
              htmlFor="reset-confirm"
              className="block text-sm text-rose-900 dark:text-rose-100"
            >
              확인을 위해 <span className="font-mono font-bold">RESET</span> 을 입력해 주세요.
            </label>
            <input
              id="reset-confirm"
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 dark:border-rose-700 dark:bg-slate-900 dark:text-slate-100"
              autoComplete="off"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
              >
                초기화 실행
              </button>
              <button
                type="button"
                onClick={cancelReset}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                취소
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section
        aria-labelledby="feedback-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2
          id="feedback-heading"
          className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-50"
        >
          <MessageSquare aria-hidden className="h-4 w-4" />
          피드백
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          어려웠던 지점이나 고치고 싶은 부분을 알려주세요.
        </p>
        <a
          href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent("포토샵 아카데미 피드백")}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          메일로 피드백 보내기
        </a>
      </section>
    </div>
  );
}
