# Phase 5 — 품질 마감

> **목표**: 접근성, 성능, 문체 일관성을 점검하고 배지/그래프/진도 관리 기능을 완성. 첫 공개 전 최종 다듬기.

> **예상 소요**: 2-3일

> **시작 전 참조 문서**: `CLAUDE.md`, `docs/writing-style.md`, `docs/progress-system.md` (Section 6, 11 Phase 5 부분), `docs/components.md` (Section 15 접근성)

> **선행 조건**: Phase 4 완료 (최소 Level 0 레슨 10개 존재)

---

## 범위 (Scope)

**이 Phase에서 하는 것**:
- 접근성 점검과 수정
- Lighthouse 점수 90+ 달성
- 오탈자/문체 일관성 점검
- 배지 시스템 구현
- 주간 학습 시간 그래프
- 진도 리셋/내보내기 기능
- 설정 페이지

**이 Phase에서 하지 않는 것**:
- Level 1-3 레슨 콘텐츠 (Phase 6)
- AI 도우미 (Phase 6)

---

## 체크리스트

### 5.1 접근성 점검

#### 5.1.1 키보드 탐색
- [ ] 모든 CTA, 링크, 체크박스, 퀴즈 옵션을 Tab만으로 접근 가능
- [ ] 포커스 링이 모든 포커스 가능 요소에서 명확히 보임
- [ ] Shift+Tab으로 역방향 이동 가능
- [ ] 모달(라이트박스, 퀴즈 해설)에서 Focus Trap 적용
- [ ] Esc로 모달 닫기 가능

#### 5.1.2 스크린 리더 지원
- [ ] 모든 이미지에 의미 있는 alt (placeholder alt도 구체적인지 확인)
- [ ] 아이콘 전용 버튼에 aria-label
- [ ] 체크리스트, 퀴즈, 스텝 가이드의 상태가 aria-로 전달되는지
- [ ] 랜드마크 태그 (`<header>`, `<main>`, `<nav>`, `<footer>`) 누락 없는지

#### 5.1.3 색 대비
- [ ] 본문 텍스트 대비 4.5:1 이상 (WCAG AA)
- [ ] 큰 텍스트 3:1 이상
- [ ] 다크 모드, 라이트 모드 양쪽 확인
- [ ] Chrome DevTools의 Lighthouse Accessibility 항목으로 검증

#### 5.1.4 모션 민감성
- [ ] `@media (prefers-reduced-motion: reduce)` 존중
- [ ] 스크롤 애니메이션, 페이지 전환에서 감소 모드 적용

### 5.2 성능 최적화

#### 5.2.1 이미지
- [ ] 모든 `<img>` 대신 `next/image` 사용
- [ ] 스크린샷을 WebP로 변환 (placeholder도)
- [ ] `priority` 속성을 히어로 이미지에만 적용
- [ ] `sizes` 속성으로 반응형 크기 지정

#### 5.2.2 폰트
- [ ] Pretendard는 variable 사용, subset 로딩
- [ ] font-display: swap 적용
- [ ] 폰트 preload (히어로에 사용되는 웨이트만)

#### 5.2.3 번들 크기
- [ ] `npm run build` 후 번들 분석
- [ ] 사용하지 않는 shadcn 컴포넌트 제거
- [ ] 아이콘은 필요한 것만 개별 import (lucide-react 전체 import 금지)

#### 5.2.4 Lighthouse 점수
- [ ] Performance 90+
- [ ] Accessibility 95+
- [ ] Best Practices 95+
- [ ] SEO 95+

### 5.3 문체와 일관성 점검

#### 5.3.1 자동 검사
- [ ] em dash 검사: `grep -rn " — " app/ components/ content/` 결과 0건
- [ ] 긴 문장 탐지: 스크립트로 한 문장 50자 초과 지점 리스트업
- [ ] 금지 표현 검사: "~는 알겠죠", "뻔하지만", "당연히" 등 무시하는 표현

#### 5.3.2 수동 점검
- [ ] 모든 레슨 정독 (Level 0 10개)
- [ ] 톤 일관성: 존댓말 혼용 여부
- [ ] 비유 과잉: 한 레슨에 비유가 3개 이상이면 축소
- [ ] 전문 용어 첫 등장 시 괄호 병기 확인

#### 5.3.3 오탈자
- [ ] 맞춤법 검사 도구(부산대 맞춤법 검사기 등) 활용
- [ ] 띄어쓰기 일관성 (예: "포토샵" vs "포토 샵")

### 5.4 배지 시스템

`docs/progress-system.md` Section 6 참조.

#### 5.4.1 배지 정의
- [ ] `lib/badges.ts`에 배지 목록 정의
  ```typescript
  export const BADGES = [
    { id: 'streak-7', name: '일주일 꾸준러', emoji: '🔥', condition: (s) => s.streak >= 7 },
    { id: 'streak-30', name: '한 달 완주자', emoji: '🔥🔥', condition: (s) => s.streak >= 30 },
    { id: 'streak-100', name: '100일의 전설', emoji: '🔥🔥🔥', condition: (s) => s.streak >= 100 },
    { id: 'level-0', name: '첫 걸음', emoji: '🐣', condition: (s) => getLevelProgress(s, 0) === 100 },
    // ... (레벨 1-3, 10시간/50시간 클럽)
  ];
  ```

#### 5.4.2 배지 획득 판정
- [ ] Zustand에 `earnedBadges: string[]` 필드 추가
- [ ] 진도 액션 후마다 배지 조건 재검사
- [ ] 새 배지 획득 시 토스트 알림 (shadcn Sonner 또는 자체)

