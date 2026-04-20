# Phase 3 — 레슨 인프라

> **목표**: MDX 기반 레슨 시스템, 동적 라우팅, 커리큘럼 지도, 대시보드 구현. 단, 레슨 콘텐츠는 아직 거의 비어있어도 된다 (Phase 4에서 채움).

> **예상 소요**: 1-2일

> **시작 전 참조 문서**: `CLAUDE.md`, `docs/lesson-template.md`, `docs/components.md` (전체), `docs/progress-system.md` (Section 11 Phase 3 부분), `docs/curriculum.md`

> **선행 조건**: Phase 1, 2 완료

---

## 범위 (Scope)

**이 Phase에서 하는 것**:
- MDX 설정 (`@next/mdx` 또는 `contentlayer` 중 선택)
- 레슨 동적 라우트 `/lessons/[level]/[slug]`
- 커리큘럼 지도 페이지 `/curriculum`
- 대시보드 페이지 `/dashboard`
- 용어 사전 페이지 `/glossary` (기본 렌더링만)
- 나머지 컴포넌트 구현 (Screenshot highlight, Quiz, PracticeFile, BeforeAfter, TroubleShoot 등)
- 스크롤 위치 저장/복원
- 학습 시간 측정

**이 Phase에서 하지 않는 것**:
- 모든 레슨 콘텐츠 작성 (Phase 4)
- 배지 시스템 (Phase 5)
- AI 도우미 (Phase 6)

---

## 체크리스트

### 3.1 MDX 설정

#### 선택지
- **옵션 A (권장)**: `@next/mdx` + gray-matter + remark 플러그인
- **옵션 B**: `contentlayer` (타입 안전성 좋지만 Next 14 호환성 이슈 있을 수 있음)

여기서는 **옵션 A** 기준.

- [ ] `npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter`
- [ ] `npm install rehype-slug rehype-autolink-headings remark-gfm`
- [ ] `next.config.mjs` 수정:
  ```js
  import createMDX from '@next/mdx';
  
  const withMDX = createMDX({
    options: {
      remarkPlugins: [['remark-gfm']],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
    },
  });
  
  export default withMDX({
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  });
  ```

### 3.2 레슨 메타데이터 로더 (`lib/lessons.ts`)

- [ ] `content/lessons/` 폴더 전체 스캔
- [ ] 각 MDX의 frontmatter를 파싱 (`gray-matter`)
- [ ] 다음 함수 export:
  ```typescript
  export function getAllLessons(): LessonMeta[];
  export function getLessonBySlug(slug: string): LessonMeta | null;
  export function getLessonsByLevel(level: 0|1|2|3): LessonMeta[];
  export function getNextLesson(slug: string): LessonMeta | null;
  export function getPrevLesson(slug: string): LessonMeta | null;
  ```
- [ ] 빌드 시점에 캐싱 (각 함수 호출마다 파일 재읽기 방지)

### 3.3 MDX 컴포넌트 매핑 (`mdx-components.tsx`)

Next 14 App Router에서는 루트에 `mdx-components.tsx`를 둔다.

- [ ] 커스텀 컴포넌트 전역 등록
  ```tsx
  import { StepGuide, Step, Screenshot, /* ... */ } from '@/components/lesson';
  
  export function useMDXComponents(components) {
    return {
      StepGuide, Step, Screenshot,
      KeyboardShortcut, Checklist, Quiz, Question,
      PracticeFile, Callout, BeforeAfter, TroubleShoot,
      NextLessonCard,
      // 기본 HTML 요소 스타일 override
      h2: ({ children }) => <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>,
      // ...
      ...components,
    };
  }
  ```

### 3.4 레슨 동적 라우트

경로: `/lessons/[level]/[slug]`

- [ ] `app/lessons/[level]/[slug]/page.tsx` 생성
- [ ] `generateStaticParams()`로 모든 레슨 사전 렌더
- [ ] 해당 MDX 파일을 동적 import:
  ```tsx
  const LessonContent = (await import(`@/content/lessons/${level}/${slug}.mdx`)).default;
  ```
- [ ] 페이지 구성:
  1. 상단: 브레드크럼 (홈 > Level N > 레슨 제목)
  2. 레슨 제목 + 예상 시간 + 레벨 뱃지
  3. 좌측 고정 목차 (데스크톱)
  4. 본문 MDX 렌더
  5. 하단: 이전 레슨 / 다음 레슨 링크
  6. 우하단: 맨 위로 버튼
  7. 하단 피드백 👍/👎

### 3.5 레슨 페이지 레이아웃 (`app/lessons/[level]/[slug]/layout.tsx`)

- [ ] 진행률 바 (이 레슨 안에서 스크롤 기준)
- [ ] IntersectionObserver로 현재 위치 감지
- [ ] 스크롤 위치 자동 저장 (500ms 디바운스)
- [ ] 학습 시간 측정 시작 (페이지 visible 동안)

### 3.6 나머지 컴포넌트 완성

#### `<Screenshot>` 업그레이드
- [ ] `highlight` prop 지원: 빨간 원 + 번호 오버레이
- [ ] 클릭 시 라이트박스 (shadcn Dialog)
- [ ] 핀치 줌 지원 (모바일)

