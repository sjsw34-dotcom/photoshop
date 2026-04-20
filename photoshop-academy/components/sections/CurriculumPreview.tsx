import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LevelCard {
  id: 0 | 1 | 2 | 3;
  label: string;
  name: string;
  lessons: number;
  duration: string;
  outcome: string;
  tags: string[];
  accent: string;
}

const LEVELS: LevelCard[] = [
  {
    id: 0,
    label: "Level 0",
    name: "입문",
    lessons: 10,
    duration: "약 2주",
    outcome: "포토샵을 혼자 켜서 사진을 불러오고 크기를 바꿔 저장할 수 있다",
    tags: ["화면 구조", "파일 열기", "저장하기"],
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  },
  {
    id: 1,
    label: "Level 1",
    name: "초급",
    lessons: 25,
    duration: "약 5주",
    outcome: "레이어를 자유롭게 다루고 간단한 합성과 보정을 할 수 있다",
    tags: ["레이어", "선택 영역", "텍스트"],
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  {
    id: 2,
    label: "Level 2",
    name: "중급",
    lessons: 25,
    duration: "약 5주",
    outcome: "포스터, 상세페이지, 인물 보정을 혼자 완성한다",
    tags: ["마스크", "혼합 모드", "펜 툴", "인물 보정"],
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  },
  {
    id: 3,
    label: "Level 3",
    name: "고급",
    lessons: 20,
    duration: "약 4주",
    outcome: "전공 과제와 포트폴리오를 포트폴리오 품질로 완성한다",
    tags: ["제품 보정", "목업", "액션", "출력"],
    accent: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
  },
];

export function CurriculumPreview() {
  return (
    <section
      aria-labelledby="curriculum-heading"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Curriculum
          </p>
          <h2
            id="curriculum-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50"
          >
            4단계로 차근차근
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            총 80개 레슨. 각 레벨 마지막에는 손으로 만드는 실습 프로젝트가 있어요.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
          {LEVELS.map((level) => (
            <li
              key={level.id}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${level.accent}`}
                >
                  {level.label}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {level.lessons}레슨 · {level.duration}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-50">
                {level.name}
              </h3>
              <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  졸업하면 할 수 있는 것
                </p>
                <p className="mt-2 flex items-start gap-2 text-[0.95rem] leading-relaxed text-slate-800 dark:text-slate-200">
                  <span aria-hidden className="mt-0.5 text-emerald-500">
                    ✓
                  </span>
                  <span>{level.outcome}</span>
                </p>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {level.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 text-base font-semibold text-orange-600 transition-colors hover:text-orange-500 dark:text-orange-400"
          >
            전체 커리큘럼 자세히 보기
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
