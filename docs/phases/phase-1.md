# Phase 1 — 뼈대 셋업

> **목표**: Next.js 프로젝트 초기화 + 기본 레이아웃 + 진도 스토어 + 최소 컴포넌트 6개. 레슨 콘텐츠는 다루지 않는다.

> **예상 소요**: 1-2일

> **시작 전 참조 문서**: `CLAUDE.md`, `docs/components.md` (Section 13 우선순위), `docs/progress-system.md` (Section 11 Phase 1 부분)

---

## 범위 (Scope)

**이 Phase에서 하는 것**:
- Next.js 14 프로젝트 생성
- Tailwind CSS + shadcn/ui 설정
- 기본 레이아웃 (헤더, 푸터, 다크모드 토글)
- Zustand 진도 스토어 구조
- 최소 컴포넌트 6개 구현

**이 Phase에서 하지 않는 것**:
- 랜딩페이지 (Phase 2)
- 레슨 페이지 (Phase 3)
- 레슨 콘텐츠 작성 (Phase 4)
- 대시보드 (Phase 3)

---

## 체크리스트 (순서대로)

### 1.1 프로젝트 초기화
- [ ] `npx create-next-app@latest photoshop-academy --typescript --tailwind --app --no-src-dir --eslint --turbopack`
- [ ] 설치 후 `npm run dev`로 빈 페이지 확인
- [ ] `package.json`에서 Node 버전 `>=18.17` 명시

### 1.2 필수 의존성 설치
- [ ] `npm install zustand`
- [ ] `npm install lucide-react`
- [ ] `npm install clsx tailwind-merge`
- [ ] `npm install next-themes`  (다크모드)
- [ ] `npx shadcn@latest init` (컬러: Slate, CSS variables: Yes)

### 1.3 shadcn 컴포넌트 추가 (초기)
- [ ] `npx shadcn@latest add button`
- [ ] `npx shadcn@latest add card`
- [ ] `npx shadcn@latest add accordion`
- [ ] `npx shadcn@latest add dialog`

### 1.4 디렉토리 구조 생성
```
app/
├── layout.tsx                 # 수정: 헤더/푸터/테마 프로바이더
├── page.tsx                   # 임시 페이지 (Phase 2에서 교체)
└── globals.css                # 폰트, 컬러 변수
components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ThemeToggle.tsx
├── lesson/
│   ├── StepGuide.tsx
│   ├── Step.tsx
│   ├── Screenshot.tsx
│   ├── KeyboardShortcut.tsx
│   ├── Checklist.tsx
│   ├── Callout.tsx
│   └── NextLessonCard.tsx
├── progress/
│   └── ProgressBar.tsx
└── ui/                        # shadcn 자동 생성
lib/
├── store.ts                   # Zustand
├── utils.ts                   # cn() 헬퍼 (shadcn 기본)
└── constants.ts               # 레벨 정보 등 상수
public/
├── screenshots/
│   └── placeholder.png        # 임시 스크린샷
└── practice-files/
    └── .gitkeep
```

### 1.5 글로벌 스타일 설정
- [ ] `app/globals.css`에 Pretendard 폰트 import
  ```css
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
  ```
- [ ] 다크모드 컬러 변수 정의 (shadcn 기본값 + orange-500 accent 추가)
- [ ] `body`에 `font-pretendard` 적용

### 1.6 루트 레이아웃 (`app/layout.tsx`)
- [ ] 메타데이터: title "포토샵 아카데미", description 추가
- [ ] `<ThemeProvider>` (next-themes) 감싸기
- [ ] `<Header />`, 메인 `children`, `<Footer />` 배치
- [ ] 모바일 최소 너비 고려 (`min-w-[320px]`)

### 1.7 헤더 (`components/layout/Header.tsx`)
- 왼쪽: 로고 "포토샵 아카데미" (임시 텍스트)
- 중앙(또는 햄버거): 내비게이션 링크
  - 홈 (`/`)
  - 커리큘럼 (`/curriculum`)
  - 내 진도 (`/dashboard`)
  - 용어 사전 (`/glossary`)
- 오른쪽: `<ThemeToggle />`
- 모바일: 햄버거 메뉴 + Drawer

### 1.8 푸터 (`components/layout/Footer.tsx`)
- 간단하게: 저작권, 문의 이메일 자리, 피드백 링크
- 높이 낮게, 과하지 않게

