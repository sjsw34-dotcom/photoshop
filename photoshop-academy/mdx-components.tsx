import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import {
  BeforeAfter,
  Callout,
  Checklist,
  KeyboardShortcut,
  NextLessonCard,
  PracticeCompare,
  PracticeFile,
  Question,
  Quiz,
  Screenshot,
  Step,
  StepGuide,
  TroubleShoot,
} from "@/components/lesson";

function MDXLink({ href = "#", ...rest }: ComponentPropsWithoutRef<"a">) {
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="text-orange-600 underline decoration-orange-400 underline-offset-2 hover:decoration-2 dark:text-orange-300"
        {...rest}
      />
    );
  }
  return (
    <Link
      href={href}
      className="text-orange-600 underline decoration-orange-400 underline-offset-2 hover:decoration-2 dark:text-orange-300"
      {...rest}
    />
  );
}

const baseComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-2 mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold text-slate-900 dark:text-slate-50"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold text-slate-900 dark:text-slate-50"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-6 mb-2 scroll-mt-24 text-lg font-semibold text-slate-900 dark:text-slate-50"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="my-4 leading-[1.85] text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
  a: MDXLink,
  ul: (props) => (
    <ul
      className="my-4 list-disc space-y-1.5 pl-6 text-slate-700 marker:text-orange-500 dark:text-slate-300"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-4 list-decimal space-y-1.5 pl-6 text-slate-700 marker:text-orange-500 dark:text-slate-300"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => (
    <strong
      className="font-semibold text-slate-900 dark:text-slate-50"
      {...props}
    />
  ),
  em: (props) => <em className="italic text-slate-800 dark:text-slate-200" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-orange-400 bg-orange-50/60 px-4 py-3 text-slate-700 dark:border-orange-500/60 dark:bg-orange-950/20 dark:text-slate-200"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-slate-800 dark:text-slate-100"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-5 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100 dark:bg-slate-950"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-10 border-slate-200 dark:border-slate-800" />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full border-collapse text-left text-sm text-slate-700 dark:text-slate-300"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-slate-300 bg-slate-100 px-3 py-2 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-slate-200 px-3 py-2 align-top dark:border-slate-800"
      {...props}
    />
  ),
  BeforeAfter,
  Callout,
  Checklist,
  KeyboardShortcut,
  NextLessonCard,
  PracticeCompare,
  PracticeFile,
  Question,
  Quiz,
  Screenshot,
  Step,
  StepGuide,
  TroubleShoot,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...baseComponents, ...components };
}
