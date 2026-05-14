# 프론트엔드 백엔드 연결 TODO

> 기준일: 2026-05-14  
> 백엔드 배포 경로: EC2 (`secrets.EC2_HOST`:3000)  
> Base URL: `NEXT_PUBLIC_API_URL` 환경변수 (없으면 `http://localhost:3000`)

---

## 🔴 필수 (연결 안 되면 동작 자체가 안 됨)

### 1. 리뷰 작성 API 실제 호출
- **파일**: `app/review/write/page.tsx` → `handleSubmit`
- **상태**: ✅ 완료 — `postReview(cafeId, data, token)` 실제 호출로 교체됨

### 2. JWT 토큰 주입
- **파일**: `app/review/write/page.tsx`, `lib/auth.ts`
- **상태**: ✅ 완료 — `getToken()` / `setToken()` 추가, 비로그인 시 `/login` 리다이렉트

### 3. aspect 값 변환 로직
- **파일**: `app/review/write/page.tsx` → `handleSubmit`
- **상태**: ✅ 완료 — 백엔드 `@IsIn([1, 2, 3])` 스펙에 맞게 변환
  ```
  "positive" → 1
  "neutral"  → 2
  "negative" → 3
  null       → undefined (전송 제외)
  ```

### 4. 로그인 / 회원가입 실제 API 연결
- **파일**: `app/login/page.tsx`, `app/signup/page.tsx`
- **상태**: ✅ 완료 — mock 제거, `apiLogin()` / `register()` 실제 호출로 교체

---

## 🟡 수정 필요 (보내도 에러 나거나 데이터 깨짐)

### 5. overall 별점(1~5) 처리 방식 결정
- **현재**: 프론트 overall rating 1~5 수집 중 (`app/review/write/page.tsx`)
- **문제**: 백엔드 Review entity에 overall rating 필드 없음 → 현재 전송 안 됨
- **선택지**:
  - A. 백엔드에 `overall_rating` 컬럼 추가 + DTO / 마이그레이션
  - B. overall rating을 `reviewText` 앞에 텍스트로 포함시켜 우회 (예: `[★4] 본문...`)
- **담당**: 백엔드와 협의 필요

### 6. 로그인 후 유저 이름 복원
- **파일**: `app/login/page.tsx`, `lib/auth.ts` → `userFromToken()`
- **현재**: JWT payload에 `name` 필드 없어서 로그인 시 이름 공백
- **필요**: 백엔드 JWT payload에 `name` 포함 요청 or `/users/me` 엔드포인트 추가 요청
- **임시 처리**: 이메일을 name 대신 표시 중

---

## 🟢 나중에 (기능은 되지만 미완성)

### 7. 이미지 업로드 미구현
- **현재**: 프론트 form에 사진 업로드 UI 있음 (최대 5장), mock 이미지만 표시
- **문제**: 백엔드 Review entity에 이미지 필드 없음 → 저장 불가
- **필요**: S3 or 로컬 스토리지 연동 + `image_urls` 컬럼 추가 후 연결

### 8. 리뷰 목록 빈 배열 처리
- **파일**: `components/cafe-detail/CafeDetailReviews.tsx`
- **현재**: 리뷰 없으면 mock 데이터로 폴백
- **필요**: "아직 리뷰가 없습니다" 빈 상태 UI로 교체

### 9. CORS 도메인 제한
- **현재**: 백엔드 `main.ts` CORS 전체 허용 상태
- **필요**: 운영 배포 전 프론트 도메인 명시
  ```ts
  app.enableCors({ origin: ['https://your-frontend-domain.com'], credentials: true })
  ```

### 10. EC2 보안그룹 3000번 포트 인바운드 허용 확인
- **현재**: CD 스크립트에 해당 설정 없음
- **필요**: EC2 콘솔에서 직접 확인 및 설정

---

## 체크리스트

- [x] `handleSubmit`에 `postReview()` 실제 호출 추가
- [x] JWT 토큰 주입 + 비로그인 리다이렉트
- [x] aspect `"positive"/"neutral"/"negative"` → `1/2/3` 변환
- [x] 로그인 / 회원가입 실제 API 연결 (`apiLogin`, `register`)
- [ ] overall rating 처리 방식 결정 및 구현 (백엔드 협의)
- [ ] 로그인 후 유저 이름 복원 (`/users/me` or JWT payload에 name 추가)
- [ ] 이미지 업로드 백엔드 연동
- [ ] 빈 리뷰 목록 UI 처리
- [ ] CORS 도메인 제한 (운영 배포 전)
- [ ] EC2 보안그룹 3000번 포트 확인

---

---

## UI / 기능 개선 TODO

> 백엔드 연동과 무관한 프론트 자체 개선 사항

---

### 🔴 사용성 직결

#### A. 리뷰 섹션 — 빈 상태 실제 UI
- **파일**: `components/cafe-detail/CafeDetailReviews.tsx`
- **현재**: 리뷰 없으면 mock 데이터 3개로 무조건 채움
- **필요**: "아직 리뷰가 없어요. 첫 번째 리뷰를 작성해보세요!" + 리뷰 쓰기 버튼
- **조건**: 백엔드 리뷰 연동 완료 후 mock fallback 제거 시 함께 작업

#### B. 검색 결과 empty state 개선
- **파일**: `app/search/page.tsx` line 360–362
- **현재**: 회색 텍스트 한 줄만 ("조건에 맞는 카페가 없어요")
- **필요**: 아이콘 + 설명 문구 + "필터 초기화" 액션 버튼

