"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-950/90 dark:supports-[backdrop-filter]:bg-slate-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-slate-50"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-black text-white"
          >
            Ps
          </span>
          <span>{SITE.title}</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="주 메뉴">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="모바일 메뉴"
        className={cn(
          "border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950",
          open ? "block" : "hidden",
        )}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
