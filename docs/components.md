# docs/components.md — 공통 컴포넌트 스펙

> MDX 레슨과 페이지에서 사용하는 커스텀 React 컴포넌트의 props와 동작 명세. **이 파일은 컴포넌트를 구현하거나 레슨에서 사용할 때 참조한다.**

---

## 1. 위치

```
components/
├── lesson/          # 레슨 전용
│   ├── StepGuide.tsx
│   ├── Step.tsx
│   ├── Screenshot.tsx
│   ├── KeyboardShortcut.tsx
│   ├── Checklist.tsx
│   ├── Quiz.tsx
│   ├── Question.tsx
│   ├── PracticeFile.tsx
│   ├── Callout.tsx
│   ├── BeforeAfter.tsx
│   ├── TroubleShoot.tsx
│   └── NextLessonCard.tsx
├── progress/
│   ├── ProgressBar.tsx
│   ├── StreakCounter.tsx
│   └── LessonProgressPill.tsx
└── ui/              # shadcn/ui
```

---

## 2. `<StepGuide>` / `<Step>`

번호가 매겨진 단계별 가이드.

### Props
```typescript
// StepGuide: children만
interface StepGuideProps {
  children: React.ReactNode;
}

// Step
interface StepProps {
  number: number;          // 필수. 단계 번호
  title: string;           // 필수. 단계 제목
  children: React.ReactNode;
}
```

### 동작
- 각 Step은 왼쪽에 번호 원, 오른쪽에 제목 + 본문
- 번호 원은 진행 상태에 따라 색이 바뀜 (선택 사항, Phase 5에서)
- 모바일에서는 번호가 본문 위로 재배치

### 사용 예
```mdx
<StepGuide>
  <Step number={1} title="포토샵 켜기">
    바탕화면의 Ps 아이콘을 더블클릭합니다.
  </Step>
  <Step number={2} title="새 문서 만들기">
    **파일 > 새로 만들기**를 클릭합니다.
  </Step>
</StepGuide>
```

---

## 3. `<Screenshot>`

클릭 시 확대되는 이미지.

### Props
```typescript
interface ScreenshotProps {
  src: string;              // 필수. 이미지 경로
  alt: string;              // 필수. 구체적 alt 텍스트
  caption?: string;         // 선택. 이미지 하단 캡션
  highlight?: {             // 선택. 하이라이트 오버레이
    x: number;              // 0-100 (%)
    y: number;              // 0-100 (%)
    r?: number;             // 반경 (기본 30px)
    label?: string;         // 번호 라벨
  }[];
  zoomable?: boolean;       // 기본 true
}
```

### 동작
- 클릭 시 라이트박스로 확대
- `highlight` 배열이 있으면 빨간 원 오버레이
- 로딩 시 블러 placeholder
- 모바일에선 핀치 줌 지원

### 사용 예
```mdx
<Screenshot 
  src="/screenshots/01/step-2.png"
  alt="파일 메뉴에서 새로 만들기 선택"
  highlight={[
    { x: 15, y: 3, label: "1" },
    { x: 15, y: 10, label: "2" }
  ]}
/>
```

---

## 4. `<KeyboardShortcut>`

단축키를 시각적으로 표시.

### Props
```typescript
interface KeyboardShortcutProps {
  keys: string[];           // 필수. Windows 기준 키 배열
  mac?: string[];           // 선택. Mac 기준 키 배열
  description?: string;     // 선택. 설명
}
```

### 동작
- 각 키를 키보드 모양 박스로 렌더
- OS 자동 감지 (navigator.platform)로 Windows/Mac 자동 전환
- 키 사이는 `+` 연결자

### 사용 예
```mdx
<KeyboardShortcut 
  keys={["Ctrl", "Shift", "N"]} 
  mac={["Cmd", "Shift", "N"]}
  description="새 레이어 만들기"
/>
```

### 렌더 결과 (예시)
```
[Ctrl] + [Shift] + [N]   새 레이어 만들기
```

---

## 5. `<Checklist>`

진도 연동 체크리스트.

### Props
```typescript
interface ChecklistProps {
  lessonSlug: string;       // 필수. 진도 저장 키
  children: React.ReactNode; // 마크다운 리스트
}
```

### 동작
- 각 체크박스 상태가 Zustand `lessons[slug].checklistDone` 배열에 저장
- 모든 항목 체크 시 "다음 레슨으로" 버튼 활성화 (퀴즈도 통과한 경우)
- 재방문 시 체크 상태 유지

