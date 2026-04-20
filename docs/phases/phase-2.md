# Phase 2 — 랜딩페이지

> **목표**: `app/page.tsx`를 `docs/landing-page.md` 명세대로 완성. 방문자가 30초 안에 "이 사이트가 나에게 맞는지" 판단할 수 있게.

> **예상 소요**: 1일

> **시작 전 참조 문서**: `CLAUDE.md`, `docs/writing-style.md`, `docs/landing-page.md` (전체), `docs/curriculum.md` (Section 2.4 카드 내용용)

> **선행 조건**: Phase 1 완료

---

## 범위 (Scope)

**이 Phase에서 하는 것**:
- 랜딩페이지 9개 섹션 구현
- 모바일 반응형 보장
- 섹션별 CTA 연결 (라우팅은 임시 `#`로 두고 Phase 3에서 실제 경로 연결)

**이 Phase에서 하지 않는 것**:
- 레슨 페이지 자체 (Phase 3)
- 레슨 콘텐츠 (Phase 4)
- 고급 애니메이션 (Phase 5에서 폴리싱)

---

## 체크리스트 (섹션 순서대로 구현)

### 2.1 준비

- [ ] `docs/landing-page.md` 전체를 읽고 톤을 머릿속에 정돈
- [ ] `docs/writing-style.md` Section 2 (하드 룰) 재확인
- [ ] em dash(—) 금지 상기
- [ ] `components/sections/` 폴더 생성 (랜딩 전용 섹션 컴포넌트)

### 2.2 레이아웃 준비 (`app/page.tsx`)

```tsx
// 구조 예시
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Empathy />
      <Philosophy />
      <CurriculumPreview />
      <LessonSample />
      <Features />
      <GrowthStory />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
```

- [ ] 각 섹션 컴포넌트를 `components/sections/` 아래 개별 파일로
- [ ] 각 섹션은 `<section>` 태그 사용 (접근성)
- [ ] 공통 컨테이너 클래스: `max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24`

### 2.3 히어로 (`components/sections/Hero.tsx`)

`docs/landing-page.md` Section 2.1 내용 그대로 구현.

- [ ] 메인 헤드라인: "기초부터 천천히, 포토샵을 내 것으로"
- [ ] 서브: "하루 1시간씩 꾸준히. 3-4개월 뒤에는 학과 과제를 혼자 해냅니다."
- [ ] 부연 한 줄: "동영상 없이도 따라할 수 있게 설계했습니다. 기초가 전혀 없어도 괜찮아요."
- [ ] Primary CTA: "무료로 시작하기" (임시 href `/lessons/0/what-is-photoshop`)
- [ ] Secondary CTA: "커리큘럼 먼저 보기" (임시 href `/curriculum`)
- [ ] 오른쪽: 간단한 일러스트 또는 레슨 카드 미리보기 스택 (lucide 아이콘 조합으로 간단히)

### 2.4 공감 섹션 (`components/sections/Empathy.tsx`)

3개 카드. `docs/landing-page.md` Section 2.2 카피 그대로.

- [ ] 카드는 shadcn `<Card>` 활용
- [ ] 각 카드 상단에 이모지 아이콘 하나씩
- [ ] 데스크톱 `grid-cols-3`, 모바일 `grid-cols-1`
- [ ] 섹션 하단 한 줄: "셋 중 하나라도 맞는다면, 이 사이트는 당신을 위해 만들어졌습니다."

### 2.5 학습 철학 (`components/sections/Philosophy.tsx`)

3가지 약속. `docs/landing-page.md` Section 2.3 참조.

- [ ] 세로 배치 (좌우 번갈아 가며 아이콘 배치하는 Z-pattern도 OK)
- [ ] 각 항목: 아이콘(lucide) + 제목 + 본문
- [ ] 항목 사이 충분한 여백

### 2.6 커리큘럼 미리보기 (`components/sections/CurriculumPreview.tsx`)

4레벨 카드. `docs/landing-page.md` Section 2.4 + `docs/curriculum.md` 참조.

- [ ] 2x2 그리드 (데스크톱), 모바일은 1열
- [ ] 각 카드: 레벨 뱃지 + 레벨명 + (레슨 수 · 기간) + 졸업 후 할 수 있는 것 2개 + 태그
- [ ] 카드 호버 시 살짝 들어올리는 효과 (`hover:-translate-y-1 transition`)
- [ ] 하단 링크: "전체 커리큘럼 자세히 보기 →" (임시 `/curriculum`)

