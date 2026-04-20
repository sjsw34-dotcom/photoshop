"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  ImagePlus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { formatBytes, processUpload } from "@/lib/image-utils";
import {
  deleteAllForLesson,
  deleteUploadBlob,
  loadUploadBlob,
  saveUploadBlob,
} from "@/lib/practice-storage";
import {
  defaultPractice,
  useProgress,
  type PracticeKind,
  type PracticeSlot,
} from "@/lib/store";
import { cn } from "@/lib/utils";

interface PracticeCompareProps {
  lessonSlug: string;
  goal: string;
  startHint?: string;
  checklist?: string[];
}

const MOTIVATION_HEADLINE = "🌱 이 한 장이 네 포트폴리오가 돼요";
const MOTIVATION_SUB =
  "네 사진으로 직접 만들어봐요. 완벽하지 않아도 괜찮아요. 올린 결과는 오직 너만 봐요. 오늘 한 장이 30일 뒤 30장이 돼요.";

const SLOT_LABELS: Record<PracticeKind, { title: string; hint: string }> = {
  before: {
    title: "1. 시작 사진",
    hint: "편집할 네 사진을 먼저 올려요",
  },
  after: {
    title: "2. 내 결과",
    hint: "레슨 따라 편집한 결과를 올려요",
  },
};

function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
}: {
  beforeUrl: string;
  afterUrl: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const sliderId = useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div
      ref={trackRef}
      className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        updateFromClientX(e.clientX);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeUrl}
        alt="시작 사진"
        className="absolute inset-0 h-full w-full object-contain"
      />
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
        시작
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-semibold text-white">
        내 결과
      </span>
      <div
        id={sliderId}
        role="slider"
        tabIndex={0}
        aria-label="결과 비교 슬라이더"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setPosition((p) => Math.max(0, p - 5));
            e.preventDefault();
          } else if (e.key === "ArrowRight") {
            setPosition((p) => Math.min(100, p + 5));
            e.preventDefault();
          }
        }}
        className="absolute top-0 bottom-0 w-1 -translate-x-1/2 cursor-ew-resize bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
        style={{ left: `${position}%` }}
      >
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-800 shadow"
        >
          ‹›
        </span>
      </div>
    </div>
  );
}