### 사용 예
```mdx
<Checklist lessonSlug="what-is-photoshop">
  - 포토샵을 스스로 켤 수 있다
  - 새 문서를 만들 수 있다
  - 저장 대화상자를 열 수 있다
</Checklist>
```

---

## 6. `<Quiz>` / `<Question>`

이해도 확인 퀴즈.

### Props
```typescript
interface QuizProps {
  lessonSlug: string;       // 필수
  passScore?: number;       // 기본 60 (0-100)
  children: React.ReactNode;
}

interface QuestionProps {
  id: string;               // 필수. q1, q2, q3
  children: React.ReactNode; // 마크다운 질문 + 보기 + 해설
}
```

### 동작
- 각 Question은 4지선다 (`- [ ]` 오답, `- [x]` 정답)
- 보기 클릭 시 즉시 정오 피드백
- 오답 시 해설 즉시 표시
- 점수 = (정답 개수 / 전체) × 100
- 점수가 `passScore` 이상이면 레슨 완료 조건 충족
- 재시도 가능

### 질문 파싱 규칙
```mdx
<Question id="q1">
  Q. 질문 본문
  
  - [ ] 오답 1
  - [x] 정답
  - [ ] 오답 2
  - [ ] 오답 3
  
  해설: 해설 본문
</Question>
```

---

## 6.5 `<PracticeCompare>` (필수 실습 컴포넌트)

학습자가 **두 장 모두** 본인 사진으로 올려 '시작 ⟷ 내 결과'를 비교한다. **마스터는 이미지를 제공하지 않는다.** 모든 레슨이 이 컴포넌트로 마감한다.

### Props
```typescript
interface PracticeCompareProps {
  lessonSlug: string;          // 필수. 진도/갤러리 연결 키
  goal: string;                // 필수. 한 문장 실습 목표
  startHint?: string;          // 선택. 어떤 사진을 고르면 좋은지 힌트
  checklist?: string[];        // 선택. 3-4개 자가 점검 항목
}
```

### UI 구성
- 상단 고정 동기부여 배너 ("🌱 이 한 장이 네 포트폴리오가 돼요")
- 좌우 두 슬롯:
  - **1. 시작 사진** — 학습자가 편집할 원본 사진 업로드
  - **2. 내 결과** — 레슨 따라 편집한 결과 업로드
- 각 슬롯: 드래그·드롭 + 파일선택 + 카메라(모바일)
- 두 장 모두 올라오면 아래에 드래그 슬라이더 자동 등장
- 상태 배너 (아래 상태 섹션 참조)
- `checklist` 있으면 자가 점검 UI

### 이미지 처리
- 업로드 시 클라이언트에서 자동 리사이즈 (최대 1600px, JPEG 82%) → IndexedDB에 `{slug}:before` / `{slug}:after` 키로 저장
- 썸네일(320px, JPEG 70%)은 Zustand persist에 저장 → 대시보드 갤러리에서 즉시 표시

### 4가지 상태 (자동 전이)
- `pending`: 아직 아무것도 안 올림 (기본)
- `deferred`: "나중에" 눌러 건너뜀 (둘 다 비었을 때만 가능)
- `partial`: 한 장만 올라와 있음
- `uploaded`: 둘 다 올라와 비교 슬라이더 표시

### 사용 예
```mdx
<PracticeCompare
  lessonSlug="layer-mask-intro"
  goal="네 사진에서 배경만 마스크로 가려 올려보세요"
  startHint="배경이 단순한 인물/풍경 사진이 처음 연습에 좋아요"
  checklist={[
    "시작 사진을 준비했다",
    "배경이 자연스럽게 가려졌다",
    "원본 레이어는 그대로 남아 있다"
  ]}
/>
```

### 접근성 / 모바일
- 카메라 버튼은 `capture="environment"`로 모바일에서 후면 카메라 직접 호출
- 슬라이더는 키보드 좌우 화살표 지원
- 드래그·드롭 영역은 터치에서도 작동

---

## 7. `<PracticeFile>`

연습 파일 다운로드 버튼.

### Props
```typescript
interface PracticeFileProps {
  href: string;             // 필수. .zip 경로
  label?: string;           // 기본 "연습 파일 다운로드"
  sizeHint?: string;        // 선택. "약 2MB"
}
```