### 2.7 레슨 샘플 (`components/sections/LessonSample.tsx`)

Level 0 첫 레슨 일부 발췌. 실제 레슨이 Phase 4에서 만들어지므로 여기선 하드코딩.

- [ ] 배경: `bg-slate-50 dark:bg-slate-900`로 다른 섹션과 구분
- [ ] 작은 레슨 카드 형태로 "🍎 일상 비유로 먼저 이해하기" 발췌 노출
  - 제목: "레슨 1 · 포토샵이 뭐고 왜 쓰나요"
  - 본문: "포토샵은 사진이나 그림을 편집할 수 있는 프로그램이에요. ..." (자연스러운 1-2문단)
- [ ] "이어서 읽기 →" CTA (임시 링크)

### 2.8 특장점 (`components/sections/Features.tsx`)

6개 카드, 3x2 그리드. `docs/landing-page.md` Section 2.6 그대로.

- [ ] 각 카드: 이모지 아이콘 + 제목 + 한 줄 설명
- [ ] 모바일에서는 2x3 또는 1열

### 2.9 성장 스토리 (선택, `components/sections/GrowthStory.tsx`)

3개 타임라인 카드. 구현 시간이 빠듯하면 생략 가능 (하지만 있으면 감정 이입 효과 큼).

- [ ] 타임라인 형식 (왼쪽에 주차, 오른쪽에 상황)
- [ ] 하단에 작은 글씨로 "가상 학습 경로 예시입니다" 명시

### 2.10 FAQ (`components/sections/FAQ.tsx`)

7개 아코디언. shadcn `<Accordion>` 사용.

- [ ] `docs/landing-page.md` Section 2.8의 7개 Q/A 그대로 사용
- [ ] `type="single"`, `collapsible`
- [ ] 질문은 굵게, 답변은 적당한 줄바꿈

### 2.11 마지막 CTA (`components/sections/FinalCTA.tsx`)

간단하고 강렬하게.

- [ ] 헤드라인: "오늘 첫 레슨을 시작해봐요"
- [ ] 서브: "40분이면 충분합니다. 어려우면 여기서 멈추셔도 괜찮아요."
- [ ] 큰 버튼: "Level 0 · 레슨 1 시작하기"
- [ ] 마이크로: "가입 필요 없음 · 진도 자동 저장 · 모바일 지원"
- [ ] 배경 강조 (primary 컬러 톤)

### 2.12 검증

- [ ] 모바일 375px, 768px, 1024px, 1440px에서 모두 깨지지 않음
- [ ] 다크/라이트 모드 양쪽에서 가독성 확인
- [ ] 키보드 Tab으로 모든 CTA 도달 가능
- [ ] em dash(—) 사용된 곳 없는지 `grep -r " — " app/ components/` 로 확인
- [ ] Lighthouse 기준 접근성 90+ 목표
- [ ] 로딩 속도: 이미지 placeholder 외 3초 이내 렌더

---

## Phase 2 완료 시 보고 포맷

### 1. 무엇을 만들었나
- 9개 섹션 컴포넌트 파일 경로 나열
- 각 섹션 핵심 한 줄 요약

### 2. 어떻게 확인하나
```bash
npm run dev
```
- http://localhost:3000 접속
- 스크롤하며 섹션 9개 모두 확인
- 모바일 뷰 토글 (크롬 개발자도구)
- 다크모드 전환

### 3. Phase 3 시작 전 마스터가 할 일
- 랜딩 카피 수정 요청할 부분이 있으면 알려주세요
- 히어로 일러스트/이미지를 교체할 계획이 있으면 말씀해주세요

---

## 주의 사항

- **카피를 창작하지 마라.** `docs/landing-page.md`의 카피를 그대로 쓴다. 고치고 싶으면 마스터에게 먼저 물어본다.
- **과잉 애니메이션 금지.** 스크롤 시 살짝 페이드 인 정도면 충분.
- **이모지 남용 금지.** 섹션 제목당 최대 1개.
- **이미지는 placeholder로.** 실제 일러스트/사진은 마스터가 나중에 교체.
- **CTA 경로는 임시 path로.** Phase 3에서 실제 라우트가 생기면 그때 바꾼다.
- 커밋 메시지 제안: `feat(phase-2): complete landing page with all 9 sections`
