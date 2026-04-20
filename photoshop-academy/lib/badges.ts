import { getCurriculumLessons } from "@/lib/curriculum";
import type { LevelId } from "@/lib/constants";
import type { LessonProgress, ProgressState } from "@/lib/store";

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  group: "streak" | "level" | "time" | "quiz";
}

export const BADGES: readonly Badge[] = [
  {
    id: "streak-7",
    name: "일주일 꾸준러",
    description: "7일 연속 학습 달성",
    emoji: "🔥",
    group: "streak",
  },
  {
    id: "streak-30",
    name: "한 달 완주자",
    description: "30일 연속 학습 달성",
    emoji: "🔥🔥",
    group: "streak",
  },
  {
    id: "streak-100",
    name: "100일의 전설",
    description: "100일 연속 학습 달성",
    emoji: "🔥🔥🔥",
    group: "streak",
  },
  {
    id: "level-0",
    name: "첫 걸음",
    description: "Level 0 입문 완주",
    emoji: "🐣",
    group: "level",
  },
  {
    id: "level-1",
    name: "기초 탄탄",
    description: "Level 1 초급 완주",
    emoji: "🌱",
    group: "level",
  },
  {
    id: "level-2",
    name: "실무 입문",
    description: "Level 2 중급 완주",
    emoji: "🌿",
    group: "level",
  },
  {
    id: "level-3",
    name: "포토샵 마스터",
    description: "Level 3 고급 완주",
    emoji: "🌳",
    group: "level",
  },
  {
    id: "time-10h",
    name: "10시간 클럽",
    description: "누적 학습 10시간 달성",
    emoji: "⏱️",
    group: "time",
  },
  {
    id: "time-50h",
    name: "50시간 클럽",
    description: "누적 학습 50시간 달성",
    emoji: "⏳",
    group: "time",
  },
  {
    id: "quiz-perfect-10",
    name: "퀴즈 장인",
    description: "퀴즈 만점 10개 달성",
    emoji: "🎯",
    group: "quiz",
  },
];

const EMPTY_LESSON: Partial<LessonProgress> = {};

function levelCompleted(
  lessons: Record<string, LessonProgress>,
  level: LevelId,
): boolean {
  const inLevel = getCurriculumLessons().filter((l) => l.level === level);
  if (inLevel.length === 0) return false;
  return inLevel.every(
    (l) => (lessons[l.slug] ?? EMPTY_LESSON).status === "completed",
  );
}

function countPerfectQuizzes(
  lessons: Record<string, LessonProgress>,
): number {
  let n = 0;
  for (const l of Object.values(lessons)) {
    if (l.quizScore === 100) n++;
  }
  return n;
}

export function computeEarnedBadges(state: ProgressState): string[] {
  const earned: string[] = [];
  if (state.streak >= 7 || state.longestStreak >= 7) earned.push("streak-7");
  if (state.streak >= 30 || state.longestStreak >= 30) earned.push("streak-30");
  if (state.streak >= 100 || state.longestStreak >= 100) earned.push("streak-100");
  if (levelCompleted(state.lessons, 0)) earned.push("level-0");
  if (levelCompleted(state.lessons, 1)) earned.push("level-1");
  if (levelCompleted(state.lessons, 2)) earned.push("level-2");
  if (levelCompleted(state.lessons, 3)) earned.push("level-3");
  if (state.totalMinutes >= 600) earned.push("time-10h");
  if (state.totalMinutes >= 3000) earned.push("time-50h");
  if (countPerfectQuizzes(state.lessons) >= 10) earned.push("quiz-perfect-10");
  return earned;
}

export function findNewBadges(state: ProgressState): string[] {
  const current = new Set(state.earnedBadges);
  return computeEarnedBadges(state).filter((id) => !current.has(id));
}

export function getBadge(id: string): Badge | null {
  return BADGES.find((b) => b.id === id) ?? null;
}
