import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <div
        aria-hidden
        className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-500"
      >
        <Compass className="h-8 w-8" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
        찾고 있는 페이지가 없어요
      </h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        주소가 바뀌었거나 아직 준비 중인 레슨일 수 있어요.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          <Home aria-hidden className="h-4 w-4" />
          홈으로 가기
        </Link>
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          커리큘럼 보기
        </Link>
      </div>
    </div>
  );
}
