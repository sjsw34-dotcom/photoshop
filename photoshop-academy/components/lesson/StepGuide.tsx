import type { ReactNode } from "react";

interface StepGuideProps {
  children: ReactNode;
}

export function StepGuide({ children }: StepGuideProps) {
  return (
    <ol className="my-6 flex flex-col gap-6 sm:gap-8" role="list">
      {children}
    </ol>
  );
}

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-4 sm:gap-5">
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white shadow-sm"
      >
        {number}
      </span>
      <div className="min-w-0 pt-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          <span className="sr-only">{number}단계. </span>
          {title}
        </h3>
        <div className="mt-2 text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>
    </li>
  );
}
