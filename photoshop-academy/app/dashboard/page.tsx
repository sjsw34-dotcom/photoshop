import type { Metadata } from "next";
import { DashboardContent } from "@/components/progress/DashboardContent";
import { getAllLessons } from "@/lib/lessons";
import { LEVELS, type LevelId } from "@/lib/constants";

export const metadata: Metadata = {
  title: "내 진도",
  description: "학습 현황과 이어서 학습할 레슨 확인",
};

export default function DashboardPage() {
  const lessons = getAllLessons().map((l) => ({
    slug: l.slug,
    title: l.title,
    level: l.level,
    order: l.order,
    duration: l.duration,
    hasContent: l.hasContent,
    hasPractice: l.hasPractice,
  }));

  const levels = LEVELS.map((info) => {
    const total = lessons.filter((l) => l.level === info.id).length;
    const firstAvailable = lessons.find(
      (l) => l.level === info.id && l.hasContent,
    );
    return {
      level: info.id as LevelId,
      total,
      firstAvailableSlug: firstAvailable?.slug ?? null,
    };
  });

  return <DashboardContent lessons={lessons} levels={levels} />;
}
