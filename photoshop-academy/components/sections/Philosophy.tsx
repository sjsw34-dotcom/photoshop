import { Clock, Sprout, Tv } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface Promise {
  emoji: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
}

const PROMISES: Promise[] = [
  {
    emoji: "🌱",
    icon: Sprout,
    title: "기초부터 다시 시작합니다",
    body: "마우스 클릭이 뭔지부터 설명합니다. 남들이 당연히 알고 있다고 넘어가는 것들을 하나하나 짚습니다.",
  },
  {
    emoji: "🕐",
    icon: Clock,
    title: "하루 1시간을 넘기지 않습니다",
    body: "각 레슨은 40-60분 분량입니다. 중간에 멈췄다가 다음 날 정확히 그 지점에서 이어갈 수 있어요.",
  },
  {
    emoji: "🎥",
    icon: Tv,
    title: "동영상 없이도 따라할 수 있습니다",
    body: "스크린샷, 단계별 설명, 연습 파일, 체크리스트로 구성했습니다. 내 속도대로 멈추고, 되돌아보고, 다시 해볼 수 있어요.",
  },
];

export function Philosophy() {
  return (
    <section
      aria-labelledby="philosophy-heading"
      className="border-y border-slate-200 bg-slate-50 py-16 md:py-24 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Our Promises
          </p>
          <h2
            id="philosophy-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50"
          >
            이 사이트의 3가지 약속
          </h2>
        </div>
        <ol className="flex flex-col gap-8 md:gap-12">
          {PROMISES.map((p, idx) => {
            const Icon = p.icon;
            const reversed = idx % 2 === 1;
            return (
              <li
                key={p.title}
                className={`grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10 ${reversed ? "md:[&>div:first-child]:order-2" : ""}`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 md:h-24 md:w-24">
                  <Icon aria-hidden className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.6} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-slate-50">
                    <span aria-hidden className="mr-2">
                      {p.emoji}
                    </span>
                    {p.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
                    {p.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
