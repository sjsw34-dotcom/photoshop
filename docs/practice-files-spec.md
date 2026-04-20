# docs/practice-files-spec.md — 연습 파일 스펙 (Level 0)

> 각 레슨에서 제공/요구하는 연습 파일의 규격. **마스터(사용자)가 실제 .psd
> 또는 샘플 이미지를 제작해 `photoshop-academy/public/practice-files/{slug}.zip`
> 경로에 넣는다.** Claude는 이 파일들을 직접 만들지 않는다.

---

## 공통 규칙

- 파일명: `{두자리-번호}-{slug}.zip` (예: `05-new-document.zip`)
- 위치: `photoshop-academy/public/practice-files/`
- 각 zip 내부 최상단에 **README.txt** 포함 (아래 템플릿 참고)
- 이미지 샘플이 필요한 경우 해상도·크기는 **레슨 본문에 적힌 값과 동일**
- 원본 저작권 주의: **학습자가 본인 사진을 쓰도록 유도**하므로 마스터가
  제공하는 샘플은 **저작권 프리**(직접 촬영, CC0, 공식 Unsplash 등)로 한정

### README.txt 템플릿

```
레슨 {order}. {제목}
slug: {slug}

[이 폴더에 들어 있는 것]
- {파일명 1} : 용도
- {파일명 2} : 용도

[시작 상태]
이 .psd/.jpg를 열면 어떤 상태인지 한 줄 설명.

[오늘 할 일]
본문 따라하기의 결과물 한 줄 요약.

[어려우면]
레슨 본문 '따라하기' Step 1부터 다시 읽어요.
```

---

## 레슨별 스펙

### 01. what-is-photoshop — **연습 파일 없음**

- Phase 0 개념 레슨. 설치 전이므로 zip 불필요.
- `<PracticeCompare>` 는 학습자의 **본인 휴대폰 사진**으로 진행.

### 02. install-photoshop — **연습 파일 없음**

- 설치 과정 자체가 실습. 내려받을 zip 없음.

### 03. interface-tour — **선택 (없어도 됨)**

- 인터페이스 투어는 실행 후 화면을 보며 진행하므로 zip 불필요.
- 학습자가 아직 사진이 없다고 호소하면, 샘플 이미지 1장 제공 고려.
  - 파일명 후보: `sample-landscape-1920.jpg` (1920x1080, 풍경 사진)

### 04. mouse-keyboard-basics — **선택**

- 실습에 빈 캔버스만 있으면 충분. zip 불필요.
- 대안: 이미 도형이 몇 개 그려진 `practice-shapes.psd` 제공 시 Alt 복사
  실습이 더 직관적.

### 05. new-document — **필수 아님**

- 학습자가 스스로 새 문서를 만드는 레슨. 별도 파일 불필요.

### 06. open-files — **권장**

**zip 내용**:
- `sample-photo-1.jpg` : 1600x1200 이상 가로 사진
- `sample-photo-2.jpg` : 1600x1200 이상 세로 사진
- `README.txt`

**시작 상태**: 사진 두 장만 있는 상태.
**오늘 할 일**: 1080 캔버스에 두 장을 가져와 나란히 배치.

### 07. zoom-pan — **권장**

**zip 내용**:
- `large-photo-4000.jpg` : 4000x3000 이상의 큰 사진 (확대해야 픽셀이
  보이도록)
- `README.txt`

**시작 상태**: 한 장의 큰 이미지.
**오늘 할 일**: 전체 보기와 500% 확대 캡처 비교.

### 08. undo-history — **필수 아님**

- 빈 캔버스에 낙서하는 실습. zip 불필요.

### 09. save-formats — **권장**

**zip 내용**:
- `layered-sample.psd` : 배경 레이어 + 사진 레이어 + 텍스트 레이어 3개를
  포함한 1080x1080 PSD. 투명 영역이 일부 있어야 PNG 저장 실습이 의미 있음.
- `README.txt`

**시작 상태**: 3레이어 PSD가 열려 있음.
**오늘 할 일**: PSD 저장, JPG 품질 10 저장, PNG 투명 저장을 모두 해보고
용량 비교.

### 10. project-0-instagram-square — **권장 (졸업 과제)**

**zip 내용**:
- `starter-photo.jpg` : 세로 비율의 샘플 인물/풍경 사진 (본인 사진이
  없거나 올리기 껄끄러운 학습자용 대체재). 최소 1500x2000.
- `target-example.jpg` : 마스터가 미리 만든 **완성 예시** 1080 정사각형
  결과물 (비교 참고용, 학습자가 베끼는 용도 아님)
- `README.txt` : "네 사진을 쓰는 걸 권장합니다. 정 없을 때만 starter를
  써요" 식 안내

**시작 상태**: 원본 사진 한 장.
**오늘 할 일**: 1080 정사각형 PSD + JPG 두 파일 생산.

---

## 우선순위 (마스터가 먼저 만들 순서)

1. **레슨 10** (`project-0-instagram-square`) : 졸업 과제라 제일 중요.
   starter와 target_example 두 장만 마련.
2. **레슨 9** (`save-formats`) : 3레이어 PSD. JPG/PNG 실습을 위한 필수 재료.
3. **레슨 6** (`open-files`) : 두 장 샘플. 배치 실습용.
4. **레슨 7** (`zoom-pan`) : 고해상도 한 장. 픽셀 확인용.
5. 나머지는 **학습자 본인 사진** 중심이라 파일 제공 안 해도 됨.

---

## 마스터 체크리스트

- [ ] `public/practice-files/` 아래에 위 우선순위대로 zip 생성
- [ ] 각 zip에 README.txt 포함
- [ ] 파일명은 모두 `소문자-하이픈`, 한글/공백 금지
- [ ] 저작권 문제 없는 이미지만 포함
- [ ] placeholder `*.zip.placeholder` 파일은 실제 zip 생성 후 삭제
- [ ] 각 레슨 MDX의 `<PracticeFile>` 태그(있으면) src 경로가 맞는지 확인
