import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  label,
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(current)));
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label || showPercentage ? (
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          {label ? <span>{label}</span> : <span aria-hidden />}
          {showPercentage ? <span className="tabular-nums">{pct}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className="h-full rounded-full bg-orange-500 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
