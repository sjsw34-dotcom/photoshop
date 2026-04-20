import type { ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutType = "tip" | "warning" | "danger" | "info";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const styles: Record<
  CalloutType,
  { wrapper: string; iconWrapper: string; icon: typeof Info; defaultTitle: string }
> = {
  tip: {
    wrapper:
      "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40",
    iconWrapper: "text-amber-600 dark:text-amber-300",
    icon: Lightbulb,
    defaultTitle: "팁",
  },
  warning: {
    wrapper:
      "border-orange-200 bg-orange-50 dark:border-orange-900/60 dark:bg-orange-950/40",
    iconWrapper: "text-orange-600 dark:text-orange-300",
    icon: AlertTriangle,
    defaultTitle: "주의",
  },
  danger: {
    wrapper:
      "border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/40",
    iconWrapper: "text-red-600 dark:text-red-300",
    icon: OctagonAlert,
    defaultTitle: "위험",
  },
  info: {
    wrapper:
      "border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/40",
    iconWrapper: "text-sky-600 dark:text-sky-300",
    icon: Info,
    defaultTitle: "참고",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const conf = styles[type];
  const Icon = conf.icon;
  return (
    <aside
      role="note"
      aria-label={title ?? conf.defaultTitle}
      className={cn(
        "my-6 flex gap-3 rounded-xl border p-4 text-[0.95rem] leading-relaxed text-slate-800 dark:text-slate-100",
        conf.wrapper,
      )}
    >
      <span
        aria-hidden
        className={cn("mt-0.5 shrink-0", conf.iconWrapper)}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-semibold">{title ?? conf.defaultTitle}</p>
        <div>{children}</div>
      </div>
    </aside>
  );
}
