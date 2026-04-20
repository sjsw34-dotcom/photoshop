"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check, RefreshCw, X } from "lucide-react";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

interface QuizContextValue {
  lessonSlug: string;
  registerQuestion: (id: string, correctIndex: number) => void;
  recordAnswer: (id: string, index: number) => void;
  submitted: boolean;
  resetTick: number;
  scoreOf: (id: string) => "correct" | "wrong" | null;
}

const QuizCtx = createContext<QuizContextValue | null>(null);

function useQuizCtx() {
  const ctx = useContext(QuizCtx);
  if (!ctx) throw new Error("<Question>는 <Quiz> 안에서만 사용할 수 있어요.");
  return ctx;
}

interface QuizProps {
  lessonSlug: string;
  passScore?: number;
  children: ReactNode;
}

export function Quiz({ lessonSlug, passScore = 60, children }: QuizProps) {
  const saveScore = useProgress((s) => s.saveQuizScore);
  const [questions, setQuestions] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [resetTick, setResetTick] = useState(0);

  const registerQuestion = useCallback((id: string, correctIndex: number) => {
    setQuestions((prev) =>
      prev[id] === correctIndex ? prev : { ...prev, [id]: correctIndex },
    );
  }, []);

  const recordAnswer = useCallback((id: string, index: number) => {
    setAnswers((prev) => ({ ...prev, [id]: index }));
  }, []);

  const total = Object.keys(questions).length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(
    ([id, ans]) => questions[id] === ans,
  ).length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = score >= passScore;

  const scoreOf = useCallback(
    (id: string): "correct" | "wrong" | null => {
      if (!submitted) return null;
      const ans = answers[id];
      if (typeof ans !== "number") return "wrong";
      return questions[id] === ans ? "correct" : "wrong";
    },
    [submitted, answers, questions],
  );

  const handleSubmit = () => {
    setSubmitted(true);
    saveScore(lessonSlug, score);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setResetTick((t) => t + 1);
  };

  const ctx = useMemo<QuizContextValue>(
    () => ({
      lessonSlug,
      registerQuestion,
      recordAnswer,
      submitted,
      resetTick,
      scoreOf,
    }),
    [lessonSlug, registerQuestion, recordAnswer, submitted, resetTick, scoreOf],
  );

  return (
    <section
      aria-label="이해도 퀴즈"
      className="my-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          🧠 이해도 퀴즈
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          통과 점수 {passScore}점
        </span>
      </div>

      <QuizCtx.Provider value={ctx}>
        <div className="flex flex-col gap-6">{children}</div>
      </QuizCtx.Provider>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {submitted ? (
            <span
              className={cn(
                "font-semibold",
                passed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-orange-600 dark:text-orange-400",
              )}
            >
              {correctCount} / {total} 정답 · {score}점
              {passed ? ", 통과!" : ", 한 번 더 도전해볼까요"}
            </span>
          ) : (
            <>
              답을 {answeredCount} / {total} 골랐어요
            </>
          )}
        </p>
        <div className="flex gap-2">
          {submitted ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <RefreshCw aria-hidden className="h-4 w-4" />
              다시 풀기
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={answeredCount < total || total === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              채점하기
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface QuestionOption {
  text: string;
  correct?: boolean;
}

interface QuestionProps {
  id: string;
  prompt: ReactNode;
  options: QuestionOption[];
  explanation?: ReactNode;
}

export function Question({ id, prompt, options, explanation }: QuestionProps) {
  const { lessonSlug, registerQuestion, recordAnswer, submitted, resetTick, scoreOf } =
    useQuizCtx();
  const correctIndex = options.findIndex((o) => o.correct);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    registerQuestion(id, correctIndex);
  }, [id, correctIndex, registerQuestion]);

  useEffect(() => {
    setSelected(null);
  }, [resetTick]);

  const result = scoreOf(id);
  const isCorrect = result === "correct";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 text-[0.95rem] font-medium text-slate-900 dark:text-slate-50">
        {prompt}
      </div>
      <ul className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const checked = selected === i;
          const showAsCorrect = submitted && i === correctIndex;
          const showAsWrong = submitted && checked && i !== correctIndex;
          return (
            <li key={i}>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors",
                  checked
                    ? "border-orange-400 bg-white dark:border-orange-500 dark:bg-slate-900"
                    : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
                  showAsCorrect &&
                    "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40",
                  showAsWrong &&
                    "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/40",
                  submitted && "cursor-default",
                )}
              >
                <input
                  type="radio"
                  name={`${lessonSlug}-${id}`}
                  value={i}
                  checked={checked}
                  disabled={submitted}
                  onChange={() => {
                    setSelected(i);
                    recordAnswer(id, i);
                  }}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    checked
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950",
                    showAsCorrect && "border-emerald-500 bg-emerald-500 text-white",
                    showAsWrong && "border-red-500 bg-red-500 text-white",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-500",
                  )}
                >
                  {showAsCorrect ? (
                    <Check className="h-3 w-3" />
                  ) : showAsWrong ? (
                    <X className="h-3 w-3" />
                  ) : checked ? (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  ) : null}
                </span>
                <span className="flex-1 text-slate-800 dark:text-slate-100">
                  {opt.text}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {submitted && explanation ? (
        <div
          className={cn(
            "mt-3 rounded-lg border p-3 text-sm",
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100"
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
          )}
        >
          <span className="font-semibold">해설. </span>
          {explanation}
        </div>
      ) : null}
    </div>
  );
}
