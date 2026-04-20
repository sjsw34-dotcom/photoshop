"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";

export interface ScreenshotHighlight {
  x: number;
  y: number;
  r?: number;
  label?: string;
}

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  zoomable?: boolean;
  highlight?: ScreenshotHighlight[];
}

function HighlightOverlay({
  items,
  dim = false,
}: {
  items: ScreenshotHighlight[];
  dim?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {items.map((h, idx) => {
        const size = (h.r ?? 30) * 2;
        return (
          <span
            key={idx}
            className={
              dim
                ? "absolute flex items-center justify-center rounded-full border-2 border-red-400/90 bg-red-500/10"
                : "absolute flex items-center justify-center rounded-full border-[3px] border-red-500 bg-red-500/10"
            }
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              width: `${size}px`,
              height: `${size}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {h.label ? (
              <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {h.label}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export function Screenshot({
  src,
  alt,
  caption,
  width = 1600,
  height = 1000,
  zoomable = true,
  highlight,
}: ScreenshotProps) {
  const [open, setOpen] = useState(false);

  const frame = (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 720px"
      />
      {highlight && highlight.length > 0 ? (
        <HighlightOverlay items={highlight} />
      ) : null}
    </div>
  );

  return (
    <figure className="my-6">
      {zoomable ? (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label={`이미지 확대: ${alt}`}
              className="group relative block w-full cursor-zoom-in"
            >
              {frame}
              <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn aria-hidden className="h-3.5 w-3.5" />
                확대
              </span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            >
              <Dialog.Title className="sr-only">{alt}</Dialog.Title>
              <div className="relative max-h-full max-w-full">
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                  sizes="100vw"
                />
                {highlight && highlight.length > 0 ? (
                  <HighlightOverlay items={highlight} dim />
                ) : null}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="닫기"
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-colors hover:bg-white"
                >
                  <X aria-hidden className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ) : (
        frame
      )}
      {caption ? (
        <figcaption className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
