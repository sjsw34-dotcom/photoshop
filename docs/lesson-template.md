# docs/lesson-template.md — 레슨 MDX 표준 템플릿

> 모든 레슨(.mdx)은 이 구조를 **반드시** 따른다. 순서와 섹션 이름을 임의로 바꾸지 않는다. **이 파일은 레슨 콘텐츠를 작성할 때 참조한다.**

---

## 1. 파일 위치

```
content/lessons/{level-folder}/{order}-{slug}.mdx
```

예시:
- `content/lessons/00-intro/01-what-is-photoshop.mdx`
- `content/lessons/01-beginner/11-layer-concept.mdx`

---

## 2. frontmatter (필수 필드)

```yaml
---
title: "포토샵이 뭐고 왜 쓰나요"
level: 0
order: 1
duration: 40
slug: "what-is-photoshop"
prerequisites: []
objectives:
  - "포토샵이 어떤 프로그램인지 한 문장으로 설명할 수 있다"
  - "어떤 작업에 포토샵이 쓰이는지 3가지 예시를 들 수 있다"
keyTerms: ["래스터", "픽셀"]
practiceFile: null
hasPractice: true
---
```

**필드 설명**:
- `level`: 0(입문) / 1(초급) / 2(중급) / 3(고급)
- `order`: 1-80 (전체 순서)
- `duration`: 분 단위 예상 학습 시간
- `slug`: URL에 쓰일 이름 (영소문자+하이픈)
- `prerequisites`: 선행 레슨 slug 배열. 없으면 `[]`
- `objectives`: 3개 이내. 동사형으로 끝내기
- `keyTerms`: 용어 사전과 자동 연결. 배열
- `practiceFile`: 다운로드할 연습 파일 경로. 없으면 `null`
- `hasPractice`: **필수. 항상 `true`.** 모든 레슨은 실습 업로드 섹션을 가진다. 대시보드 갤러리 슬롯 렌더링에 사용됨.

---

## 3. 본문 구조 (순서 고정)

반드시 이 순서를 지킨다. 섹션 제목 이모지도 고정.

### 3.1 전체 구조

