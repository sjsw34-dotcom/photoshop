"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}

export default function ErrorPage({ error, unstable_retry, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <div
        aria-hidden
        className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500"
      >
        <AlertTriangle className="h-8 w-8" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-wider text-rose-500">
        오류
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
        화면을 그리다가 문제가 생겼어요
      </h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        잠시 후 다시 시도해 주세요. 그래도 안 되면 새로고침을 해 보세요.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {retry ? (
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <RefreshCw aria-hidden className="h-4 w-4" />
            다시 시도
          </button>
        ) : null}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Home aria-hidden className="h-4 w-4" />
          홈으로 가기
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-6 text-[11px] text-slate-400 dark:text-slate-500">
          오류 코드: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
