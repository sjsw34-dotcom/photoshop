"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiHelperProps {
  slug: string;
  title: string;
  level: number | string;
  objectives?: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  at: number;
}

interface QuotaState {
  date: string;
  used: number;
}

const DAILY_LIMIT = 5;
const QUOTA_KEY = "photoshop-academy-ai-quota";
const MAX_INPUT_CHARS = 500;

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadQuota(): QuotaState {
  if (typeof window === "undefined") return { date: todayKey(), used: 0 };
  try {
    const raw = window.localStorage.getItem(QUOTA_KEY);
    if (!raw) return { date: todayKey(), used: 0 };
    const parsed = JSON.parse(raw) as QuotaState;
    if (parsed.date !== todayKey()) return { date: todayKey(), used: 0 };
    return parsed;
  } catch {
    return { date: todayKey(), used: 0 };
  }
}

function saveQuota(q: QuotaState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUOTA_KEY, JSON.stringify(q));
  } catch {
    /* ignore */
  }
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function AiHelper({ slug, title, level, objectives }: AiHelperProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaState>({ date: todayKey(), used: 0 });
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setQuota(loadQuota());
  }, []);

  useEffect(() => {
    setMessages([]);
    setError(null);
    setInput("");
  }, [slug]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const remaining = Math.max(0, DAILY_LIMIT - quota.used);
  const quotaExceeded = remaining <= 0;

  const detectSection = useCallback((): string => {
    if (typeof document === "undefined") return "";
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        ".lesson-body h2, .lesson-body h3",
      ),
    );
    if (headings.length === 0) return "";
    const viewportTop = 120;
    let current = headings[0];
    for (const h of headings) {
      const rect = h.getBoundingClientRect();
      if (rect.top <= viewportTop) current = h;
      else break;
    }
    return current.textContent?.trim() ?? "";
  }, []);

  const send = useCallback(async () => {
    const question = input.trim();
    if (!question || loading) return;
    if (quotaExceeded) {
      setError("오늘은 5번 다 물어봤어요. 내일 다시 만나요.");
      return;
    }

    const userMsg: ChatMessage = {
      id: randomId(),
      role: "user",
      content: question,
      at: Date.now(),
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    setError(null);

    const section = detectSection();
    const history = nextHistory
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-10)
      .slice(0, -1)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          lesson: {
            slug,
            title,
            level: String(level),
            section,
            objectives: objectives ?? [],
          },
          history,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        answer?: string;
        error?: string;
      };

      if (!res.ok || !data.answer) {
        setError(data.error ?? "답변을 불러오지 못했어요.");
        setMessages(nextHistory);
      } else {
        const assistantMsg: ChatMessage = {
          id: randomId(),
          role: "assistant",
          content: data.answer,
          at: Date.now(),
        };
        setMessages([...nextHistory, assistantMsg]);
        const nextQuota: QuotaState = {
          date: todayKey(),
          used: quota.used + 1,
        };
        setQuota(nextQuota);
        saveQuota(nextQuota);
      }
    } catch {
      setError("네트워크 문제가 있어요. 잠시 후 다시 시도해주세요.");
      setMessages(nextHistory);
    } finally {
      setLoading(false);
    }
  }, [
    input,
    loading,
    quotaExceeded,
    messages,
    detectSection,
    slug,
    title,
    level,
    objectives,
    quota.used,
  ]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  if (!mounted) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="AI 도우미에게 질문하기"
          className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 dark:focus-visible:ring-orange-500/40 sm:bottom-8 sm:right-8"
        >
          <Bot aria-hidden className="h-6 w-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950",
            "inset-x-3 bottom-3 top-16 sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[560px] sm:w-[400px]",
          )}
        >
          <header className="flex items-start gap-3 border-b border-slate-200 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-white dark:border-slate-800">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Sparkles aria-hidden className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-sm font-semibold">
                AI 학습 도우미
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 truncate text-xs text-white/85">
                이 레슨: {title}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="닫기"
              className="rounded-md p-1 text-white/90 hover:bg-white/15"
            >
              <X aria-hidden className="h-4 w-4" />
            </Dialog.Close>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 text-sm"
          >
            {messages.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-4 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  이 레슨에서 막히는 부분 있어요
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  레슨 내용 중 모르는 걸 편하게 물어봐요. 레슨 맥락을 이미 알고
                  답해드려요.
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <li>예: "레이어가 정확히 뭔가요"</li>
                  <li>예: "이 단축키가 안 먹혀요"</li>
                </ul>
              </div>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
                      )}
                    >
                      {m.content}
                    </div>
                  </li>
                ))}
                {loading ? (
                  <li className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Loader2
                        aria-hidden
                        className="h-4 w-4 animate-spin"
                      />
                      생각 중이에요
                    </div>
                  </li>
                ) : null}
              </ul>
            )}
            {error ? (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                오늘 남은 질문 {remaining} / {DAILY_LIMIT}
              </span>
              <span>{input.length} / {MAX_INPUT_CHARS}</span>
            </div>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) =>
                  setInput(e.target.value.slice(0, MAX_INPUT_CHARS))
                }
                onKeyDown={onKeyDown}
                rows={2}
                placeholder={
                  quotaExceeded
                    ? "오늘 질문은 모두 썼어요"
                    : "궁금한 걸 입력해요 (Enter로 보내기)"
                }
                disabled={quotaExceeded || loading}
                className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300/60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-orange-400 dark:disabled:bg-slate-800"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={quotaExceeded || loading || input.trim().length === 0}
                aria-label="보내기"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                {loading ? (
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                ) : (
                  <Send aria-hidden className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              확실하지 않으면 공식 문서를 함께 확인해주세요.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
