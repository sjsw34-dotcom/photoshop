# docs/progress-system.md — 진도 추적 시스템

> Zustand + localStorage 기반 진도 추적. 로그인 없이 작동. **이 파일은 `lib/store.ts`와 관련 훅, 대시보드를 구현할 때 참조한다.**

---

## 1. 설계 원칙

1. **로그인 없이 작동.** 학습자 진입장벽 0.
2. **브라우저 로컬에 저장.** 서버 DB 불필요.
3. **한 번의 클릭으로 이어가기.** "최근 학습 레슨"에서 정확한 위치로 복귀.
4. **작은 성취를 눈에 보이게.** 스트릭, 배지, 진행률 바.

---

## 2. 타입 정의

`lib/store.ts`에 전체 타입.

```typescript
type LessonStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

interface LessonProgress {
  status: LessonStatus;
  checklistDone: string[];           // 체크된 항목 id들
  quizScore: number | null;          // 0-100, null이면 미응시
  quizAttempts: number;              // 시도 횟수
  completedAt: string | null;        // ISO 8601
  lastVisitedAt: string | null;      // ISO 8601
  timeSpentMin: number;              // 누적 분
  scrollPosition: number;            // 이어보기용 스크롤 px
}

interface ProgressState {
  // 레슨별 상태
  lessons: Record<string, LessonProgress>;
  
  // 전체 통계
  streak: number;                    // 연속 학습일
  lastStudyDate: string | null;      // YYYY-MM-DD
  totalMinutes: number;
  longestStreak: number;
  
  // 현재 위치
  currentLevel: 0 | 1 | 2 | 3;
  lastLessonSlug: string | null;     // "이어서 학습하기" 타깃
  
  // 액션
  initLesson: (slug: string) => void;
  markInProgress: (slug: string) => void;
  updateChecklist: (slug: string, itemId: string, checked: boolean) => void;
  saveQuizScore: (slug: string, score: number) => void;
  completeLesson: (slug: string) => void;
  addStudyTime: (slug: string, minutes: number) => void;
  saveScrollPosition: (slug: string, px: number) => void;
  
  // 계산된 값 (selector)
  isLessonUnlocked: (slug: string) => boolean;
  getLessonStatus: (slug: string) => LessonStatus;
  getLevelProgress: (level: 0 | 1 | 2 | 3) => number; // 0-100
  getOverallProgress: () => number;
}
```

---

