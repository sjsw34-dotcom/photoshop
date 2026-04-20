import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 sm:flex-row sm:items-center sm:px-6">
        <p>
          © {year} {SITE.title}. 하루 1시간, 꾸준히 함께 걸어가요.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="transition-colors hover:text-orange-500"
          >
            문의
          </a>
          <Link
            href="/settings"
            className="transition-colors hover:text-orange-500"
          >
            설정과 피드백
          </Link>
        </div>
      </div>
    </footer>
  );
}
