import type { LevelId } from "@/lib/constants";

export interface LessonMeta {
  slug: string;
  title: string;
  level: LevelId;
  order: number;
  duration: number;
  folder: string;
  isProject?: boolean;
  hasPractice?: boolean;
  groupLabel?: string;
}

export interface LevelSection {
  level: LevelId;
  name: string;
  tagline: string;
  emoji: string;
  graduation: string;
  estimatedWeeks: string;
  groups: LessonGroup[];
}

export interface LessonGroup {
  name: string;
  lessons: LessonMeta[];
}

const L0 = "00-intro";
const L1 = "01-beginner";
const L2 = "02-intermediate";
const L3 = "03-advanced";

const lesson = (
  m: Omit<LessonMeta, "folder"> & { folder?: string; },
): LessonMeta => ({
  ...m,
  folder: m.folder ?? (m.level === 0 ? L0 : m.level === 1 ? L1 : m.level === 2 ? L2 : L3),
});

export const LEVEL_SECTIONS: LevelSection[] = [
  {
    level: 0,
    name: "Level 0 · 입문",
    tagline: "포토샵과 첫인사",
    emoji: "🐣",
    graduation: "사진 한 장을 불러와 크기를 바꾸고 저장할 수 있다",
    estimatedWeeks: "약 2주",
    groups: [
      {
        name: "처음 만나기",
        lessons: [
          lesson({ slug: "what-is-photoshop", title: "포토샵이 뭐고 왜 쓰나요", level: 0, order: 1, duration: 40 }),
          lesson({ slug: "install-photoshop", title: "포토샵 설치하고 처음 켜기", level: 0, order: 2, duration: 50 }),
          lesson({ slug: "interface-tour", title: "포토샵 화면 구조 둘러보기", level: 0, order: 3, duration: 45 }),
          lesson({ slug: "mouse-keyboard-basics", title: "마우스와 키보드 기본 조작", level: 0, order: 4, duration: 40 }),
          lesson({ slug: "new-document", title: "새 문서 만들기 (도화지 준비하기)", level: 0, order: 5, duration: 50 }),
          lesson({ slug: "open-files", title: "이미지 파일 열기와 가져오기", level: 0, order: 6, duration: 45 }),
          lesson({ slug: "zoom-pan", title: "화면 확대, 축소, 이동", level: 0, order: 7, duration: 40 }),
          lesson({ slug: "undo-history", title: "실행취소와 히스토리 패널", level: 0, order: 8, duration: 40 }),
          lesson({ slug: "save-formats", title: "저장하기 (PSD, JPG, PNG 차이)", level: 0, order: 9, duration: 50 }),
          lesson({ slug: "project-0-instagram-square", title: "[실습] 내 사진을 SNS용 정사각형으로", level: 0, order: 10, duration: 60, isProject: true }),
        ],
      },
    ],
  },
  {
    level: 1,
    name: "Level 1 · 초급",
    tagline: "기본기 다지기",
    emoji: "🌱",
    graduation: "레이어를 자유롭게 다루고 간단한 합성과 보정을 할 수 있다",
    estimatedWeeks: "약 5주",
    groups: [
      {
        name: "레이어의 세계",
        lessons: [
          lesson({ slug: "layer-concept", title: "레이어 개념 (셀로판지 이야기)", level: 1, order: 11, duration: 45 }),
          lesson({ slug: "layer-create-delete", title: "레이어 만들기, 삭제하기, 복제하기", level: 1, order: 12, duration: 50 }),
          lesson({ slug: "layer-order", title: "레이어 순서 바꾸기와 그 의미", level: 1, order: 13, duration: 45 }),
          lesson({ slug: "layer-group", title: "레이어 그룹으로 정리하기", level: 1, order: 14, duration: 45 }),
          lesson({ slug: "layer-opacity-fill", title: "불투명도와 채우기 차이", level: 1, order: 15, duration: 50 }),
        ],
      },
      {
        name: "선택 영역 마스터",
        lessons: [
          lesson({ slug: "selection-rect-oval", title: "사각형과 원형 선택", level: 1, order: 16, duration: 45 }),
          lesson({ slug: "selection-lasso", title: "올가미로 자유롭게 선택", level: 1, order: 17, duration: 50 }),
          lesson({ slug: "selection-magic-wand", title: "마술봉과 빠른 선택", level: 1, order: 18, duration: 55 }),
          lesson({ slug: "selection-modify", title: "선택 영역 가다듬기 (페더, 확장)", level: 1, order: 19, duration: 50 }),
        ],
      },
      {
        name: "이동과 변형",
        lessons: [
          lesson({ slug: "move-align", title: "이동 도구와 정렬", level: 1, order: 20, duration: 45 }),
          lesson({ slug: "free-transform", title: "자유변형 (Ctrl+T의 모든 것)", level: 1, order: 21, duration: 55 }),
          lesson({ slug: "warp-perspective", title: "뒤틀기와 원근 변형", level: 1, order: 22, duration: 50 }),
        ],
      },
      {
        name: "색과 그라디언트",
        lessons: [
          lesson({ slug: "foreground-background-color", title: "전경색과 배경색", level: 1, order: 23, duration: 40 }),
          lesson({ slug: "paint-bucket-fill", title: "페인트통과 색 채우기", level: 1, order: 24, duration: 45 }),
          lesson({ slug: "gradient-basics", title: "그라디언트 기초", level: 1, order: 25, duration: 55 }),
        ],
      },
      {
        name: "브러시의 기본",
        lessons: [
          lesson({ slug: "brush-size-hardness", title: "브러시 크기와 경도", level: 1, order: 26, duration: 45 }),
          lesson({ slug: "brush-opacity-flow", title: "불투명도와 흐름의 차이", level: 1, order: 27, duration: 50 }),
          lesson({ slug: "brush-presets", title: "브러시 프리셋 활용", level: 1, order: 28, duration: 45 }),
        ],
      },
      {
        name: "지우개와 마스크 입문",
        lessons: [
          lesson({ slug: "eraser-basics", title: "지우개 도구 기본", level: 1, order: 29, duration: 40 }),
          lesson({ slug: "layer-mask-intro", title: "레이어 마스크 첫걸음", level: 1, order: 30, duration: 55 }),
          lesson({ slug: "mask-vs-eraser", title: "왜 지우개보다 마스크가 좋은가", level: 1, order: 31, duration: 45 }),
        ],
      },
      {
        name: "텍스트 기초",
        lessons: [
          lesson({ slug: "text-tool-basics", title: "텍스트 도구 기본", level: 1, order: 32, duration: 50 }),
          lesson({ slug: "korean-fonts", title: "한글 폰트 다루기 (주의점 포함)", level: 1, order: 33, duration: 50 }),
          lesson({ slug: "text-styling", title: "자간, 행간, 정렬", level: 1, order: 34, duration: 45 }),
        ],
      },
      {
        name: "레벨 1 실습",
        lessons: [
          lesson({ slug: "project-1-birthday-card", title: "[실습] 친구 생일 축하 카드 만들기", level: 1, order: 35, duration: 75, isProject: true }),
        ],
      },
    ],
  },
  {
    level: 2,
    name: "Level 2 · 중급",
    tagline: "현장에서 쓰는 흐름",
    emoji: "🌿",
    graduation: "실무 디자인 과제를 독립적으로 완성한다",
    estimatedWeeks: "약 5주",
    groups: [
      {
        name: "마스크 심화",
        lessons: [
          lesson({ slug: "mask-edit-deep", title: "레이어 마스크 편집 심화", level: 2, order: 36, duration: 55 }),
          lesson({ slug: "vector-mask", title: "벡터 마스크 (깔끔한 경계)", level: 2, order: 37, duration: 50 }),
          lesson({ slug: "clipping-mask", title: "클리핑 마스크 (쿠키 틀 원리)", level: 2, order: 38, duration: 55 }),
          lesson({ slug: "mask-gradient", title: "그라디언트 마스크로 자연스러운 합성", level: 2, order: 39, duration: 55 }),
          lesson({ slug: "mask-practice", title: "마스크 실전 연습", level: 2, order: 40, duration: 60 }),
        ],
      },
      {
        name: "조정 레이어",
        lessons: [
          lesson({ slug: "adjustment-layer-intro", title: "조정 레이어란 (원본 안 건드리는 보정)", level: 2, order: 41, duration: 50 }),
          lesson({ slug: "levels-curves", title: "레벨과 커브 (밝기의 핵심)", level: 2, order: 42, duration: 60 }),
          lesson({ slug: "hue-saturation", title: "색조, 채도, 명도 조절", level: 2, order: 43, duration: 55 }),
        ],
      },
      {
        name: "혼합 모드",
        lessons: [
          lesson({ slug: "blend-mode-basics", title: "혼합 모드 기초 (Multiply, Screen)", level: 2, order: 44, duration: 55 }),
          lesson({ slug: "blend-mode-overlay", title: "오버레이 계열 (Overlay, Soft Light)", level: 2, order: 45, duration: 55 }),
          lesson({ slug: "blend-mode-practical", title: "실전에서 쓰는 혼합 모드 패턴", level: 2, order: 46, duration: 60 }),
        ],
      },
      {
        name: "레이어 스타일",
        lessons: [
          lesson({ slug: "layer-style-basics", title: "레이어 스타일 기초", level: 2, order: 47, duration: 50 }),
          lesson({ slug: "layer-style-shadow-stroke", title: "그림자와 외곽선", level: 2, order: 48, duration: 55 }),
          lesson({ slug: "layer-style-tasteful", title: "고급스럽게 쓰는 레이어 스타일", level: 2, order: 49, duration: 50 }),
        ],
      },
      {
        name: "펜 툴 정복",
        lessons: [
          lesson({ slug: "pen-tool-straight", title: "펜 툴로 직선 그리기", level: 2, order: 50, duration: 50 }),
          lesson({ slug: "pen-tool-curve", title: "펜 툴 곡선 (베지어 핸들)", level: 2, order: 51, duration: 60 }),
          lesson({ slug: "pen-tool-practice", title: "펜 툴 실전 (로고 따라 그리기)", level: 2, order: 52, duration: 60 }),
        ],
      },
      {
        name: "인물 보정",
        lessons: [
          lesson({ slug: "skin-retouch-basics", title: "잡티 제거 (힐링 브러시, 스탬프)", level: 2, order: 53, duration: 55 }),
          lesson({ slug: "skin-tone-adjust", title: "피부톤 자연스럽게 조정", level: 2, order: 54, duration: 55 }),
          lesson({ slug: "dodge-burn", title: "닷지와 번으로 입체감 주기", level: 2, order: 55, duration: 60 }),
        ],
      },
      {
        name: "스마트 오브젝트",
        lessons: [
          lesson({ slug: "smart-object-intro", title: "스마트 오브젝트란 (비파괴 편집의 핵심)", level: 2, order: 56, duration: 55 }),
          lesson({ slug: "smart-object-filter", title: "스마트 필터 활용", level: 2, order: 57, duration: 50 }),
          lesson({ slug: "smart-object-replace", title: "스마트 오브젝트 내용 교체", level: 2, order: 58, duration: 50 }),
        ],
      },
      {
        name: "레벨 2 실습",
        lessons: [
          lesson({ slug: "project-2-cafe-poster", title: "[실습1] 카페 메뉴 포스터 만들기", level: 2, order: 59, duration: 90, isProject: true }),
          lesson({ slug: "project-2-portrait-retouch", title: "[실습2] 인물 사진 보정 (증명사진 수준)", level: 2, order: 60, duration: 90, isProject: true }),
        ],
      },
    ],
  },
  {
    level: 3,
    name: "Level 3 · 고급",
    tagline: "품질로 차이내기",
    emoji: "🌳",
    graduation: "전공 과제를 포트폴리오 품질로 완성한다",
    estimatedWeeks: "약 4주",
    groups: [
      {
        name: "고급 합성",
        lessons: [
          lesson({ slug: "advanced-selection-subject", title: "AI 피사체 선택과 한계", level: 3, order: 61, duration: 50 }),
          lesson({ slug: "select-and-mask", title: "선택 및 마스크 작업 공간", level: 3, order: 62, duration: 60 }),
          lesson({ slug: "hair-selection", title: "머리카락 디테일 선택 기법", level: 3, order: 63, duration: 60 }),
          lesson({ slug: "channel-mask", title: "채널을 이용한 정밀 마스킹", level: 3, order: 64, duration: 60 }),
        ],
      },
      {
        name: "RAW와 색",
        lessons: [
          lesson({ slug: "camera-raw-intro", title: "카메라 RAW 필터 입문", level: 3, order: 65, duration: 55 }),
          lesson({ slug: "camera-raw-color", title: "RAW로 색감 잡기", level: 3, order: 66, duration: 55 }),
          lesson({ slug: "color-space-print", title: "RGB, CMYK, 색 프로파일 이해", level: 3, order: 67, duration: 50 }),
        ],
      },
      {
        name: "디자인공학과 특화",
        lessons: [
          lesson({ slug: "product-render-polish", title: "제품 렌더링 보정 기본", level: 3, order: 68, duration: 60 }),
          lesson({ slug: "reflection-shadow", title: "반사와 그림자 강조", level: 3, order: 69, duration: 60 }),
          lesson({ slug: "material-emphasis", title: "재질감(메탈, 플라스틱) 표현", level: 3, order: 70, duration: 60 }),
        ],
      },
      {
        name: "목업과 자동화",
        lessons: [
          lesson({ slug: "mockup-basics", title: "목업이란 무엇인가", level: 3, order: 71, duration: 50 }),
          lesson({ slug: "mockup-create", title: "스마트 오브젝트로 목업 만들기", level: 3, order: 72, duration: 60 }),
          lesson({ slug: "mockup-use", title: "무료 목업 PSD 활용법", level: 3, order: 73, duration: 50 }),
          lesson({ slug: "action-basics", title: "액션 기록과 재생 (반복 작업 자동화)", level: 3, order: 74, duration: 55 }),
          lesson({ slug: "batch-process", title: "배치 처리로 이미지 일괄 변환", level: 3, order: 75, duration: 55 }),
          lesson({ slug: "scripts-basics", title: "스크립트 활용 기본", level: 3, order: 76, duration: 50 }),
        ],
      },
      {
        name: "출력과 포트폴리오",
        lessons: [
          lesson({ slug: "export-for-print", title: "인쇄용 출력 규격 (300dpi, CMYK)", level: 3, order: 77, duration: 50 }),
          lesson({ slug: "export-for-web", title: "웹용 최적화 (Save for Web)", level: 3, order: 78, duration: 50 }),
        ],
      },
      {
        name: "졸업 프로젝트",
        lessons: [
          lesson({ slug: "project-3-product-mockup", title: "[실습1] 제품 렌더링 보정 + 목업 배치", level: 3, order: 79, duration: 120, isProject: true }),
          lesson({ slug: "project-3-portfolio-cover", title: "[졸업] 내 포트폴리오 표지 1장 완성", level: 3, order: 80, duration: 150, isProject: true }),
        ],
      },
    ],
  },
];

