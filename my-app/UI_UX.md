# cafun 프론트엔드 UI/UX 정리

> 기술 스택: Next.js 15.1 (App Router) · React 19 · Tailwind CSS 4.0 · Recharts · Embla Carousel

---

## 목차
1. [디자인 시스템](#1-디자인-시스템)
2. [페이지별 UI 구성](#2-페이지별-ui-구성)
3. [핵심 UX 패턴](#3-핵심-ux-패턴)
4. [컴포넌트 인벤토리](#4-컴포넌트-인벤토리)
5. [반응형 설계](#5-반응형-설계)
6. [개선 포인트 (TODO)](#6-개선-포인트-todo)

---

## 1. 디자인 시스템

### 색상 — OKLch 기반 CSS 변수 (`app/globals.css`)

| 변수 | 값 | 용도 |
|------|----|------|
| `--background` | oklch(0.99 0.002 60) | 페이지 배경 (아이보리) |
| `--foreground` | oklch(0.15 0.01 30) | 기본 텍스트 (다크 차콜) |
| `--card` | oklch(1 0 0) | 카드 배경 (순백) |
| `--primary` | oklch(0.55 0.15 35) | 주요 강조색 (딥 바이올렛) |
| `--secondary` | oklch(0.96 0.01 60) | 보조 배경 (연회색) |
| `--accent` | oklch(0.65 0.12 45) | 서브 강조 (라이트 퍼플) |
| `--destructive` | oklch(0.577 0.245 27.325) | 경고/삭제 (레드) |
| `--border` | oklch(0.92 0.005 60) | 테두리 |

### 카테고리 색상 (Tailwind utility)

각 ABSA 항목은 독립된 컬러 페어로 시각적으로 구분됨:

| 항목 | 배경 | 텍스트 |
|------|------|--------|
| 커피 (coffee) | `bg-amber-100` | `text-amber-700` |
| 베이커리 (bakery) | `bg-orange-100` | `text-orange-700` |
| 케이크 (cake) | `bg-pink-100` | `text-pink-700` |
| 빙수 (bingsu) | `bg-sky-100` | `text-sky-700` |
| 공간 (space) | `bg-violet-100` | `text-violet-700` |
| 분위기 (vibe) | `bg-yellow-100` | `text-yellow-700` |
| 가격 (price) | `bg-emerald-100` | `text-emerald-700` |
| 서비스 (service) | `bg-blue-100` | `text-blue-700` |

### 감성 키워드 색상

리뷰에서 추출된 키워드를 감성에 따라 색상으로 분류:

| 감성 | 배경 | 텍스트 | 테두리 |
|------|------|--------|--------|
| 긍정 | `bg-emerald-50` | `text-emerald-800` | `border-emerald-200` |
| 부정 | `bg-orange-50` | `text-orange-800` | `border-orange-200` |

### 점수 → 색상 매핑 (레이더 차트)

| 점수 | 색상 | 의미 |
|------|------|------|
| ≥ 80 | 초록 | 강점 |
| 60 ~ 79 | 노랑 | 보통 |
| < 60 | 빨강 | 개선 필요 |

### 타이포그래피 & 형태

- **폰트**: Geist Sans (기본), Geist Mono (코드/수치)
- **카페 이름**: `font-serif` + bold
- **border-radius**: `--radius: 0.75rem` (12px 기준, sm/md/lg/xl 변형)
- **카드 패딩**: `p-3` ~ `p-6`

---

## 2. 페이지별 UI 구성

### `/` — 홈

```
HomeHeader (sticky, z-50)
├── 로고
├── SearchBar placeholder
└── 내비: AI추천 · 검색 · 비교 · 마이페이지

HeroBanner
└── Embla Carousel: 3슬라이드, 5초 자동재생
    └── 도트 인디케이터 + 좌우 화살표 버튼

HomeCategorySection
└── 8개 ABSA 카드 그리드 (아이콘 + 색상)
    └── 클릭 → /search?aspect={key}

HomeCafeListSection
└── 추천 카페 그리드 (HomeCafeCard)
    └── 이미지 | 점수 배지 | 리뷰 수 | 항목 태그

AbsaFeatureSection  (ABSA 소개)
LocationBanner      (위치 기반 검색 프로모 배너)
HomeFooter
```

### `/search` — 지도 탐색

```
좌측 패널 (320px, 스크롤)
├── SearchBar + FilterPanel (드롭다운)
│   └── 탭: 12 ABSA 항목 | 편의시설
└── CafeCard 리스트
    └── 순위 · 점수 · 매칭% · 감성 키워드

우측 Google Maps
└── AdvancedMarkerElement (커스텀 SVG 원형)
    ├── 미선택: 30px, violet (#7C3AED)
    └── 선택됨: 36px, dark (#3C3489) + 카페명 라벨

CafeDetailPanel (우측 슬라이드오버, 선택 시 표시)
├── 카페명 · 주소 · 점수 · 북마크 버튼
├── 편의시설 그리드 (아이콘)
├── 항목별 점수 바
└── 감성 키워드 태그
```

### `/onboarding` — 취향 설정

```
12개 ABSA 항목 카드 그리드 (3열)
├── 아이콘 + 이름 + 설명
└── 선택/미선택 토글 (시각적 강조)

"시작하기" 버튼
└── 선택된 항목 → Cookie(userPreferences) → / 이동
```

### `/cafe/[id]` — 카페 상세

```
CafeDetailGallery   (이미지 캐러셀)
CafeDetailInfo      (이름 · 주소 · 영업시간 · 가격대 · 북마크)

CafeDetailRadarChart (Recharts)
├── 12각 레이더 차트 + 인터랙티브 툴팁
├── TOP3 강점 패널 (초록 배지 + 👍 아이콘)
└── TOP3 개선점 패널 (노랑/빨강 배지 + 👎 아이콘)

CafeDetailReviews   (페이지네이션 목록)
CafeDetailSidebar   (편의시설 그리드 + 키워드 태그)
```

### `/compare` — 카페 비교

```
슬롯 3개 (최대)
└── 각 슬롯: 카페 선택 드롭다운 or 빈 상태

CompareRadarChart (Recharts, 3 데이터셋 오버레이)
└── 항목별 색상 구분 + 범례

상세 비교 테이블
└── 항목별 점수 나란히 비교
```

### `/review/write` — 리뷰 작성

```
별점 입력 (5점 스케일)
12개 ABSA 세부 평가 슬라이더/입력
사진 업로드 (UI 구현, submit은 mock)
```

### `/mypage` — 마이페이지

```
프로필 카드 (이름 · 이메일)

Tabs (Radix)
├── 찜한카페  → 북마크 카페 그리드
├── 내취향    → 선택된 ABSA 항목 배지
└── 업적      → (플레이스홀더)

설정 메뉴 (로그아웃 등)
```

---

## 3. 핵심 UX 패턴

### 캐러셀

| 위치 | 라이브러리 | 동작 |
|------|-----------|------|
| 히어로 배너 | Embla Carousel | 5초 자동재생, 수동 조작, 도트+화살표 |
| 카페 갤러리 | 자체 구현 | 이미지 슬라이드 |

### 필터 시스템

- 탭별 키워드 선택 (`${aspect}:${keyword}` ID 형식)
- 편의시설 체크박스 (wifi · 주차 · 콘센트 · 반려동물 등)
- Apply → 서버 재요청 / Reset → 초기화
- URL 파라미터 연동 (`/search?aspect=coffee`)

### 취향 매칭률

- 온보딩 → Cookie 저장 → 카페 검색 시 벡터 주입
- 카페 카드에 "✓ X%" 매칭률 표시
- 계산: 선택 항목 점수 평균 → 백분율

### 북마크 시스템

- 하트 아이콘 토글 → localStorage 즉시 반영
- 모든 CafeCard / CafeDetailPanel / CafeDetailInfo에 공통 적용
- `/bookmark` 와 `/mypage > 찜한카페` 탭에서 확인

### 최근 검색어

- SearchBar 클릭 시 드롭다운 표시 (최대 5개)
- X 버튼으로 개별 삭제
- 홈 인기 키워드: 전체 카페 긍정 키워드 Top 8

### Google Maps 마커

```
미선택: circle 30px, fill=#7C3AED (violet)
선택됨: circle 36px, fill=#3C3489 (dark) + 카페명 라벨

→ 클릭/호버 시 우측 CafeDetailPanel 슬라이드인
```

### 점수 시각화

| 방식 | 사용처 | 특징 |
|------|--------|------|
| Custom SVG 레이더 | CafeCard (리스트/홈) | 경량, 12각형 폴리곤 |
| Recharts RadarChart | 카페 상세 / 비교 | 툴팁, 3데이터 오버레이 |
| 수평 바(bar) | CafeDetailPanel | 0~100 게이지 |
| TOP3 패널 | 카페 상세 | 강점(초록)/개선(빨강) 아이콘 |

### 미들웨어 리다이렉트

- `userPreferences` 쿠키 없으면 → `/onboarding` 강제 이동
- 정적 파일(`_next/`, `favicon.ico`) 제외

---

## 4. 컴포넌트 인벤토리

### 레이아웃

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| 루트 레이아웃 | `app/layout.tsx` | Geist 폰트, HomeHeader 래핑 |
| HomeHeader | `components/HomeHeader.tsx` | sticky 헤더, 로고·검색·내비·모바일 메뉴 |
| Navbar | `components/Navbar.tsx` | 보조 내비게이션 |

### 홈 섹션

| 컴포넌트 | 파일 |
|---------|------|
| 히어로 배너 | `components/HeroBanner.tsx` |
| ABSA 카테고리 | `components/HomeCategorySection.tsx` |
| 추천 카페 그리드 | `components/HomeCafeListSection.tsx` |
| 카페 카드 (홈용) | `components/HomeCafeCard.tsx` |
| ABSA 소개 섹션 | `components/AbsaFeatureSection.tsx` |
| 리뷰 분석 미리보기 | `components/ReviewAnalysisPreview.tsx` |
| 위치 배너 | `components/LocationBanner.tsx` |
| 푸터 | `components/HomeFooter.tsx` |

### 검색/지도

| 컴포넌트 | 파일 |
|---------|------|
| 검색 바 | `components/SearchBar.tsx` |
| 필터 패널 | `components/FilterPanel.tsx` |
| 카페 카드 (리스트) | `components/CafeCard.tsx` |
| 카페 상세 패널 (슬라이드오버) | `components/CafeDetailPanel.tsx` |

### 카페 상세

| 컴포넌트 | 파일 |
|---------|------|
| 갤러리 | `components/cafe-detail/CafeDetailGallery.tsx` |
| 정보 | `components/cafe-detail/CafeDetailInfo.tsx` |
| 레이더 차트 | `components/cafe-detail/CafeDetailRadarChart.tsx` |
| 리뷰 목록 | `components/cafe-detail/CafeDetailReviews.tsx` |
| 사이드바 | `components/cafe-detail/CafeDetailSidebar.tsx` |

### 비교

| 컴포넌트 | 파일 |
|---------|------|
| 비교 레이더 차트 | `components/compare/CompareRadarChart.tsx` |

### UI 프리미티브 (`components/ui/`)

| 컴포넌트 | 변형 |
|---------|------|
| Button | default · outline · secondary · ghost + sm/default/lg/icon |
| Badge | default · secondary · outline · destructive |
| Tabs | Radix 기반 탭 전환 |
| Input | 기본 텍스트 입력 |
| Textarea | 멀티라인 입력 |

### 차트

| 컴포넌트 | 구현 | 사용처 |
|---------|------|--------|
| `RadarChart.tsx` | Custom SVG | 홈·검색 카드용 경량 차트 |
| `CafeDetailRadarChart.tsx` | Recharts | 카페 상세 인터랙티브 차트 |
| `CompareRadarChart.tsx` | Recharts | 비교 페이지 3개 오버레이 |

---

## 5. 반응형 설계

모바일 퍼스트, Tailwind 브레이크포인트 기준:

| 요소 | 모바일 | 데스크톱 |
|------|--------|---------|
| 히어로 배너 비율 | `aspect-[16/7]` | `md:aspect-[16/5]` |
| 카테고리 그리드 | `grid-cols-4` | `md:grid-cols-8` |
| 카페 카드 그리드 | `grid-cols-1` | `sm:grid-cols-2 lg:grid-cols-3` |
| 온보딩 항목 | `grid-cols-3` | 동일 |
| 데스크톱 내비 | `hidden` | `md:flex` |
| 모바일 메뉴 | 표시 (햄버거) | `md:hidden` |
| 헤더 | `sticky top-0 z-50` | 동일 |
| 검색 패널 너비 | 전체 | 320px 고정 |

---

## 6. 개선 포인트 (TODO)

### 기능 미완성

| 항목 | 현황 | 할 일 |
|------|------|-------|
| 로그인/회원가입 | mock (localStorage) | 실제 API 연동 |
| 리뷰 작성 | UI 완성, submit mock | API 연동 |
| 카페 상세 → 리뷰 작성 진입 | 링크 없음 | 버튼/링크 추가 |
| 비교 페이지 데이터 | 홈 캐시 의존 | 캐시 미스 fallback |

### 미들웨어 버그

- `/login`, `/signup`도 `userPreferences` 체크에 걸려 onboarding 루프 가능
- 해당 경로 미들웨어 예외 처리 필요

### 기술 부채

| 항목 | 설명 |
|------|------|
| 좌표 swap | 백엔드 `lat`/`lon` 필드 역전, `mappers.ts`에서 임시 보정 중 |
| 리뷰 별점 | `rating` 필드 없어 4점 하드코딩 |
| 오타 | `informationFacilitie` → `informationFacilities` |
| 전역 상태 | localStorage 직접 접근 분산 → Zustand/Context 도입 검토 |

### UX 개선 아이디어

- 카페 상세에서 "비교에 추가" 버튼 → 비교 페이지 진입점
- 검색 결과 없음 상태 (empty state) UI
- 로딩 스켈레톤 카드 (현재 없음)
- 카페 카드에 영업 중/영업 종료 배지 (API 영업시간 기반)
- 마이페이지 업적 탭 내용 구현

---

*최종 업데이트: 2026-05-14*