### 1.9 다크모드 토글 (`components/layout/ThemeToggle.tsx`)
- lucide-react의 Sun/Moon 아이콘
- `next-themes`의 `useTheme()` 사용
- SSR 대응 (mounted 체크)

### 1.10 Zustand 스토어 (`lib/store.ts`)
`docs/progress-system.md` Section 2 타입 정의 참조. Phase 1에서 구현할 최소 액션:

- [ ] `lessons`, `streak`, `lastStudyDate`, `totalMinutes`, `longestStreak`, `currentLevel`, `lastLessonSlug` 초기 상태
- [ ] `initLesson(slug)`: 레슨이 없으면 기본값으로 초기화
- [ ] `markInProgress(slug)`: 상태 `in_progress`로, streak 업데이트
- [ ] `updateChecklist(slug, itemId, checked)`: 체크리스트 배열 갱신
- [ ] `completeLesson(slug)`: 상태 `completed`, `completedAt` 기록
- [ ] `isLessonUnlocked(slug)`: 단순화 버전 (Phase 1에선 모두 true 반환해도 OK)

- [ ] `persist` 미들웨어로 localStorage 저장 (name: `photoshop-academy-progress`, version: 1)

### 1.11 최소 컴포넌트 구현

각 컴포넌트의 상세 props는 `docs/components.md` 참조. Phase 1에서는 기본 버전만.

#### `<StepGuide>` / `<Step>`
- 번호 원 (Tailwind) + 제목 + 본문
- 모바일 대응

#### `<Screenshot>`
- `next/image` 사용
- 클릭 시 shadcn Dialog로 라이트박스 (간단 버전)
- **highlight prop은 Phase 3에서 추가**. 여기선 alt + src만.

#### `<KeyboardShortcut>`
- 각 키를 rounded border box로 렌더
- Windows/Mac 자동 감지: `navigator.userAgent` 또는 `navigator.platform`
- SSR hydration 주의 (`useEffect` 안에서 감지)

#### `<Checklist>`
- children을 파싱해 체크박스 리스트 렌더
- **단순화**: MDX에서 마크다운 리스트 사용 대신, children 배열을 map
- Zustand `updateChecklist` 연동
- 체크 상태는 Zustand에서 읽기

#### `<Callout>`
- type별 컬러와 아이콘
- children 렌더

#### `<NextLessonCard>`
- Phase 1에서는 placeholder (실제 라우팅은 Phase 3)
- "다음 레슨 준비중" 정도

### 1.12 임시 홈 페이지
- [ ] `app/page.tsx`에 각 컴포넌트 데모 표시 (개발 확인용)
- [ ] 이 페이지는 Phase 2에서 완전히 교체됨

### 1.13 검증
- [ ] `npm run dev`로 로컬 실행 성공
- [ ] `npm run build` 통과 (타입 에러 없음)
- [ ] 다크/라이트 모드 전환 확인
- [ ] 모바일 뷰 (크롬 개발자도구 375px) 깨지지 않음
- [ ] localStorage에 `photoshop-academy-progress` 키 저장 확인

---

## Phase 1 완료 시 보고 포맷

마스터에게 다음 3가지를 한 화면 분량으로 보고:

### 1. 무엇을 만들었나
- 파일 목록 + 각 파일의 역할 한 줄씩

### 2. 어떻게 확인하나
```bash
cd photoshop-academy
npm run dev
```
- http://localhost:3000 접속
- 임시 홈에서 컴포넌트 데모 확인
- 다크모드 토글 테스트
- 개발자도구 Application > Local Storage에서 스토어 확인

### 3. Phase 2 시작 전 마스터가 할 일
- (있다면 명시. 없으면 "바로 Phase 2 진행 가능"이라 쓰기)

---

## 주의 사항

- **이 Phase에서 레슨 콘텐츠를 만들지 말 것.** MDX 설정도 Phase 3에서 한다.
- **컴포넌트를 과하게 만들지 말 것.** `docs/components.md` Section 13의 "Phase 1 구현" 목록만.
- **디자인을 완벽하게 하려 들지 말 것.** 기본적으로 작동하면 충분. 세부 스타일은 Phase 2, 5에서 다듬는다.
- 커밋 메시지 제안: `feat(phase-1): setup scaffold with components and progress store`
