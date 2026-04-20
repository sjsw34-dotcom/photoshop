"use client";

import { useEffect } from "react";
import { findNewBadges } from "@/lib/badges";
import { useProgress } from "@/lib/store";

export function BadgeAwarder() {
  const lessons = useProgress((s) => s.lessons);
  const streak = useProgress((s) => s.streak);
  const longestStreak = useProgress((s) => s.longestStreak);
  const totalMinutes = useProgress((s) => s.totalMinutes);
  const grantBadges = useProgress((s) => s.grantBadges);

  useEffect(() => {
    const state = useProgress.getState();
    const newOnes = findNewBadges(state);
    if (newOnes.length > 0) grantBadges(newOnes);
  }, [lessons, streak, longestStreak, totalMinutes, grantBadges]);

  return null;
}