```mdx
## 🎯 오늘의 목표

(1-2줄로 "이 레슨이 끝나면 뭘 할 수 있는지" 제시)

## 🍎 일상 비유로 먼저 이해하기

(첫 개념은 반드시 일상 비유. 300자 이내. 
 비유 → "실제로는 이것을 OOO(정식명칭)이라고 부릅니다" 연결)

## 📖 핵심 개념

(본격 설명. 중간중간 핵심 용어는 **굵게** + 괄호 병기.
 목록, 표, Callout 활용)

## 🖱️ 따라하기

<StepGuide>
  <Step number={1} title="포토샵을 켭니다">
    바탕화면에서 파란색 **Ps** 아이콘을 두 번 클릭하세요.
    <Screenshot 
      src="/screenshots/01/step-1.png" 
      alt="바탕화면에 있는 포토샵 아이콘을 클릭하는 모습" 
    />
    <TroubleShoot>
      아이콘이 안 보이면? 시작 메뉴에서 "Photoshop"을 검색해보세요.
    </TroubleShoot>
  </Step>
  
  <Step number={2} title="새 문서를 만듭니다">
    상단 메뉴에서 **파일 > 새로 만들기**를 클릭합니다. 
    또는 단축키 **Ctrl+N (Mac: Cmd+N)**을 눌러도 됩니다.
    <Screenshot src="/screenshots/01/step-2.png" alt="파일 메뉴에서 새로 만들기 선택" />
  </Step>
</StepGuide>

## ✅ 오늘의 체크리스트

<Checklist lessonSlug="what-is-photoshop">
  - 포토샵을 스스로 켤 수 있다
  - 새 문서를 원하는 크기로 만들 수 있다
  - 저장 대화상자를 열 수 있다
</Checklist>

## 🧠 이해도 퀴즈

<Quiz lessonSlug="what-is-photoshop">
  <Question id="q1">
    Q. 포토샵에서 "레이어"를 가장 잘 비유한 것은?
    
    - [ ] 책의 페이지
    - [x] 투명한 셀로판지 여러 장을 겹친 것
    - [ ] 컴퓨터 폴더
    - [ ] 사진 앨범
    
    해설: 레이어는 위아래로 쌓이면서 서로 비쳐 보입니다. 
    책 페이지는 한 번에 한 장만 보이기에 적절하지 않아요.
  </Question>
  
  <Question id="q2">
    ...
  </Question>
  
  <Question id="q3">
    ...
  </Question>
</Quiz>

## 🎨 오늘의 실습

(5-15분 분량. 제공된 연습 파일이나 본인 사진을 활용해 결과를 만들고 업로드)

<PracticeCompare
  lessonSlug="what-is-photoshop"
  goal="한 문장으로 '무엇을 만들어 올려야 하는지' 학습자가 바로 이해할 수 있게 적기"
  startHint="학습자가 어떤 사진을 골라야 하는지 한 줄 힌트. 예: '배경이 복잡한 인물 사진 한 장'"
  checklist={[
    "눈으로 확인 가능한 점검 항목 1",
    "눈으로 확인 가능한 점검 항목 2",
    "눈으로 확인 가능한 점검 항목 3"
  ]}
/>

> 이미지는 학습자가 직접 올려요. 왼쪽 "시작 사진" + 오른쪽 "내 결과" 두 슬롯으로 구성되며 둘 다 올리면 드래그 슬라이더가 자동으로 나타나요.

## 🔑 꼭 기억할 단축키

<KeyboardShortcut keys={["Ctrl", "N"]} mac={["Cmd", "N"]} description="새 문서" />
<KeyboardShortcut keys={["Ctrl", "S"]} mac={["Cmd", "S"]} description="저장" />

## 😵 이게 안 돼요 (자주 묻는 문제)

- **Q**: 메뉴가 영어로 나와요.
  **A**: **편집 > 환경설정 > 인터페이스 > 언어**에서 한국어로 변경 후 재시작.

- **Q**: 새 문서 창에 한글이 깨져 보여요.
  **A**: (해결책)

## 🧭 다음 레슨

<NextLessonCard />
```

---

## 4. 섹션 작성 세부 가이드

### 4.1 🎯 오늘의 목표
- 1-2줄
- "~을 할 수 있게 됩니다" 형태로 끝내기

### 4.2 🍎 일상 비유로 먼저 이해하기
- 필수 섹션. 건너뛰지 않는다.
- 비유 → 실제 연결 → 정식 명칭 순서
- 300자 이내
- 비유 예시 라이브러리는 `docs/writing-style.md` Section 3.3 참조

### 4.3 📖 핵심 개념
- 본격 설명 구간
- 긴 문장 금지 (50자 이내)
- 전문 용어 첫 등장 시 괄호 병기
- 필요 시 `<Callout>`으로 주의/팁 강조

### 4.4 🖱️ 따라하기
- 가장 중요한 섹션
- `<StepGuide>` 안에 `<Step>` 배치
- 각 Step은 한 가지 동작만
- Step당 스크린샷 1장 필수
- 막힐 만한 곳엔 `<TroubleShoot>` 블록

### 4.5 ✅ 체크리스트
- 3-5개 항목
- 각 항목은 동작 가능한 결과물
- `lessonSlug` prop 필수 (진도 저장용)

### 4.6 🧠 퀴즈
- 3문제
- 4지선다 정답 1개
- 해설에 오답 설명 포함
- `lessonSlug` prop 필수

