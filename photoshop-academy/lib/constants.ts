export const SITE = {
  title: "포토샵 아카데미",
  description: "하루 1시간, 기초부터 실무까지 포토샵을 익히는 학습 플랫폼",
  contactEmail: "hello@photoshop-academy.local",
} as const;

export type LevelId = 0 | 1 | 2 | 3;

export interface LevelInfo {
  id: LevelId;
  name: string;
  tagline: string;
  emoji: string;
}

export const LEVELS: readonly LevelInfo[] = [
  { id: 0, name: "Level 0 · 만나기", tagline: "포토샵과 첫인사", emoji: "🐣" },
  { id: 1, name: "Level 1 · 기초", tagline: "기본기 다지기", emoji: "🌱" },
  { id: 2, name: "Level 2 · 실무 입문", tagline: "현장에서 쓰는 흐름", emoji: "🌿" },
  { id: 3, name: "Level 3 · 심화", tagline: "품질로 차이내기", emoji: "🌳" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/curriculum", label: "커리큘럼" },
  { href: "/dashboard", label: "내 진도" },
  { href: "/glossary", label: "용어 사전" },
] as const;
