import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LevelId } from "@/lib/constants";

export type LessonStatus = "locked" | "unlocked" | "in_progress" | "completed";

export type PracticeKind = "before" | "after";
export type PracticeState =
  | "pending"
  | "deferred"
  | "partial"
  | "uploaded";

export interface PracticeSlot {
  uploadedAt: string;
  thumbDataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export interface PracticeMeta {
  state: PracticeState;
  before: PracticeSlot | null;
  after: PracticeSlot | null;
  deferredAt: string | null;
}

export interface LessonProgress {
  status: LessonStatus;
  checklistDone: string[];
  quizScore: number | null;
  quizAttempts: number;
  quizAnswers: Record<string, string>;
  completedAt: string | null;
  lastVisitedAt: string | null;
  timeSpentMin: number;
  scrollPosition: number;
  practiceDownloaded: boolean;
  practice: PracticeMeta;
  feedback: "up" | "down" | null;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  streak: number;
  lastStudyDate: string | null;
  totalMinutes: number;
  longestStreak: number;
  currentLevel: LevelId;
  lastLessonSlug: string | null;

  initLesson: (slug: string) => void;
  markInProgress: (slug: string) => void;
  updateChecklist: (slug: string, itemId: string, checked: boolean) => void;
  saveQuizAnswer: (slug: string, questionId: string, value: string) => void;
  saveQuizScore: (slug: string, score: number) => void;
  completeLesson: (slug: string) => void;
  addStudyTime: (slug: string, minutes: number) => void;
  saveScrollPosition: (slug: string, px: number) => void;
  markPracticeDownloaded: (slug: string) => void;
  savePracticeSlot: (
    slug: string,
    kind: PracticeKind,
    slot: Omit<PracticeSlot, "uploadedAt">,
  ) => void;
  clearPracticeSlot: (slug: string, kind: PracticeKind) => void;
  clearPractice: (slug: string) => void;
  deferPractice: (slug: string) => void;
  setFeedback: (slug: string, value: "up" | "down" | null) => void;
  isLessonUnlocked: (slug: string) => boolean;
}

export const defaultPractice: PracticeMeta = {
  state: "pending",
  before: null,
  after: null,
  deferredAt: null,
};

function deriveState(meta: PracticeMeta): PracticeState {
  const hasBefore = !!meta.before;
  const hasAfter = !!meta.after;
  if (hasBefore && hasAfter) return "uploaded";
  if (hasBefore || hasAfter) return "partial";
  if (meta.deferredAt) return "deferred";
  return "pending";
}

const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () =>
  new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

const defaultLesson: LessonProgress = {
  status: "unlocked",
  checklistDone: [],
  quizScore: null,
  quizAttempts: 0,
  quizAnswers: {},
  completedAt: null,
  lastVisitedAt: null,
  timeSpentMin: 0,
  scrollPosition: 0,
  practiceDownloaded: false,
  practice: defaultPractice,
  feedback: null,
};

function advanceStreak(state: ProgressState) {
  const today = todayStr();
  if (state.lastStudyDate === today) return {};
  const newStreak = state.lastStudyDate === yesterdayStr() ? state.streak + 1 : 1;
  return {
    streak: newStreak,
    lastStudyDate: today,
    longestStreak: Math.max(state.longestStreak, newStreak),
  };
}

function withLesson(
  state: ProgressState,
  slug: string,
  updater: (prev: LessonProgress) => LessonProgress,
): Record<string, LessonProgress> {
  const prev = state.lessons[slug] ?? { ...defaultLesson };
  return { ...state.lessons, [slug]: updater(prev) };
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      streak: 0,
      lastStudyDate: null,
      totalMinutes: 0,
      longestStreak: 0,
      currentLevel: 0,
      lastLessonSlug: null,

      initLesson: (slug) => {
        const { lessons } = get();
        if (lessons[slug]) return;
        set({ lessons: { ...lessons, [slug]: { ...defaultLesson } } });
      },

      markInProgress: (slug) => {
        const state = get();
        const prev = state.lessons[slug] ?? { ...defaultLesson };
        if (prev.status === "completed") {
          set({ lastLessonSlug: slug });
          return;
        }
        set({
          lessons: {
            ...state.lessons,
            [slug]: {
              ...prev,
              status: "in_progress",
              lastVisitedAt: new Date().toISOString(),
            },
          },
          lastLessonSlug: slug,
          ...advanceStreak(state),
        });
      },

      updateChecklist: (slug, itemId, checked) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            checklistDone: checked
              ? Array.from(new Set([...prev.checklistDone, itemId]))
              : prev.checklistDone.filter((id) => id !== itemId),
          })),
        });
      },

      saveQuizAnswer: (slug, questionId, value) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            quizAnswers: { ...prev.quizAnswers, [questionId]: value },
          })),
        });
      },

      saveQuizScore: (slug, score) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            quizScore: Math.max(prev.quizScore ?? 0, score),
            quizAttempts: prev.quizAttempts + 1,
          })),
        });
      },

      completeLesson: (slug) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            status: "completed",
            completedAt: prev.completedAt ?? new Date().toISOString(),
          })),
        });
      },

      addStudyTime: (slug, minutes) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            timeSpentMin: prev.timeSpentMin + minutes,
          })),
          totalMinutes: state.totalMinutes + minutes,
        });
      },

      saveScrollPosition: (slug, px) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            scrollPosition: Math.max(0, Math.round(px)),
          })),
        });
      },

      markPracticeDownloaded: (slug) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            practiceDownloaded: true,
          })),
        });
      },

      savePracticeSlot: (slug, kind, slot) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => {
            const nextSlot: PracticeSlot = {
              ...slot,
              uploadedAt: new Date().toISOString(),
            };
            const nextPractice: PracticeMeta = {
              ...prev.practice,
              [kind]: nextSlot,
              deferredAt: null,
            } as PracticeMeta;
            nextPractice.state = deriveState(nextPractice);
            return { ...prev, practice: nextPractice };
          }),
        });
      },

      clearPracticeSlot: (slug, kind) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => {
            const nextPractice: PracticeMeta = {
              ...prev.practice,
              [kind]: null,
            } as PracticeMeta;
            nextPractice.state = deriveState(nextPractice);
            return { ...prev, practice: nextPractice };
          }),
        });
      },

      clearPractice: (slug) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            practice: { ...defaultPractice },
          })),
        });
      },

      deferPractice: (slug) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => {
            if (prev.practice.before || prev.practice.after) return prev;
            return {
              ...prev,
              practice: {
                ...prev.practice,
                state: "deferred",
                deferredAt: new Date().toISOString(),
              },
            };
          }),
        });
      },

      setFeedback: (slug, value) => {
        const state = get();
        set({
          lessons: withLesson(state, slug, (prev) => ({
            ...prev,
            feedback: value,
          })),
        });
      },

      isLessonUnlocked: () => true,
    }),
    {
      name: "photoshop-academy-progress",
      version: 4,
      migrate: (persisted, version) => {
        const state = persisted as ProgressState | undefined;
        if (!state) return state;
        if (version < 4) {
          const lessons: Record<string, LessonProgress> = {};
          for (const [slug, l] of Object.entries(state.lessons ?? {})) {
            lessons[slug] = {
              ...l,
              quizAnswers: l.quizAnswers ?? {},
              practice: { ...defaultPractice },
            };
          }
          return { ...state, lessons };
        }
        return state;
      },
    },
  ),
);