### 4.7 🎨 실습 (필수 · 예외 없음)
- 5-15분 분량
- **모든 레슨은 `<PracticeCompare>` 블록으로 마감한다.** 학습자가 본인 사진으로 '시작 vs 내 결과'를 비교하는 것이 증거.
- **마스터는 이미지를 제공하지 않는다.** 학습자가 직접 올리는 두 장(시작/결과)만 사용.
- `goal`: 한 문장으로 무엇을 만들 건지
- `startHint`: 어떤 사진을 고르면 좋은지 1줄 힌트 (선택)
- `checklist`: 3-4개, 눈으로 확인 가능한 조건
- 학습자가 아직 못 할 상황이면 "지금 말고, 나중에" 버튼으로 건너뛸 수 있음. 대시보드에서 "대기 중"으로 리마인드됨.
- 개념만 다루는 레슨(예: "레이어 개념")도 "네 사진 한 장과, 거기에 뭘 더 얹고 싶은지 표시한 이미지" 식으로 실습 섹션을 반드시 만든다.

### 4.8 🔑 단축키
- 레슨에서 나왔던 핵심 단축키만
- 3-5개 이내

### 4.9 😵 자주 묻는 문제
- 실제로 학생이 막힐 만한 지점 2-4개
- Q/A 형식

---

## 5. 사용 가능한 커스텀 컴포넌트

자세한 스펙은 `docs/components.md` 참조. 간단 요약:

| 컴포넌트 | 용도 |
|---|---|
| `<StepGuide>` / `<Step>` | 번호 단계 가이드 |
| `<Screenshot>` | 클릭 확대 스크린샷 |
| `<KeyboardShortcut>` | 단축키 시각화 |
| `<Checklist>` | 진도 연동 체크리스트 |
| `<Quiz>` / `<Question>` | 퀴즈 블록 |
| `<PracticeFile>` | 연습 파일 다운로드 |
| **`<PracticeCompare>`** | **학습자 업로드 + 비교 슬라이더 (필수)** |
| `<Callout type="tip\|warning\|danger">` | 주의/팁 박스 |
| `<BeforeAfter>` | 비포/애프터 슬라이더 (개념 설명용) |
| `<TroubleShoot>` | 접히는 문제해결 박스 |
| `<NextLessonCard>` | 다음 레슨 링크 |

---

## 6. 스크린샷 파일 관리

### 6.1 폴더 구조
```
public/screenshots/
├── 01-what-is-photoshop/
│   ├── step-1.png
│   ├── step-2.png
│   └── ...
└── 02-install-photoshop/
    └── ...
```

### 6.2 파일 명명 규칙
- `step-{번호}.png` (본문 따라하기 단계)
- `figure-{번호}.png` (개념 설명 보조 이미지)
- `before-after-{번호}.png` (비교 이미지)

### 6.3 초기 빌드에서 placeholder 처리
실제 스크린샷은 나중에 캡처하므로, 초기에는:
- 모든 Screenshot src를 `/screenshots/placeholder.png` 하나로 지정
- **단, alt 텍스트는 "어떤 화면이 들어가야 하는지" 구체적으로 작성** (나중에 교체 작업 가이드 역할)

**좋은 alt 예시**: 
"포토샵 상단 메뉴에서 파일 > 새로 만들기가 선택된 상태. 드롭다운이 펼쳐져 있고 '새로 만들기' 항목에 파란 하이라이트."

**나쁜 alt 예시**: "메뉴 스크린샷"

---

## 7. 작성 시 자가 점검 체크리스트

레슨 MDX를 다 쓴 뒤 이 체크리스트로 검증:

- [ ] frontmatter 모든 필수 필드 채웠나 (**`hasPractice: true` 확인**)
- [ ] 섹션 순서가 템플릿과 일치하나
- [ ] 한 문장이 50자를 넘는 곳이 없나
- [ ] em dash(—)를 쓴 곳이 없나
- [ ] 첫 개념이 일상 비유로 시작하나
- [ ] 전문 용어 첫 등장 시 괄호 병기했나
- [ ] Step마다 스크린샷이 있나 (**꼭 필요한 경우만**. 글로 대체 가능하면 빼기)
- [ ] 퀴즈가 3문제이고 해설이 있나
- [ ] 체크리스트가 3-5개이고 동작 가능한 결과물인가
- [ ] **`<PracticeCompare>` 블록이 있고 `goal` / `checklist`가 채워졌나**
- [ ] duration(분)이 실제 내용량과 맞나 (40-60분 권장)
