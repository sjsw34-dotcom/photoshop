"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

interface QA {
  id: string;
  question: string;
  answer: string;
}

const QAS: QA[] = [
  {
    id: "q1",
    question: "포토샵이 없어도 되나요?",
    answer:
      "포토샵은 별도로 설치해야 합니다. 2번째 레슨에서 Adobe 7일 체험판 설치법을 설명드려요. 학생 할인 구독도 안내합니다.",
  },
  {
    id: "q2",
    question: "정말 동영상 없이 따라할 수 있나요?",
    answer:
      "네. 각 레슨은 스크린샷, 단계별 번호 설명, 키보드 단축키 시각화, 연습 파일, 체크리스트로 구성됩니다. 막히는 지점마다 ‘이게 안 될 때’ 문제해결 박스도 있어요. 첫 레슨을 보시면 감이 올 거예요.",
  },
  {
    id: "q3",
    question: "하루 1시간이 정말 충분한가요?",
    answer:
      "충분합니다. 각 레슨이 40-60분 분량이고, 4단계를 다 마치면 약 3-4개월이 걸립니다. 주말을 빼고 주 5일만 공부해도 100일이 안 걸려요.",
  },
  {
    id: "q4",
    question: "학교 진도를 따라잡을 수 있나요?",
    answer:
      "Level 2를 마치면 학과 평균 수준에 근접하고, Level 3를 마치면 전공 과제를 독립적으로 해낼 수 있습니다. 디자인공학과 같은 융합 학과라면 Level 3의 제품 보정/목업 파트가 특히 도움이 됩니다.",
  },
  {
    id: "q5",
    question: "중간에 쉬어도 되나요?",
    answer:
      "네. 진도는 자동 저장됩니다. 다만 너무 오래 쉬면 이전 내용을 잊으니 주 3회 이상을 권장해요. 연속 학습일이 끊어져도 다시 시작하면 됩니다.",
  },
  {
    id: "q6",
    question: "가입해야 하나요?",
    answer:
      "가입 없이 모든 레슨을 이용할 수 있습니다. 진도는 브라우저에 저장돼요. 단, 같은 기기와 브라우저를 계속 사용해야 진도가 이어집니다.",
  },
  {
    id: "q7",
    question: "이 사이트는 무료인가요?",
    answer: "네, 현재는 무료입니다.",
  },
];

export function FAQ() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-y border-slate-200 bg-slate-50 py-16 md:py-24 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50"
          >
            자주 묻는 질문
          </h2>
        </div>

        <Accordion.Root
          type="single"
          collapsible
          className="flex flex-col gap-3"
        >
          {QAS.map((qa) => (
            <Accordion.Item
              key={qa.id}
              value={qa.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:text-slate-50 dark:hover:bg-slate-900">
                  <span>
                    <span aria-hidden className="mr-2 text-orange-500">
                      Q.
                    </span>
                    {qa.question}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-slate-400"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="border-t border-slate-100 px-5 py-4 text-[0.95rem] leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <span aria-hidden className="mr-2 font-semibold text-emerald-600 dark:text-emerald-400">
                    A.
                  </span>
                  {qa.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
