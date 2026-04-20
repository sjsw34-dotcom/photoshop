# CLAUDE.md — Photoshop Academy

> 이 파일은 프로젝트의 **핵심 정체성과 하드 룰**만 담는다. 세부 명세는 `docs/` 아래 분할되어 있다. Claude는 작업 시작 시 이 파일을 먼저 읽고, 필요한 세부 문서만 그때그때 열어본다.

---

## 1. 프로젝트 한 줄 요약

디자인공학과 복학생(23세, 기초 없음, 공백 2년)이 **하루 1시간씩 꾸준히 공부해 포토샵을 실무 수준으로** 다룰 수 있게 만드는 웹 학습 플랫폼.

---

## 2. 하드 룰 (절대 위반 금지)

이 6가지는 어떤 파일을 작성하든, 어떤 작업을 하든 **반드시** 지킨다.

1. **기초부터 시작한다.** 초등학교 고학년도 이해할 수 있는 어휘. 첫 개념은 반드시 일상 비유로 설명 후 정식 명칭 연결.
2. **동영상 없이, 실습 업로드 중심으로 작동한다.** 레슨 본문에 마스터가 찍은 스크린샷을 최소화하고, **모든 레슨은 학습자가 본인 결과물을 업로드해 '출발점 vs 내 결과'로 비교**하는 `<PracticeCompare>` 섹션으로 마감한다. 갤러리에 쌓인 본인 작품이 증거가 된다. 세부는 `docs/offline-learning-devices.md`.
3. **하루 1시간을 지킨다.** 레슨 1개 = 40-60분. 초과하면 두 개로 쪼갠다.
4. **문체 규칙 엄수.** 존댓말, 한 문장 50자 이내, 전문용어 첫 등장 시 괄호 병기, **em dash(—) 사용 금지** (쉼표/마침표/괄호로 대체). 세부는 `docs/writing-style.md`.
5. **학습자 경험 > 코드 아름다움.** 깔끔한 추상화를 위해 UX를 희생하지 않는다.
6. **일관된 실습 형식.** 모든 레슨 MDX는 `hasPractice: true` frontmatter + `<PracticeCompare>` 블록을 갖는다. 업로드 결과는 IndexedDB에 저장되고 대시보드 갤러리에 썸네일로 누적된다. 구조가 매 레슨 달라지면 안 된다.

---

## 3. 기술 스택

> Phase 1에서 실제 설치된 버전 기준. `docs/phases/phase-1.md`의 초기 가정(Next 14, shadcn CLI)과 다름 — 실제에 맞춰 이 섹션이 우선.

- **Next.js 16** (App Router, Turbopack) + TypeScript strict
  - React 19 (Next 16 내장 canary 채널)
  - ⚠️ `photoshop-academy/AGENTS.md` 참고: Next 16은 학습 데이터와 다를 수 있음. 애매하면 `photoshop-academy/node_modules/next/dist/docs/` 먼저 확인.
- **Tailwind CSS v4** (CSS-first, `@theme` 블록, `@custom-variant dark`) — `tailwind.config.js` 없음
- **UI 프리미티브**: Radix UI만 직접 설치 (`@radix-ui/react-dialog` 등 필요 시). shadcn CLI는 Tailwind v4 초기 호환 리스크로 **사용하지 않음**. 버튼/카드 등은 Tailwind 유틸리티로 손으로 작성.
- **next-themes** (다크모드 class 기반, `<html>`에 `.dark` 토글)
- **Zustand** + `persist` → localStorage (진도 추적)
- **Pretendard Variable** (jsDelivr CDN import) — 본문 한국어 가독성
- **lucide-react** 아이콘 (PascalCase named imports)
- **MDX** (레슨 콘텐츠, Phase 3부터 설정)
- **Vercel** 배포

---

## 4. 디렉토리 구조

> **루트 2단 구조**: 저장소 루트에는 메타 문서(`CLAUDE.md`, `docs/`)만, Next.js 앱 전체는 `photoshop-academy/` 서브폴더. 한글 경로에서 `create-next-app .` 이 npm 네이밍 규칙을 위반해 실패하므로 이 분리를 유지한다. **모든 `npm` / `next` 명령은 `photoshop-academy/` 안에서 실행한다.**