### 동작
- 다운로드 버튼 렌더
- 클릭 시 실제 다운로드 트리거
- 다운로드 완료 시 localStorage에 기록 (선택)

---

## 8. `<Callout>`

주의/팁/위험 강조 박스.

### Props
```typescript
interface CalloutProps {
  type: 'tip' | 'warning' | 'danger' | 'info';
  title?: string;
  children: React.ReactNode;
}
```

### 동작
- 타입별 아이콘과 컬러
  - `tip`: 💡 연한 노랑
  - `warning`: ⚠️ 주황
  - `danger`: 🚨 빨강
  - `info`: ℹ️ 파랑
- 좌측에 컬러 바

---

## 9. `<BeforeAfter>`

드래그 슬라이더로 비교.

### Props
```typescript
interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;     // 기본 "Before"
  afterLabel?: string;      // 기본 "After"
}
```

### 동작
- 가로 슬라이더로 두 이미지 비교
- 기본 50:50, 드래그로 조정
- 키보드 화살표로도 조작 가능 (접근성)

---

## 10. `<TroubleShoot>`

접을 수 있는 문제해결 박스.

### Props
```typescript
interface TroubleShootProps {
  title?: string;           // 기본 "이게 안 될 때"
  children: React.ReactNode;
}
```

### 동작
- 기본 접힘 상태
- 클릭 시 펼침
- 아이콘: 🔧 또는 ❓

---

## 11. `<NextLessonCard>`

다음 레슨 링크 카드.

### Props
- 없음. 현재 URL에서 slug를 추출해 자동 계산.

### 동작
- `curriculum.ts`에서 현재 slug의 다음 order를 찾아 링크
- 다음 레슨 제목, 예상 시간, 레벨 표시
- 현재 레슨이 완료되지 않았으면 "이 레슨 완료 후 잠금 해제" 안내

---

## 12. 진도 컴포넌트

### `<ProgressBar>`
```typescript
interface ProgressBarProps {
  current: number;          // 0-100
  label?: string;
  showPercentage?: boolean;
}
```

### `<StreakCounter>`
- Props 없음
- Zustand `streak`을 읽어 🔥 아이콘과 일수 표시
- 7/30/100일 배지 자동 표시

### `<LessonProgressPill>`
```typescript
interface LessonProgressPillProps {
  slug: string;
}
```
- 레슨 카드나 목차에 붙이는 작은 상태 뱃지
- `locked` / `unlocked` / `in_progress` / `completed` 시각화

---

## 13. 구현 우선순위

Phase 1(뼈대):
- `StepGuide`, `Step`
- `Screenshot` (highlight 없는 기본 버전)
- `KeyboardShortcut`
- `Checklist` (진도 연동 포함)
- `Callout`
- `NextLessonCard`

Phase 3(레슨 인프라):
- `Quiz`, `Question`
- `BeforeAfter`
- `TroubleShoot`
- `PracticeFile`
- `Screenshot` highlight 오버레이

Phase 3.5 (실습 기반 학습):
- **`PracticeCompare`** — 모든 레슨 필수
- `PracticeGallery` — 대시보드 갤러리 (내부 컴포넌트)

---

## 14. 스타일 가이드

### 공통
- Tailwind만 사용 (인라인 스타일 금지)
- 다크모드 대응 (`dark:` prefix)
- 모바일 우선 (기본이 모바일, `sm:`, `md:`로 확장)

### 컬러 팔레트
- Primary: `orange-500` (강조, 버튼, 링크)
- Text: `slate-800` (라이트) / `slate-100` (다크)
- Muted: `slate-500`
- Background: `white` / `slate-950`
- Surface: `slate-50` / `slate-900` (카드 배경)
- Success: `emerald-500`
- Warning: `amber-500`
- Danger: `red-500`

### 간격
- 컴포넌트 간 수직 간격: `my-6` 기본
- Step 간 간격: `gap-6`
- 섹션 간 간격: `my-10`

---

## 15. 접근성 체크리스트

모든 컴포넌트 구현 시 확인:
- [ ] 키보드만으로 조작 가능
- [ ] 포커스 링 명확
- [ ] 스크린리더용 aria-label
- [ ] 색 대비 WCAG AA 이상
- [ ] 터치 타깃 최소 44x44px (모바일)
