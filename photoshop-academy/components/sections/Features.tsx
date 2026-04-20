interface Feature {
  emoji: string;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    emoji: "📸",
    title: "번호가 매겨진 스크린샷",
    body: "각 단계마다 빨간 원과 번호로 어디를 클릭해야 하는지 정확히 표시합니다.",
  },
  {
    emoji: "⌨️",
    title: "단축키 시각화",
    body: "키보드 모양 그래픽으로 어떤 키를 눌러야 하는지 한눈에.",
  },
  {
    emoji: "📁",
    title: "연습 파일 제공",
    body: "시작 파일과 완성 파일을 둘 다 제공합니다. 내 결과물과 비교해볼 수 있어요.",
  },
  {
    emoji: "✅",
    title: "단계별 체크리스트",
    body: "오늘 내가 뭘 배웠는지 스스로 확인하고 다음으로 넘어갑니다.",
  },
  {
    emoji: "🔍",
    title: "비교 슬라이더",
    body: "보정 전과 후를 드래그로 비교해 차이를 눈으로 확인합니다.",
  },
  {
    emoji: "🧭",
    title: "진도 자동 저장",
    body: "어디까지 했는지 자동으로 저장됩니다. 가입이나 로그인 없이요.",
  },
];

export function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            How it works
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50"
          >
            동영상 없이도 충분한 이유
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            내 속도대로 멈추고, 되돌아보고, 다시 해볼 수 있는 학습 장치 6가지.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li
              key={f.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span aria-hidden className="text-3xl leading-none">
                {f.emoji}
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-50">
                {f.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
                {f.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