let _allLessons: LessonMeta[] | null = null;

export function getCurriculumLessons(): LessonMeta[] {
  if (_allLessons) return _allLessons;
  const out: LessonMeta[] = [];
  for (const section of LEVEL_SECTIONS) {
    for (const g of section.groups) {
      for (const ls of g.lessons) {
        out.push({ ...ls, groupLabel: g.name });
      }
    }
  }
  out.sort((a, b) => a.order - b.order);
  _allLessons = out;
  return out;
}

export function getCurriculumBySlug(slug: string): LessonMeta | null {
  return getCurriculumLessons().find((l) => l.slug === slug) ?? null;
}

export function getCurriculumByLevel(level: LevelId): LessonMeta[] {
  return getCurriculumLessons().filter((l) => l.level === level);
}

export function getNextCurriculumLesson(slug: string): LessonMeta | null {
  const all = getCurriculumLessons();
  const idx = all.findIndex((l) => l.slug === slug);
  if (idx < 0 || idx + 1 >= all.length) return null;
  return all[idx + 1];
}

export function getPrevCurriculumLesson(slug: string): LessonMeta | null {
  const all = getCurriculumLessons();
  const idx = all.findIndex((l) => l.slug === slug);
  if (idx <= 0) return null;
  return all[idx - 1];
}
