"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/store";

interface LessonTrackerProps {
  slug: string;
}

export function LessonTracker({ slug }: LessonTrackerProps) {
  const initLesson = useProgress((s) => s.initLesson);
  const markInProgress = useProgress((s) => s.markInProgress);
  const saveScrollPosition = useProgress((s) => s.saveScrollPosition);
  const addStudyTime = useProgress((s) => s.addStudyTime);
  const scrollPosition = useProgress(
    (s) => s.lessons[slug]?.scrollPosition ?? 0,
  );

  const restoredRef = useRef(false);

  useEffect(() => {
    initLesson(slug);
    markInProgress(slug);
  }, [slug, initLesson, markInProgress]);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("resume") !== "1") return;
    const target = scrollPosition;
    if (target > 0) {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, [scrollPosition]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        saveScrollPosition(slug, window.scrollY);
      }, 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [slug, saveScrollPosition]);

  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        seconds += 10;
        if (seconds >= 60) {
          addStudyTime(slug, 1);
          seconds = 0;
        }
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [slug, addStudyTime]);

  return null;
}