#### 5.4.3 배지 표시
- [ ] 대시보드에 배지 갤러리 섹션
- [ ] 획득한 배지: 컬러 + 호버 시 상세
- [ ] 미획득 배지: 흑백 + 획득 조건 표시
- [ ] 배지 획득 시 모달 애니메이션 (reduced-motion 존중)

### 5.5 주간 학습 시간 그래프

#### 5.5.1 데이터 수집
- [ ] Zustand에 `dailyMinutes: Record<string, number>` 필드 추가 (`YYYY-MM-DD` 키)
- [ ] 학습 시간 측정 시 해당 날짜에 누적

#### 5.5.2 그래프 렌더링
- [ ] 대시보드에 지난 7일 막대 그래프
- [ ] Recharts 또는 직접 SVG (번들 크기 고려)
- [ ] 막대 위에 분 단위 라벨
- [ ] 오늘 날짜 강조 색

### 5.6 설정 페이지 (`app/settings/page.tsx`)

#### 5.6.1 기본 구성
- [ ] 섹션: 테마, 진도 관리, 데이터 내보내기, 피드백

#### 5.6.2 테마
- [ ] 라이트/다크/시스템 선택 라디오

#### 5.6.3 진도 리셋
- [ ] "모든 진도 초기화" 버튼
- [ ] 2단계 확인 다이얼로그
  - 1단계: "정말 초기화하시겠어요?"
  - 2단계: "RESET" 텍스트 입력 확인
- [ ] 성공 시 `localStorage.removeItem('photoshop-academy-progress')` + 페이지 새로고침

#### 5.6.4 데이터 내보내기
- [ ] "진도 JSON 다운로드" 버튼
- [ ] Zustand 상태를 `.json` 파일로 다운로드
- [ ] 파일명: `photoshop-academy-progress-YYYY-MM-DD.json`

#### 5.6.5 데이터 가져오기
- [ ] 파일 업로드 input
- [ ] JSON 파싱 + 버전/스키마 검증
- [ ] 유효하면 Zustand 상태 덮어쓰기
- [ ] 실패 시 에러 메시지

#### 5.6.6 피드백
- [ ] 간단한 피드백 폼 (또는 이메일 링크)

### 5.7 SEO와 메타데이터

#### 5.7.1 페이지별 메타
- [ ] 각 페이지 `generateMetadata` 구현
- [ ] 레슨 페이지: frontmatter의 title, description, objectives를 활용

#### 5.7.2 Open Graph
- [ ] 기본 OG 이미지 (`public/og.png`) 생성
- [ ] 레슨별 동적 OG 이미지는 선택 (Next의 `opengraph-image.tsx`)

#### 5.7.3 robots.txt / sitemap.xml
- [ ] `app/robots.ts`로 기본 설정
- [ ] `app/sitemap.ts`로 레슨 포함 사이트맵 자동 생성

### 5.8 에러 처리

#### 5.8.1 404 페이지
- [ ] `app/not-found.tsx` 커스텀: 친근한 메시지 + 홈 링크

#### 5.8.2 에러 바운더리
- [ ] `app/error.tsx`: 사용자에게 친절한 에러 메시지 + 다시 시도 버튼

#### 5.8.3 비어있는 상태
- [ ] 진도가 전혀 없을 때의 대시보드
- [ ] 검색 결과 없을 때의 용어 사전
- [ ] 모두 친근한 카피로

### 5.9 모바일 최종 점검

- [ ] iPhone SE (375px) 가로 스크롤 없는지
- [ ] 터치 타깃 44x44px 이상
- [ ] 가로 모드(landscape) 깨짐 여부
- [ ] 아이폰 Safari, 안드로이드 Chrome 실기기 테스트

### 5.10 최종 검증

- [ ] `npm run build` 성공
- [ ] `npm run start`로 프로덕션 모드 확인
- [ ] Vercel 프리뷰 배포 → 실기기 접속 확인
- [ ] Lighthouse 모바일/데스크톱 양쪽 90+

---

## Phase 5 완료 시 보고 포맷

### 1. 무엇을 만들었나
- 배지 시스템, 주간 그래프, 설정 페이지 등 신규 기능 목록
- Lighthouse 점수 4개 항목

### 2. 어떻게 확인하나
```bash
npm run build && npm run start
```
- `/dashboard`에서 배지 갤러리, 주간 그래프 확인
- `/settings`에서 리셋/내보내기/가져오기 작동
- Chrome DevTools Lighthouse 실행
- 키보드만으로 전체 사이트 탐색 시도

### 3. Phase 6 시작 전 마스터가 할 일
- 실기기(iPhone/안드로이드)에서 직접 테스트
- 아들에게 Level 0 10개 레슨을 먼저 학습시켜볼지 결정
- Phase 6에서 어느 기능을 우선 추가할지 선택:
  - Level 1-3 레슨 작성
  - AI 도우미
  - 커뮤니티 게시판

---

## 주의 사항

- **"완벽한 디자인"에 매몰되지 말 것.** 기능이 작동하고 접근성이 확보되면 충분. 폴리싱은 사용자 피드백 후로.
- **새 기능을 추가하지 말 것.** Phase 5는 마감 Phase다. 기능 추가 욕구가 생기면 Phase 6로 미룬다.
- **Lighthouse 90+를 위해 기능을 희생하지 말 것.** 점수가 안 나오면 원인을 파악하고, 기능이 꼭 필요한 거라면 90 미만도 받아들인다.
- 커밋 메시지 제안: `chore(phase-5): accessibility, performance, and polish for launch`
