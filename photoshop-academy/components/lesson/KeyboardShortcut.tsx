"use client";

import { useEffect, useState } from "react";

interface KeyboardShortcutProps {
  keys: string[];
  mac?: string[];
  description?: string;
}

function detectIsMac() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/.test(ua);
}

export function KeyboardShortcut({ keys, mac, description }: KeyboardShortcutProps) {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(detectIsMac()), []);

  const resolved = isMac && mac ? mac : keys;

  return (
    <span className="inline-flex flex-wrap items-center gap-1 align-middle text-sm">
      {resolved.map((key, idx) => (
        <span key={`${key}-${idx}`} className="inline-flex items-center gap-1">
          <kbd className="inline-block min-w-[1.75rem] rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-center font-mono text-[0.8rem] font-semibold text-slate-800 shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            {key}
          </kbd>
          {idx < resolved.length - 1 ? (
            <span aria-hidden className="text-slate-400">
              +
            </span>
          ) : null}
        </span>
      ))}
      {description ? (
        <span className="ml-2 text-slate-600 dark:text-slate-300">{description}</span>
      ) : null}
    </span>
  );
}
