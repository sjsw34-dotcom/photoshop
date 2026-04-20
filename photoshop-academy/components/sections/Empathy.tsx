interface EmpathyCard {
  emoji: string;
  title: string;
  body: string;
}

const CARDS: EmpathyCard[] = [
  {
    emoji: "📚",
    title: "학교 수업은 이미 진도가 나가고 있는데, 저만 기초가 없어요",
    body: "복학 후 따라잡기가 막막한 학생",
  },
  {
    emoji: "⏰",
    title: "공부할 시간이 하루 1시간뿐이에요",
    body: "아르바이트, 다른 수업, 생활 리듬이 있는 학생",
  },
  {
    emoji: "📖",
    title: "유튜브 영상은 너무 빠르고, 책은 두꺼워서 안 읽혀요",
    body: "자기 속도로 꼼꼼히 이해하고 싶은 학생",
  },
];

export function Empathy() {
  return (
    <section
      aria-labelledby="empathy-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <h2
            id="empathy-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50"
          >
            혹시 이런 고민이 있으신가요?
          </h2>
        </div>
        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {CARDS.map((card) => (
            <li
              key={card.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span
                aria-hidden
                className="text-3xl leading-none"
              >
                {card.emoji}
              </span>
              <p className="mt-4 text-base font-semibold leading-relaxed text-slate-900 dark:text-slate-50">
                &ldquo;{card.title}&rdquo;
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-base text-slate-700 md:text-lg dark:text-slate-300">
          셋 중 하나라도 맞는다면, 이 사이트는 당신을 위해 만들어졌습니다.
        </p>
      </div>
    </section>
  );
}
