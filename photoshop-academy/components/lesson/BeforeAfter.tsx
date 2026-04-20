"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState } from "react";

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  width?: number;
  height?: number;
}

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  alt = "Before / After 비교 이미지",
  beforeLabel = "Before",
  afterLabel = "After",
  width = 1600,
  height = 1000,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sliderId = useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setPosition((p) => Math.max(0, p - 5));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setPosition((p) => Math.min(100, p + 5));
      e.preventDefault();
    } else if (e.key === "Home") {
      setPosition(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setPosition(100);
      e.preventDefault();
    }
  };

  return (
    <figure className="my-6">
      <div
        ref={trackRef}
        className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <Image
          src={beforeSrc}
          alt={`${alt} (${beforeLabel})`}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <Image
            src={afterSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-semibold text-white">
          {afterLabel}
        </span>

        <div
          id={sliderId}
          role="slider"
          tabIndex={0}
          aria-label="비포/애프터 슬라이더"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={onKeyDown}
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
    </figure>
  );
}
