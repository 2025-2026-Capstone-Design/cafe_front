# cafun 프론트엔드 아키텍처 & 백엔드 연동 문서

> ABSA(Aspect-Based Sentiment Analysis) 기반 AI 카페 추천 서비스  
> 기술 스택: Next.js 15.1 (App Router) · React 19 · TypeScript · Tailwind CSS 4.0

---

## 목차
1. [프로젝트 구조](#1-프로젝트-구조)
2. [라우팅 & 페이지 목록](#2-라우팅--페이지-목록)
3. [백엔드 API 명세](#3-백엔드-api-명세)
4. [데이터 모델](#4-데이터-모델)
5. [페이지별 전체 플로우](#5-페이지별-전체-플로우)
6. [클라이언트 상태 관리](#6-클라이언트-상태-관리)
7. [핵심 데이터 변환 로직](#7-핵심-데이터-변환-로직)
8. [컴포넌트 트리](#8-컴포넌트-트리)
9. [미들웨어](#9-미들웨어)
10. [환경변수](#10-환경변수)
11. [12가지 Aspect 정의](#11-12가지-aspect-정의)
12. [알려진 이슈 & TODO](#12-알려진-이슈--todo)

---

## 1. 프로젝트 구조

```
cafe_front/my-app/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx               # 루트 레이아웃 (HomeHeader 포함)
│   ├── page.tsx                 # 홈 (/)
│   ├── search/page.tsx          # 지도 검색 (/search)
│   ├── onboarding/page.tsx      # 취향 설정 (/onboarding)
│   ├── cafe/[id]/page.tsx       # 카페 상세 (/cafe/:id)
│   ├── login/page.tsx           # 로그인 (/login)
│   ├── signup/page.tsx          # 회원가입 (/signup)
│   ├── bookmark/page.tsx        # 찜한 카페 (/bookmark)
│   └── mypage/page.tsx          # 마이페이지 (/mypage)
│
├── components/                   # 재사용 컴포넌트
│   ├── HomeHeader.tsx
│   ├── HeroBanner.tsx
│   ├── HomeCategorySection.tsx
│   ├── HomeCafeListSection.tsx
│   ├── HomeCafeCard.tsx
│   ├── CafeCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterPanel.tsx
│   ├── CafeDetailPanel.tsx      # 지도 우측 슬라이드 패널
│   ├── Navbar.tsx
│   ├── cafe-detail/             # 상세 페이지 전용 컴포넌트
│   │   ├── CafeDetailGallery.tsx
│   │   ├── CafeDetailInfo.tsx
│   │   ├── CafeDetailRadarChart.tsx
│   │   ├── CafeDetailReviews.tsx
│   │   └── CafeDetailSidebar.tsx
│   └── ui/
│       ├── button.tsx
│       └── badge.tsx
│
├── lib/                         # 비즈니스 로직 & 유틸리티
│   ├── api.ts                   # 백엔드 fetch 래퍼
│   ├── types.ts                 # TypeScript 타입 정의
│   ├── mappers.ts               # API 응답 → 내부 모델 변환
│   ├── auth.ts                  # 인증 (현재 mock)
│   ├── preferences.ts           # 취향 (cookie)
│   ├── bookmarks.ts             # 찜 (localStorage)
│   ├── recentSearches.ts        # 최근 검색어 (localStorage)
│   ├── ranking.ts               # 카페 랭킹/정렬
│   └── utils.ts                 # clsx + tailwind-merge
│
└── middleware.ts                # 온보딩 리다이렉트
```

---

## 2. 라우팅 & 페이지 목록

| 경로 | 컴포넌트 | 설명 | API 호출 |
|------|----------|------|----------|
| `/` | `app/page.tsx` | 홈 - 추천 카페 그리드, 카테고리 버튼, 히어로 배너 | `searchCafes` |
| `/search` | `app/search/page.tsx` | Google Maps 지도 + 카페 리스트 패널 + 필터 | `searchCafes`, `searchCafesAdvanced` |
| `/onboarding` | `app/onboarding/page.tsx` | 12가지 취향 선택 → 쿠키 저장 → `/` 이동 | 없음 |
| `/cafe/[id]` | `app/cafe/[id]/page.tsx` | 카페 상세 - 이미지, ABSA 레이더 차트, 리뷰 | `getCafeDetail`, `getReviews` |
| `/login` | `app/login/page.tsx` | 로그인 (현재 mock) | 미연동 |
| `/signup` | `app/signup/page.tsx` | 회원가입 (현재 mock) | 미연동 |
| `/bookmark` | `app/bookmark/page.tsx` | localStorage 찜 목록 | 없음 |
| `/mypage` | `app/mypage/page.tsx` | 프로필, 취향 배지, 로그아웃 | 없음 |

---

## 3. 백엔드 API 명세

**기본 URL**: `process.env.NEXT_PUBLIC_API_URL` (기본값: `http://localhost:3000`)

**파일**: `lib/api.ts`

---

### 3-1. 카페 기본 검색

```
GET /cafe/search
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `aspectVector` | `string` | 12차원 벡터 (쉼표 구분, 예: `1,0,0,0,1,0,0,1,0,0,0,0`) |
| `page` | `number` | 페이지 번호 (기본 1) |
| `limit` | `number` | 페이지당 결과 수 (기본 20) |

**호출 코드**:
```typescript
export async function searchCafes(
  aspectVector: number[],
  page = 1,
  limit = 20
): Promise<{ cafes: CafeSearchItem[]; total: number }>
```

---

### 3-2. 고급 검색 (측면 + 키워드)

```
GET /cafe/search/advanced
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `aspectVector` | `string` | 12차원 벡터 |
| `keywords` | `string` | 키워드 배열 (쉼표 구분) |
| `page` | `number` | 페이지 번호 |
| `limit` | `number` | 결과 수 |

**호출 코드**:
```typescript
export async function searchCafesAdvanced(
  aspectVector: number[],
  keywords: string[],
  page = 1,
  limit = 20
): Promise<{ cafes: CafeSearchItem[]; total: number }>
```

---

### 3-3. 카페 상세 조회

```
GET /cafe/{id}
```

**응답**: `CafeDetail` (아래 데이터 모델 참고)

---

### 3-4. 카페 리뷰 조회

```
GET /cafe/{id}/reviews
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `page` | `number` | 페이지 번호 |
| `limit` | `number` | 결과 수 |

**응답**: `{ reviews: ApiReview[]; totalCount: number }`

---

## 4. 데이터 모델

### API 응답 타입 (`lib/types.ts`)

```typescript
// 카페 검색 결과 단일 아이템
interface CafeSearchItem {
  id: string
  name: string
  category: string
  roadAddress: string
  imageUrls: string[]
  description: string
  topKeywords: { keyword: string; count: number }[]
  aspectVector?: number[]   // 12차원 ABSA 벡터 (-1 ~ 1)
  lat?: number              // ⚠️ 백엔드에서 실제로 경도(~127) 저장됨
  lon?: number              // ⚠️ 백엔드에서 실제로 위도(~37) 저장됨
}

// 카페 상세 (검색 아이템 확장)
interface CafeDetail extends CafeSearchItem {
  microReview: string
  address: string
  businessHours: string
  convenience: Record<string, boolean>        // 편의시설 맵
  informationFacilitie: string[]              // ⚠️ 오타 (Facilities)
  menus: unknown[]
  reviews: { reviews: ApiReview[]; totalCount: number }
}

// 리뷰 (12개 측면별 1~5 점수)
interface ApiReview {
  id: number
  cafeId: string
  userId: string
  reviewText: string
  coffeeBeverage?: number     // 커피/음료 (1-5)
  bakeryBread?: number        // 베이커리/빵
  cake?: number               // 케이크
  cookieBaked?: number        // 쿠키
  bingsuFruit?: number        // 빙수
  otherDessert?: number       // 기타 디저트
  spaceFacility?: number      // 공간/편의
  atmosphereVibe?: number     // 분위기
  service?: number            // 서비스
  priceValue?: number         // 가격/가성비
  giftPackaging?: number      // 선물/포장
  crowdWaiting?: number       // 혼잡도
  createdAt: string
}
```

### 내부 모델 (API → mappers.ts → 컴포넌트)

```typescript
// 프론트엔드 내부에서 사용하는 카페 모델
interface Cafe {
  id: string
  name: string
  category: string
  address: string
  imageUrls: string[]
  description: string
  topKeywords: { keyword: string; count: number }[]
  aspectScores: {          // 0 ~ 100 변환된 점수
    coffee: number; bakery: number; cake: number; cookie: number
    bingsu: number; dessert: number; space: number; vibe: number
    service: number; price: number; gift: number; crowd: number
  }
  score: number            // 전체 평균 점수
  lat: number              // 보정된 위도
  lon: number              // 보정된 경도
}
```

---

## 5. 페이지별 전체 플로우

### 5-1. 홈 (`/`)

```
1. middleware.ts 실행
   → userPreferences 쿠키 없으면 → /onboarding 리다이렉트
   → 쿠키 있으면 → 홈 렌더링 진행

2. page.tsx useEffect
   → getPreferences()           // cookie에서 AspectKey[] 읽기
   → aspectsToVector(prefs)     // 12차원 숫자 배열로 변환
   → searchCafes(vector)        // GET /cafe/search?aspectVector=...
   → mapSearchItem(item)[]      // API 응답 → 내부 Cafe 모델 변환
   → setState(cafes)

3. 렌더링
   → <HeroBanner />             // 자동 슬라이드 (Embla Carousel)
   → <HomeCategorySection />    // 측면 버튼 클릭 → /search?aspect=coffee
   → <HomeCafeListSection />    // 상위 8개 카페 카드 그리드
   → <AbsaFeatureSection />     // 서비스 소개
   → <HomeFooter />
```

---

### 5-2. 검색/지도 (`/search`)

```
1. URL 파라미터 파싱
   → ?aspect=coffee → 초기 필터 설정

2. 초기 카페 로딩
   → getPreferences()
   → fetchCafes(aspects, keywords)
     ├─ keywords가 있으면 → searchCafesAdvanced()
     │    GET /cafe/search/advanced?aspectVector=...&keywords=...
     └─ keywords 없으면 → searchCafes()
          GET /cafe/search?aspectVector=...
   → mapSearchItem(item)[]
   → setState(cafes)

3. Google Maps 초기화
   → new google.maps.Map(mapRef.current, {...})
   → window.google.maps.importLibrary("marker") → AdvancedMarkerElement
   → 카페별 마커 생성 (커스텀 HTML + SVG 아이콘)

4. 카페 선택 시
   → setSelectedCafe(cafe)
   → 마커 스타일 업데이트 (크기/색상 강조)
   → <CafeDetailPanel> 우측 슬라이드 오버레이 표시
     └─ 편의시설 그리드, 측면별 바 차트, 키워드 태그

5. 필터 적용 시
   → FilterPanel에서 onChange(selectedKeywordIds) 호출
   → keyword ID 파싱: "coffee:아메리카노" → aspect="coffee", keyword="아메리카노"
   → fetchCafes(aspects, keywords) 재호출
   → 마커 전체 재생성

6. 검색어 입력 시
   → SearchBar에서 onSearch(query) 호출
   → saveRecentSearch(query) → localStorage
   → /search?q=검색어 로 이동 또는 필터와 결합
```

---

### 5-3. 취향 설정 (`/onboarding`)

```
1. 12개 aspect 버튼 그리드 렌더링
   → 각 버튼: toggle 선택 (Set<AspectKey>)

2. "시작하기" 클릭
   → savePreferences(selectedAspects)
   → document.cookie = `userPreferences=${JSON.stringify([...selected])}`
   → router.push('/')
```

---

### 5-4. 카페 상세 (`/cafe/[id]`)

```
1. useEffect
   → getCafeDetail(id)       // GET /cafe/{id}
   → getReviews(id)          // GET /cafe/{id}/reviews
   → mapDetail(response)     // 벡터 → aspectScores, convenience → amenities
   → setState(cafe, reviews)

2. 렌더링
   → <CafeDetailGallery />   // imageUrls 슬라이드
   → <CafeDetailInfo />      // 이름, 주소, 영업시간, 별점, 가격대
   → <CafeDetailRadarChart /> // Recharts RadarChart + 강점 TOP3 / 약점 TOP3
   → <CafeDetailReviews />   // 페이지네이션 리뷰 목록
   → <CafeDetailSidebar />   // 편의시설, 키워드 태그
   → 하단 고정 북마크 버튼 (모바일)
```

---

### 5-5. 로그인 / 회원가입 (현재 Mock)

```
로그인:
  → mockLogin(email) → localStorage에서 User 조회
  → setUser(user) → localStorage 저장
  → router.push('/')

회원가입:
  → mockSignup(name, email) → UUID 생성, User 생성
  → setUser(user) → localStorage 저장
  → router.push('/onboarding')

※ 실제 API 연동 TODO
```

---

### 5-6. 찜한 카페 (`/bookmark`)

```
1. getBookmarks()       // localStorage "cafe_bookmarks" 읽기
2. Cafe[] 렌더링
3. toggleBookmark(cafe) → 추가/제거 → localStorage 갱신
```

---

### 5-7. 마이페이지 (`/mypage`)

```
1. getUser()            // localStorage "cafe_user"
2. getPreferences()     // cookie "userPreferences"
3. 취향 배지 렌더링
4. 로그아웃 → clearUser() → router.push('/')
```

---

## 6. 클라이언트 상태 관리

서버 상태관리 라이브러리 없이 React hooks + 브라우저 저장소 사용.

| 데이터 | 저장소 | 키 | 관리 파일 |
|--------|--------|-----|---------|
| 로그인 유저 | localStorage | `cafe_user` | `lib/auth.ts` |
| 찜한 카페 목록 | localStorage | `cafe_bookmarks` | `lib/bookmarks.ts` |
| 최근 검색어 (최대 5개) | localStorage | `cafe_recent_searches` | `lib/recentSearches.ts` |
| 취향 Aspect 목록 | cookie | `userPreferences` | `lib/preferences.ts` |
| 카페 목록, 선택 카페 | 컴포넌트 useState | - | 각 page.tsx |
| 필터 선택 상태 | 컴포넌트 useState | - | search/page.tsx |

---

## 7. 핵심 데이터 변환 로직

### 7-1. Aspect → 벡터 변환 (`lib/api.ts`)

```typescript
const ASPECT_KEYS = ['coffee','bakery','cake','cookie','bingsu','dessert',
                     'space','vibe','service','price','gift','crowd']

// ['coffee', 'vibe'] → [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
function aspectsToVector(aspects: AspectKey[]): number[]
```

---

### 7-2. 벡터 → 점수 변환 (`lib/mappers.ts`)

```typescript
// API 벡터: -1 ~ 1 범위
// → 내부 점수: 0 ~ 100 범위
score = Math.round(((rawValue + 1) / 2) * 100)
```

예시: `rawValue = 0.6` → `score = 80`

---

### 7-3. 리뷰 기반 점수 재계산 (`lib/mappers.ts`)

```typescript
// 리뷰의 측면별 값: 1 ~ 5 범위
// → 내부 점수: 0 ~ 100 범위
score = Math.round((reviewValue - 1) / 4 * 100)
```

---

### 7-4. 좌표 보정 (`lib/mappers.ts`)

```typescript
// ⚠️ 백엔드 버그: lat/lon 필드명이 반대로 저장됨
mapped.lat = apiItem.lon   // 백엔드 lon 필드 = 실제 위도 (~37)
mapped.lon = apiItem.lat   // 백엔드 lat 필드 = 실제 경도 (~127)
```

---

### 7-5. 편의시설 파싱 (`lib/mappers.ts`)

```typescript
// API: convenience: { "주차": true, "와이파이": true, ... }
// → 내부: amenities: string[] (true인 키만 추출)
```

---

### 7-6. 매치율 계산 (`lib/ranking.ts`)

```typescript
// 사용자 취향 vs 카페 점수 비교
// 취향 측면들의 카페 점수 평균 → 0~100 매치율
function calcMatchRate(preferences: AspectKey[], cafe: Cafe): number
```

---

## 8. 컴포넌트 트리

```
layout.tsx
  └── <HomeHeader>
        ├── 로고 → /
        ├── <SearchBar> → 검색어 입력, 최근 검색어 드롭다운
        └── Navbar (북마크/마이페이지)

/ (홈)
  ├── <HeroBanner>            Embla 자동슬라이드
  ├── <HomeCategorySection>   측면 카테고리 버튼 (→ /search?aspect=X)
  ├── <HomeCafeListSection>
  │     └── <HomeCafeCard>[]  카페 카드 (→ /cafe/:id)
  ├── <AbsaFeatureSection>
  └── <HomeFooter>

/search (지도 검색)
  ├── 좌측 패널 (320px)
  │     ├── <SearchBar>
  │     ├── <FilterPanel>     탭 기반 측면/키워드 필터
  │     └── <CafeCard>[]      리스트 (클릭 → 선택 + 패널 열기)
  └── 우측 Google Maps
        ├── AdvancedMarkerElement[]
        └── <CafeDetailPanel> (선택된 카페 슬라이드 오버레이)
              ├── 편의시설 그리드
              ├── 측면별 바 차트 (Recharts)
              └── 키워드 배지

/cafe/[id] (상세)
  ├── <CafeDetailGallery>     이미지 슬라이드
  ├── <CafeDetailInfo>        이름, 주소, 영업시간, 가격대
  ├── <CafeDetailRadarChart>  ABSA 레이더 차트 + 강점/약점 TOP3
  ├── <CafeDetailReviews>     리뷰 목록 + 페이지네이션
  └── <CafeDetailSidebar>     편의시설, 키워드 태그
```

---

## 9. 미들웨어

**파일**: `middleware.ts`

```typescript
// 모든 페이지 접근 시 실행
// userPreferences 쿠키가 없으면 /onboarding 으로 강제 리다이렉트
// 단, 정적 파일(_next/static, images, favicon)은 제외
```

**적용 경로**: `/((?!_next/static|_next/image|favicon.ico).*)`

**예외 처리 필요**:
- `/login`, `/signup`은 취향 없이도 접근 가능해야 하므로 미들웨어에서 제외 필요

---

## 10. 환경변수

**파일**: `.env.local`

| 변수명 | 용도 | 기본값 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 기본 URL | `http://localhost:3000` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API 키 | - |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | Google Maps Map ID (Advanced Marker용) | - |

---

## 11. 12가지 Aspect 정의

| 인덱스 | 코드 | 라벨 | 아이콘 | API 필드명 |
|--------|------|------|--------|-----------|
| 0 | `coffee` | 커피/음료 | ☕ | `coffeeBeverage` |
| 1 | `bakery` | 베이커리/빵 | 🥐 | `bakeryBread` |
| 2 | `cake` | 케이크 | 🎂 | `cake` |
| 3 | `cookie` | 쿠키/구움과자 | 🍪 | `cookieBaked` |
| 4 | `bingsu` | 빙수/과일 | 🍧 | `bingsuFruit` |
| 5 | `dessert` | 기타 디저트 | 🍮 | `otherDessert` |
| 6 | `space` | 공간/편의시설 | 🪑 | `spaceFacility` |
| 7 | `vibe` | 분위기/감성 | ✨ | `atmosphereVibe` |
| 8 | `service` | 서비스 | 🤝 | `service` |
| 9 | `price` | 가격/가성비 | 💰 | `priceValue` |
| 10 | `gift` | 선물/포장 | 🎁 | `giftPackaging` |
| 11 | `crowd` | 혼잡도/웨이팅 | 🕐 | `crowdWaiting` |

---

## 12. 알려진 이슈 & TODO

### 버그

| 이슈 | 위치 | 설명 |
|------|------|------|
| 좌표 뒤바뀜 | `lib/mappers.ts` | 백엔드 `lat`/`lon` 필드명이 반대 → 프론트에서 swap으로 보정 중 |
| 오타 | `CafeDetail` 타입 | `informationFacilitie` → `informationFacilities` 수정 필요 |
| 리뷰 별점 | `CafeDetailReviews` | `rating` 필드 없어서 하드코딩 4점 사용 중 |
| 미들웨어 미적용 | `middleware.ts` | `/login`, `/signup`도 onboarding으로 리다이렉트됨 |

### TODO

```
[ ] 로그인/회원가입 실제 API 연동 (auth.ts mock 제거)
[ ] 검색 API 연동 완성 (현재 일부 mock 데이터 혼재)
[ ] 좌표 버그 백엔드 수정 후 mappers.ts swap 로직 제거
[ ] Zustand 또는 Context API 도입 (localStorage 직접 접근 정리)
[ ] Google Maps API 키 환경변수 분리 완성 (하드코딩 제거)
[ ] 미들웨어에서 /login, /signup 경로 예외 처리
[ ] informationFacilitie 오타 수정 (백엔드 합의 필요)
[ ] 리뷰 별점(rating) 필드 백엔드 추가 요청
```

---

*최종 업데이트: 2026-05-08*