#### `<Quiz>` / `<Question>` 구현
- [ ] MDX 내부의 `- [ ]` / `- [x]` 마크다운을 파싱
- [ ] 4지선다 UI
- [ ] 즉시 정오 피드백 + 해설
- [ ] 점수 계산 + Zustand 저장

#### `<BeforeAfter>` 구현
- [ ] 가로 드래그 슬라이더
- [ ] 키보드 좌우 화살표 지원
- [ ] 접근성 label

#### `<TroubleShoot>` 구현
- [ ] shadcn Collapsible 또는 자체 구현
- [ ] 기본 접힘

#### `<PracticeFile>` 구현
- [ ] 다운로드 버튼 + 파일 크기 표시
- [ ] 다운로드 시 tracking (선택)

#### `<NextLessonCard>` 완성
- [ ] `lib/lessons.ts`의 `getNextLesson`으로 다음 레슨 정보 가져오기
- [ ] 다음 레슨이 잠겨있으면 안내 메시지
- [ ] 현재 레슨 미완료면 경고

### 3.7 커리큘럼 페이지 (`app/curriculum/page.tsx`)

- [ ] 4레벨 섹션으로 구분
- [ ] 각 레벨 헤더: 레벨 번호 + 이름 + 졸업 조건 + 예상 기간
- [ ] 레슨 카드 목록: 제목, 순서, 분, 잠금/해제 상태
- [ ] 각 카드 클릭 시 해당 레슨 페이지로 이동
- [ ] 실습 프로젝트는 특별한 스타일(강조 테두리)

### 3.8 대시보드 (`app/dashboard/page.tsx`)

`docs/progress-system.md` Section 7 참조.

- [ ] 인사말 + 오늘 날짜 + 스트릭 카운터
- [ ] "이어서 학습하기" 카드 (크게): 가장 최근 `in_progress` 레슨
- [ ] 레벨별 프로그레스 바 4개
- [ ] 최근 완료 레슨 5개 리스트
- [ ] (선택) 이번 주 학습 시간 막대 그래프

### 3.9 용어 사전 페이지 (`app/glossary/page.tsx`)

- [ ] `docs/glossary.md`를 파싱해 JSON으로 변환, `content/glossary.json`으로 저장
- [ ] 검색창 (한글/영문)
- [ ] 카테고리 필터 (basic, layer, tool, color, effect, advanced)
- [ ] 가나다순 정렬된 카드 리스트
- [ ] 각 카드: 한글명 + 영문 + 쉬운 설명 + 관련 레슨 링크

### 3.10 레슨 본문 내 용어 툴팁 (선택적)

- [ ] 레슨 frontmatter의 `keyTerms`를 기반으로 본문에서 해당 용어에 점선 밑줄
- [ ] 호버 시 `easyDefinition` 툴팁 (shadcn Tooltip)
- [ ] 구현이 복잡하면 Phase 5로 미뤄도 OK

### 3.11 샘플 레슨 MDX 1개 작성

Phase 3가 작동하는지 확인용. Level 0 레슨 1번만.

- [ ] `content/lessons/00-intro/01-what-is-photoshop.mdx` 작성
- [ ] `docs/lesson-template.md` 템플릿 엄수
- [ ] 모든 커스텀 컴포넌트 최소 1회씩 사용
- [ ] 스크린샷은 `/screenshots/placeholder.png`로 통일, alt는 구체적으로

### 3.12 검증

- [ ] `/lessons/0/what-is-photoshop` 접속 시 레슨 렌더링
- [ ] 체크리스트 체크 → 새로고침 후 상태 유지
- [ ] 퀴즈 풀고 점수 저장 확인
- [ ] 스크롤 위치 저장 → 다른 페이지 갔다가 돌아오면 복원
- [ ] `/curriculum`에서 레슨 카드 클릭 → 레슨 페이지 이동
- [ ] `/dashboard`에서 "이어서 학습하기" 카드 동작
- [ ] `/glossary`에서 검색 작동
- [ ] 모바일 뷰 확인
- [ ] 빌드 성공 (`npm run build`)

---

## Phase 3 완료 시 보고 포맷

### 1. 무엇을 만들었나
- 동적 라우트, 페이지, 컴포넌트 완성 목록
- 샘플 레슨 1개 경로

### 2. 어떻게 확인하나
```bash
npm run dev
```
- `/` 랜딩 → 히어로 CTA 클릭하면 레슨 페이지로 이동 확인
- `/curriculum` → 커리큘럼 전체 지도
- `/lessons/0/what-is-photoshop` → 샘플 레슨
- `/dashboard` → 진도 현황
- `/glossary` → 용어 사전

### 3. Phase 4 시작 전 마스터가 할 일
- 샘플 레슨을 보고 MDX 템플릿이 마음에 드는지 확인
- 컴포넌트 디자인에 수정 요청이 있는지 전달
- Phase 4에서 작성할 레슨 우선순위 결정 (Level 0부터 순서대로 진행 권장)

---

## 주의 사항

- **MDX 컴포넌트 props를 임의로 바꾸지 말 것.** `docs/components.md`에 정의된 대로만.
- **레슨 콘텐츠를 채우지 말 것.** 샘플 1개 외에는 Phase 4.
- **빌드 에러를 남기지 말 것.** 모든 경로가 정적 생성되어야 한다.
- 커밋 메시지 제안: `feat(phase-3): lesson infrastructure with MDX, routes, and dashboard`