function SlotCard({
  kind,
  slot,
  previewUrl,
  onUpload,
  onClear,
  loading,
  error,
}: {
  kind: PracticeKind;
  slot: PracticeSlot | null;
  previewUrl: string | null;
  onUpload: (file: File) => void;
  onClear: () => void;
  loading: boolean;
  error: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const labels = SLOT_LABELS[kind];
  const hasSlot = !!slot && !!previewUrl;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border transition-colors",
        hasSlot
          ? "border-orange-300 bg-white dark:border-orange-500/60 dark:bg-slate-900"
          : dragOver
          ? "border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-950/40"
          : "border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
      )}
      onDragOver={(e) => {
        if (hasSlot) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (hasSlot) return;
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onUpload(file);
      }}
    >
      <div className="flex items-baseline justify-between gap-2 px-4 py-2.5">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {labels.title}
        </p>
        {hasSlot ? (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {slot!.width}×{slot!.height}, {formatBytes(slot!.sizeBytes)}
          </span>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {labels.hint}
          </span>
        )}
      </div>

      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-950">
        {hasSlot ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewUrl!}
            alt={labels.title}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <span
              aria-hidden
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-200"
            >
              <ImagePlus className="h-5 w-5" />
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              여기로 끌어다 놓거나 아래 버튼
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 px-3 py-2 dark:border-slate-800">
        {hasSlot ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              다시 올리기
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              삭제
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" />
              파일 선택
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <Camera className="h-3.5 w-3.5" />
              카메라
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {loading ? (
        <p className="px-3 pb-2 text-xs text-slate-500 dark:text-slate-400">
          이미지를 다듬는 중...
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="inline-flex items-center gap-1 px-3 pb-2 text-xs text-red-600 dark:text-red-400"
        >
          <XCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PracticeCompare({
  lessonSlug,
  goal,
  startHint,
  checklist = [],
}: PracticeCompareProps) {
  const savePracticeSlot = useProgress((s) => s.savePracticeSlot);
  const clearPracticeSlot = useProgress((s) => s.clearPracticeSlot);
  const clearPractice = useProgress((s) => s.clearPractice);
  const deferPractice = useProgress((s) => s.deferPractice);
  const practice =
    useProgress((s) => s.lessons[lessonSlug]?.practice) ?? defaultPractice;

  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [loadingKind, setLoadingKind] = useState<PracticeKind | null>(null);
  const [errorByKind, setErrorByKind] = useState<
    Partial<Record<PracticeKind, string>>
  >({});
  const [selfChecks, setSelfChecks] = useState<boolean[]>(() =>
    checklist.map(() => false),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let revoked = false;
    let url: string | null = null;
    if (practice.before) {
      loadUploadBlob(lessonSlug, "before").then((blob) => {
        if (revoked || !blob) return;
        url = URL.createObjectURL(blob);
        setBeforeUrl(url);
      });
    } else {
      setBeforeUrl(null);
    }
    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [mounted, lessonSlug, practice.before]);

  useEffect(() => {
    if (!mounted) return;
    let revoked = false;
    let url: string | null = null;
    if (practice.after) {
      loadUploadBlob(lessonSlug, "after").then((blob) => {
        if (revoked || !blob) return;
        url = URL.createObjectURL(blob);
        setAfterUrl(url);
      });
    } else {
      setAfterUrl(null);
    }
    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [mounted, lessonSlug, practice.after]);

  const handleUpload = useCallback(
    async (kind: PracticeKind, file: File) => {
      setErrorByKind((prev) => ({ ...prev, [kind]: undefined }));
      setLoadingKind(kind);
      try {
        const processed = await processUpload(file);
        await saveUploadBlob(lessonSlug, kind, processed.blob);
        savePracticeSlot(lessonSlug, kind, {
          thumbDataUrl: processed.thumbDataUrl,
          width: processed.width,
          height: processed.height,
          sizeBytes: processed.sizeBytes,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "업로드에 실패했어요";
        setErrorByKind((prev) => ({ ...prev, [kind]: msg }));
      } finally {
        setLoadingKind(null);
      }
    },
    [lessonSlug, savePracticeSlot],
  );

  const handleClearSlot = async (kind: PracticeKind) => {
    await deleteUploadBlob(lessonSlug, kind).catch(() => {});
    clearPracticeSlot(lessonSlug, kind);
  };

  const handleReset = async () => {
    await deleteAllForLesson(lessonSlug).catch(() => {});
    clearPractice(lessonSlug);
    setSelfChecks(checklist.map(() => false));
  };

  const state = mounted ? practice.state : "pending";

  const doneCount = useMemo(
    () => selfChecks.filter(Boolean).length,
    [selfChecks],
  );

  const hasBoth = beforeUrl && afterUrl;

  return (
    <section
      aria-label="실습 제출"
      className="my-8 overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-sm dark:border-orange-500/40 dark:from-orange-950/20 dark:to-slate-900"
    >
      <header className="border-b border-orange-100 bg-white/60 px-5 py-4 dark:border-orange-500/30 dark:bg-slate-900/60">
        <p className="text-sm font-bold text-orange-600 dark:text-orange-300">
          🎨 오늘의 실습
        </p>
        <p className="mt-1 text-[1.05rem] font-semibold text-slate-900 dark:text-slate-50">
          {goal}
        </p>
        {startHint ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">출발점 힌트.</span> {startHint}
          </p>
        ) : null}
      </header>

      <div className="px-5 py-5 sm:px-6">
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-3 text-sm dark:border-orange-500/30 dark:bg-orange-950/30">
          <Sparkles
            aria-hidden
            className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
          />
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              {MOTIVATION_HEADLINE}
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              {MOTIVATION_SUB}
            </p>
          </div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <SlotCard
            kind="before"
            slot={practice.before}
            previewUrl={beforeUrl}
            onUpload={(file) => handleUpload("before", file)}
            onClear={() => handleClearSlot("before")}
            loading={loadingKind === "before"}
            error={errorByKind.before ?? null}
          />
          <SlotCard
            kind="after"
            slot={practice.after}
            previewUrl={afterUrl}
            onUpload={(file) => handleUpload("after", file)}
            onClear={() => handleClearSlot("after")}
            loading={loadingKind === "after"}
            error={errorByKind.after ?? null}
          />
        </div>

        {hasBoth ? (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              비교 (슬라이더를 좌우로 밀어보세요)
            </p>
            <BeforeAfterSlider beforeUrl={beforeUrl!} afterUrl={afterUrl!} />
          </div>
        ) : null}

        {state === "uploaded" ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm dark:border-emerald-500/40 dark:bg-emerald-950/30">
            <span className="inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              두 장 모두 기록됐어요
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              기록 모두 삭제
            </button>
          </div>
        ) : state === "partial" ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200">
            <Clock className="h-4 w-4" />
            한 장 더 올리면 비교 슬라이더가 생겨요
          </div>
        ) : state === "deferred" ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200">
            <Clock className="h-4 w-4" />
            대기 중으로 표시됐어요. 준비되면 위에서 업로드하세요.
          </div>
        ) : (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-slate-600 dark:text-slate-300">
              두 장을 올리면 자동으로 비교 슬라이더가 나타나요
            </span>
            <button
              type="button"
              onClick={() => deferPractice(lessonSlug)}
              className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Clock className="h-3.5 w-3.5" />
              지금 말고, 나중에
            </button>
          </div>
        )}

        {checklist.length > 0 ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                스스로 점검해보기
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {doneCount} / {checklist.length}
              </span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {checklist.map((item, i) => {
                const checked = selfChecks[i] ?? false;
                return (
                  <li key={i}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setSelfChecks((prev) => {
                            const next = [...prev];
                            next[i] = e.target.checked;
                            return next;
                          })
                        }
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border",
                          checked
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950",
                          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-500",
                        )}
                      >
                        {checked ? <CheckCircle2 className="h-3 w-3" /> : null}
                      </span>
                      <span className={checked ? "line-through opacity-70" : ""}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