## 3. Zustand + persist 구현

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      streak: 0,
      lastStudyDate: null,
      totalMinutes: 0,
      longestStreak: 0,
      currentLevel: 0,
      lastLessonSlug: null,
      
      initLesson: (slug) => {
        // ...
      },
      
      // (나머지 액션들)
    }),
    {
      name: 'photoshop-academy-progress',
      version: 1,
    }
  )
);
```

---

## 4. 잠금 해제 규칙

### 4.1 레벨 간
- Level 0: 처음부터 모든 레슨 잠금 해제
- Level 1: Level 0의 마지막 실습 프로젝트(#10) 완료 시 해제
- Level 2: Level 1의 마지막 실습(#35) 완료 시 해제
- Level 3: Level 2의 마지막 실습(#60) 완료 시 해제

### 4.2 레벨 내 순차
- 각 레벨 내에서 레슨은 순서대로 잠금 해제
- 예외: 사용자가 "이 레슨 잠금 해제하기" 버튼으로 강제 해제 가능 (Level 2 이상에서만, 체크리스트로 경고)

### 4.3 완료 조건
레슨이 `completed` 상태가 되려면 **모두 충족**:
- 체크리스트 100% 체크
- 퀴즈 점수 `passScore` 이상 (기본 60)

---

## 5. 스트릭 계산 로직

### 5.1 규칙
- 하루에 1개 레슨이라도 `in_progress` 이상 진행하면 오늘 학습한 것으로 간주
- 오늘 날짜 `YYYY-MM-DD`가 `lastStudyDate`와 다르면:
  - 어제 학습했으면 `streak++`
  - 하루 이상 건너뛰었으면 `streak = 1`로 리셋
- `longestStreak`는 `max(longestStreak, streak)`로 갱신

### 5.2 구현 헬퍼
```typescript
function updateStreak(state: ProgressState): Partial<ProgressState> {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastStudyDate === today) {
    return {}; // 이미 오늘 학습 기록됨
  }
  
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString().slice(0, 10);
  
  const newStreak = state.lastStudyDate === yesterday
    ? state.streak + 1
    : 1;
    
  return {
    streak: newStreak,
    lastStudyDate: today,
    longestStreak: Math.max(state.longestStreak, newStreak),
  };
}
```

---

## 6. 배지 시스템

### 6.1 스트릭 배지
- 🔥 7일: "일주일 꾸준러"
- 🔥🔥 30일: "한 달 완주자"
- 🔥🔥🔥 100일: "100일의 전설"

### 6.2 레벨 완료 배지
- Level 0 완료: "첫 걸음 🐣"
- Level 1 완료: "기초 탄탄 🌱"
- Level 2 완료: "실무 입문 🌿"
- Level 3 완료: "포토샵 마스터 🌳"

### 6.3 기타 마일스톤
- 누적 10시간 학습: "10시간 클럽"
- 누적 50시간 학습: "50시간 클럽"
- 퀴즈 만점 10개: "퀴즈 장인"

---

## 7. 대시보드 (app/dashboard/page.tsx)

### 7.1 구성
1. **헤더**: 인사말 + 오늘 날짜 + 🔥 스트릭
2. **이어서 학습하기 카드** (크게): 가장 최근 in_progress 레슨. 없으면 다음 잠금 해제된 레슨
3. **전체 진행률**: 4개 레벨별 프로그레스 바
4. **이번 주 학습 시간**: 막대 그래프 (선택, Phase 5)
5. **획득한 배지**: 획득한 것만 컬러, 아직 못 얻은 건 흑백
6. **최근 활동**: 완료한 레슨 5개 타임라인

### 7.2 "이어서 학습하기" 카드
```
📍 이어서 학습하기
Level 1 · 레슨 14
"레이어 그룹으로 정리하기"
├── 체크리스트 2/4 완료
└── 퀴즈 미응시
[계속하기 →]
```
클릭 시 해당 레슨 페이지로 이동 + 저장된 `scrollPosition`으로 자동 스크롤.

---

## 8. 스크롤 위치 복원

### 8.1 저장
레슨 페이지에서 스크롤 이벤트를 디바운스(500ms)해서 저장:
```typescript
useEffect(() => {
  let timer: NodeJS.Timeout;
  const onScroll = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      saveScrollPosition(slug, window.scrollY);
    }, 500);
  };
  window.addEventListener('scroll', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
    clearTimeout(timer);
  };
}, [slug]);
```

### 8.2 복원
레슨 페이지 진입 시, 쿼리 파라미터 `?resume=1` 있으면 저장된 위치로 스크롤:
```typescript
useEffect(() => {
  if (searchParams.get('resume') === '1') {
    const y = lessons[slug]?.scrollPosition ?? 0;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}, []);
```

---

## 9. 학습 시간 측정

### 9.1 측정 방법
- 레슨 페이지가 포커스 상태일 때만 카운팅
- 1분 간격 타이머
- 탭 비활성화 / 페이지 이탈 시 일시정지
- `document.visibilitychange` 이벤트로 제어

### 9.2 구현
```typescript
useEffect(() => {
  let seconds = 0;
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      seconds += 10;
      if (seconds >= 60) {
        addStudyTime(slug, 1);
        seconds = 0;
      }
    }
  }, 10000); // 10초마다 체크
  return () => clearInterval(interval);
}, [slug]);
```

---

## 10. 초기화와 내보내기 (고급)

### 10.1 진도 리셋
설정 페이지에서 "모든 진도 초기화" 버튼 제공 (확인 다이얼로그 2회).

### 10.2 진도 내보내기/가져오기 (Phase 6)
- JSON으로 다운로드
- 다른 기기에서 업로드해서 동기화 (수동)

---

## 11. 구현 우선순위

Phase 1에서 필요한 최소 구현:
- 기본 타입과 `useProgress` 스토어
- `initLesson`, `markInProgress`, `updateChecklist`, `completeLesson` 액션
- 스트릭 기본 로직
- `isLessonUnlocked` 셀렉터

Phase 3에서 추가:
- 스크롤 위치 저장/복원
- 학습 시간 측정
- 대시보드 페이지

Phase 5에서 마감:
- 배지 시스템
- 주간 그래프
- 리셋/내보내기 기능