#### C. Toast / 스낵바 알림 시스템
- **현재**: 북마크 추가/삭제, 리뷰 등록, 설정 저장 후 시각적 피드백 전혀 없음
- **필요**: 화면 하단 toast (예: "찜 목록에 추가됐어요 ♥", "리뷰가 등록됐어요")
- **참고**: `components/ui/sonner.tsx` 이미 있음 → `Toaster` 루트에 마운트 후 사용

#### D. 카페 상세 사이드바 — 지도 임베드
- **파일**: `components/cafe-detail/CafeDetailSidebar.tsx`
- **현재**: 주소 텍스트만 표시
- **필요**: OpenStreetMap iframe 또는 Google Static Map 이미지로 위치 미리보기
  ```
  https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=15&size=400x200&key=API_KEY
  ```

---

### 🟡 기능 확장

#### E. 마이페이지 — 내가 쓴 리뷰 탭
- **파일**: `app/mypage/page.tsx`
- **현재**: 탭이 찜한카페 / 내취향 / 업적 3개
- **필요**: "내 리뷰" 탭 추가 → `GET /cafe/{id}/reviews?userId=me` 또는 별도 엔드포인트
- **선행 조건**: 백엔드 내 리뷰 조회 API

#### F. 마이페이지 — 업적 탭 실제 조건 연동
- **파일**: `app/mypage/page.tsx`
- **현재**: 6개 업적 카드 전부 하드코딩 `achieved: false` (플레이스홀더)
- **아이디어**: 리뷰 수·북마크 수·방문 카페 수 기준으로 클라이언트에서 계산 가능한 것부터 연동
  - 첫 리뷰 작성 → localStorage 리뷰 여부 체크
  - 찜한 카페 5개 이상 → `getBookmarks().length >= 5`
  - 취향 설정 완료 → `getPreferences().length > 0`

#### G. 카페 비교 — 홈/검색에서 "비교 추가" 진입점
- **현재**: `/compare` 페이지 자체에서만 카페 선택 가능
- **필요**: `HomeCafeCard`, `CafeCard`(검색 리스트), `CafeDetailPanel`에 "비교에 추가 +" 버튼
- **상태 공유**: `cafeCache` 또는 `localStorage('compareList')`로 선택 목록 공유

#### H. 검색창 자동완성 — 카페명 매칭
- **파일**: `components/SearchBar.tsx`
- **현재**: 최근 검색어 드롭다운만 있음
- **필요**: 입력 중 로드된 카페 목록(`cafeCache`)에서 이름 매칭해 실시간 suggestion 표시

#### I. 리뷰 작성 — 카페 상세로 돌아갈 때 리뷰 목록 새로고침
- **파일**: `app/cafe/[id]/page.tsx`
- **현재**: 리뷰 작성 후 상세 페이지 복귀 시 리뷰 목록이 갱신되지 않음
- **필요**: URL에 `?refresh=reviews` 파라미터 감지 후 리뷰만 재요청 or router.replace 활용

---

### 🟢 완성도 / 폴리시

#### J. 이미지 로딩 실패 fallback 통일
- **현재**: `<img>` 태그 직접 사용, 실패 시 깨진 이미지 아이콘 노출
- **필요**: `onError={() => setImgSrc(PLACEHOLDER)}` 패턴 또는 Next.js `<Image>` 전환
- **파일**: `HomeCafeCard.tsx`, `CafeDetailGallery.tsx`, `CafeCard.tsx`

#### K. 페이지 전환 로딩 인디케이터
- **현재**: Next.js App Router 기본 동작만 (전환 중 피드백 없음)
- **필요**: `nprogress` 또는 상단 얇은 progress bar (NProgress 패턴)
- **파일**: `app/layout.tsx`에 전역 라우트 이벤트 훅 추가

#### L. 카페 상세 — 공유 버튼
- **파일**: `components/cafe-detail/CafeDetailInfo.tsx`
- **현재**: 북마크 버튼만 있음
- **필요**: Web Share API (`navigator.share`) → 미지원 시 URL 클립보드 복사 fallback

#### M. 편의시설 설정 — 검색 필터 자동 반영
- **파일**: `app/search/page.tsx`, `lib/preferences.ts`
- **현재**: `/conveniences`에서 저장해도 검색에 반영 안 됨
- **필요**: `fetchCafes` 호출 시 `localStorage('userConveniences')` 읽어서 초기 conveniences로 주입

#### N. 홈 카페 카드 — 스켈레톤 개선
- **파일**: `components/HomeCafeListSection.tsx`
- **현재**: animate-pulse 박스 4개 (이미 있음 ✅)
- **필요**: 카드 구조(이미지 영역 + 텍스트 라인 3개)와 정확히 매칭되는 스켈레톤으로 교체

---

## UI 체크리스트

- [ ] 리뷰 빈 상태 UI (mock fallback 제거 후)
- [ ] 검색 empty state 아이콘 + 필터 초기화 버튼
- [ ] Toast 알림 시스템 (`sonner` 연결)
- [ ] 카페 상세 사이드바 지도 미리보기
- [ ] 마이페이지 내 리뷰 탭
- [ ] 업적 탭 클라이언트 조건 연동 (북마크 수, 취향 설정 등)
- [ ] 카페 카드에 "비교 추가" 버튼
- [ ] 검색창 카페명 자동완성
- [ ] 이미지 로딩 실패 fallback 통일
- [ ] 공유 버튼 (Web Share API)
- [ ] 편의시설 설정 → 검색 필터 자동 반영