```
포토샵/                              # 저장소 루트 (git init 된 곳)
├── CLAUDE.md                        # 이 파일
├── docs/                            # 상세 명세 (Claude는 필요할 때만 읽음)
│   ├── curriculum.md                # 80레슨 리스트
│   ├── lesson-template.md           # MDX 레슨 템플릿
│   ├── writing-style.md             # 문체/비유 규칙
│   ├── components.md                # 공통 컴포넌트 스펙
│   ├── progress-system.md           # 진도 추적 시스템
│   ├── landing-page.md              # 랜딩페이지 명세
│   ├── offline-learning-devices.md  # 동영상 대체 장치
│   ├── glossary.md                  # 용어 사전 시드 데이터
│   └── phases/
│       ├── phase-1.md ~ phase-6.md
└── photoshop-academy/               # Next.js 앱 루트 (package.json 여기)
    ├── AGENTS.md                    # Next 16 자동 생성 — API가 훈련 데이터와 다를 수 있다는 경고
    ├── app/
    │   ├── layout.tsx               # ThemeProvider + Header + Footer, lang="ko"
    │   ├── page.tsx                 # Phase 1 임시 데모 (Phase 2에서 교체)
    │   └── globals.css              # Pretendard import + Tailwind v4 @theme + @custom-variant dark
    ├── components/
    │   ├── theme-provider.tsx       # next-themes 클라이언트 래퍼
    │   ├── layout/                  # Header, Footer, ThemeToggle
    │   ├── lesson/                  # StepGuide/Step, Screenshot, KeyboardShortcut, Checklist, Callout, NextLessonCard
    │   └── progress/                # ProgressBar
    ├── lib/
    │   ├── store.ts                 # Zustand progress store + persist(name: photoshop-academy-progress)
    │   ├── utils.ts                 # cn() = twMerge(clsx(...))
    │   └── constants.ts             # SITE, LEVELS, NAV_LINKS
    ├── content/lessons/             # Phase 3+에서 생성 (MDX)
    ├── public/
    │   ├── screenshots/             # placeholder.svg 포함
    │   └── practice-files/          # .gitkeep
    ├── package.json                 # engines.node >=18.17
    ├── next.config.ts
    ├── tsconfig.json                # paths: "@/*": ["./*"]
    └── postcss.config.mjs           # @tailwindcss/postcss
```

---

## 5. 작업 지시 규칙 (매우 중요)

### 5.1 Claude는 한 번에 한 Phase만 수행한다
- 사용자가 "Phase 1 시작해줘" 하면 `docs/phases/phase-1.md`만 읽고 그것만 완료.
- Phase 범위를 벗어나는 일을 미리 하지 않는다.
- Phase 내부에서도 체크리스트 순서대로, 한 항목 끝나면 다음 항목.

### 5.2 Claude가 매 작업에서 자동으로 참조하는 파일
- `CLAUDE.md` (이 파일): 항상
- `docs/writing-style.md`: 한국어 텍스트를 쓸 때마다
- 현재 Phase의 `docs/phases/phase-N.md`: 그 Phase 작업 중에만

### 5.3 그 외 docs는 필요할 때만 연다
- 레슨 MDX 작성 중 → `docs/lesson-template.md`, `docs/curriculum.md`
- 랜딩페이지 작업 중 → `docs/landing-page.md`
- 컴포넌트 구현 중 → `docs/components.md`
- 진도 로직 구현 중 → `docs/progress-system.md`

### 5.4 Phase 완료 시 보고 포맷
각 Phase가 끝나면 **한 화면 분량**으로 다음을 보고한다.
- 무엇을 만들었는가 (파일 목록 + 각 파일의 역할 한 줄)
- 어떻게 확인하는가 (`npm run dev` 이후 볼 지점)
- 다음 Phase 진입 전 사용자(마스터)가 할 일

### 5.5 실전 주의 (Phase 1-2에서 얻은 교훈)

- **cwd 디시플린**: 모든 `npm` / `npx` / `next` 명령은 `photoshop-academy/` 안에서 실행한다. bash 세션의 cwd가 가끔 저장소 루트로 되돌아가는 경우가 있어, 확인 없이 실행하면 루트에 엉뚱한 `package.json` · `node_modules` · `package-lock.json`이 생긴다. 발견 즉시 루트의 해당 파일/폴더 삭제 후 `photoshop-academy/` 안에서 재설치. 긴 명령 블록 시작 전에는 `pwd`로 먼저 확인.
- **React 19 + Zustand selector 패턴**: selector 안에서 `?? []` / `?? {}` 같은 기본값은 **모듈 스코프의 동결 상수**로 빼라. 매 렌더마다 새 배열/객체 참조가 반환되면 React 19의 `useSyncExternalStore`가 `getServerSnapshot` 무한루프 에러를 던진다.
  ```ts
  const EMPTY: readonly string[] = Object.freeze([]);
  const done = useProgress((s) => s.lessons[slug]?.checklistDone ?? EMPTY);
  ```

---

## 6. 모호할 때

- 이 CLAUDE.md와 `docs/` 사이에 충돌이 있으면 **이 파일이 우선**.
- 두 docs 파일이 충돌하면 **질문하라. 추측으로 진행 금지.**
- "이 기능을 추가하면 좋을 것 같다"는 생각이 들면 구현 전에 먼저 사용자에게 제안.

---

## 7. 학습자 페르소나 (한 줄 요약)

> 23세 남성, 디자인공학과 복학 예정, 개인 사정으로 2년 공백, 포토샵 한 번도 안 열어봄, 동급생은 이미 능숙하게 다룸, 의욕은 있지만 자존심 상함. 친절한 형/누나 톤으로 설명하되 무시하거나 과잉 배려하지 않는다.
