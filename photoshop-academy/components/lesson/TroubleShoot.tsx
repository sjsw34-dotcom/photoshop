"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface TroubleShootProps {
  title?: string;
  children: ReactNode;
}

export function TroubleShoot({
  title = "이게 안 될 때",
  children,
}: TroubleShootProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="my-4 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-900"
      >
        <Wrench aria-hidden className="h-4 w-4 text-orange-500" />
        <span className="flex-1">🔧 {title}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id={panelId}
          className="border-t border-slate-200 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
