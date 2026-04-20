interface StoryCard {
  week: string;
  stage: string;
  quote: string;
}

const STORIES: StoryCard[] = [
  {
    week: "1주차",
    stage: "Level 0 중반",
    quote:
      "아직 레이어가 뭔지도 헷갈립니다. 근데 포토샵을 혼자 켤 수 있게 됐어요.",
  },
  {
    week: "6주차",
    stage: "Level 1 완료",
    quote: "친구 생일 카드를 혼자 만들어 선물했습니다. 자기만의 도구가 생긴 기분.",
  },
  {
    week: "12주차",
    stage: "Level 3 진입",
    quote:
      "학과 과제에서 처음으로 \u2018이거 네가 한 거야?\u2019 소리를 들었습니다.",
  },
];

export function GrowthStory() {
  return (
    <section
      aria-labelledby="story-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Growth Timeline
          </p>
          <h2
            id="story-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50"
          >
            3개월 뒤의 나
          </h2>
        </div>

        <ol
          role="list"
          className="relative grid gap-4 md:grid-cols-3 md:gap-6"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-6 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 md:block dark:from-orange-800 dark:via-orange-500 dark:to-orange-800"
          />
          {STORIES.map((story, idx) => (
            <li
              key={story.week}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span
                aria-hidden
                className="absolute left-6 -top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-xs font-bold text-white dark:border-slate-950"
              >
                {idx + 1}
              </span>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {story.week}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  · {story.stage}
                </span>
              </div>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-800 dark:text-slate-200">
                &ldquo;{story.quote}&rdquo;
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
          실제 학습자 후기가 아닌 학습 경로 예시입니다.
        </p>
      </div>
    </section>
  );
}
