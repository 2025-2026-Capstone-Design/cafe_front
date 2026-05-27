"use client"

import { useState } from "react"
import { Heart, MessageCircle, Bookmark, Share2, MapPin, Star, TrendingUp, Users, Coffee, ImageOff } from "lucide-react"
import { HomeFooter } from "@/components/HomeFooter"

// ─── 타입 ───────────────────────────────────────────────────────────────
interface Post {
  id: number
  user: { name: string; handle: string; avatar: string; badge?: string }
  cafe: { name: string; location: string; score: number }
  image: { url?: string; bg: string; emoji: string }
  content: string
  tags: string[]
  likes: number
  comments: number
  saves: number
  time: string
  liked?: boolean
  saved?: boolean
}

// ─── 하드코딩 피드 데이터 ────────────────────────────────────────────────
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    user: { name: "지수", handle: "@jisu_coffee", avatar: "지수", badge: "TOP" },
    cafe: { name: "모노클 커피", location: "성수동", score: 9.4 },
    image: { url: "https://ldb-phinf.pstatic.net/20240504_262/17148070165581UA3X_JPEG/IMG_9053.jpeg", bg: "from-amber-100 to-orange-200", emoji: "☕" },
    content: "성수동 산책하다가 우연히 들어간 모노클 커피, 생각보다 너무 좋아서 글 남겨요 🍂 라떼 아트도 예쁘고 공간이 진짜 감성 터짐. cafun AI가 '분위기 9.4점' 줬는데 이해됨. 나무 인테리어에 창밖 햇살 맛집이에요 ☀️",
    tags: ["성수카페", "감성카페", "라떼아트", "작업하기좋은"],
    likes: 284, comments: 31, saves: 97, time: "2시간 전", liked: false, saved: false,
  },
  {
    id: 2,
    user: { name: "현우", handle: "@hw_espresso", avatar: "현우" },
    cafe: { name: "블루보틀 홍대점", location: "홍대", score: 8.7 },
    image: { url: "https://ldb-phinf.pstatic.net/20250513_158/1747135902052B1Gue_JPEG/%B0%B3%BC%BA%BE%E0%B0%FA.jpg", bg: "from-sky-100 to-blue-200", emoji: "💙" },
    content: "cafun으로 '조용한 작업 공간' 필터 걸었더니 블루보틀 홍대 추천받았어요. 진짜 오후 내내 집중해서 작업할 수 있었음. 와이파이도 빠르고 콘센트 넉넉. 에스프레소 싱글오리진 마셨는데 산미 매력 폭발 🔥",
    tags: ["홍대카페", "블루보틀", "작업카페", "에스프레소"],
    likes: 157, comments: 18, saves: 63, time: "5시간 전", liked: true, saved: false,
  },
  {
    id: 3,
    user: { name: "민서", handle: "@minseo_cake", avatar: "민서", badge: "NEW" },
    cafe: { name: "르뱅 베이커리", location: "강남", score: 9.1 },
    image: { url: "https://ldb-phinf.pstatic.net/20240504_202/171480703805072Auv_JPEG/IMG_4435.jpeg", bg: "from-pink-100 to-rose-200", emoji: "🍰" },
    content: "강남에서 생일 케이크 먹을 곳 찾다가 cafun 케이크 카테고리 눌렀는데 르뱅이 바로 나왔어요 🎂 딸기 쇼트케이크 비주얼 실화냐... 맛도 당연히 최고. ABSA 케이크 점수 9.1 믿고 갔더니 역시 믿을 만하네요 ✨",
    tags: ["강남카페", "케이크맛집", "생일케이크", "르뱅"],
    likes: 412, comments: 55, saves: 182, time: "어제", liked: false, saved: true,
  },
  {
    id: 4,
    user: { name: "태연", handle: "@taeyeon_daily", avatar: "태연" },
    cafe: { name: "어니언 성수", location: "성수동", score: 9.6 },
    image: { url: "https://ldb-phinf.pstatic.net/20250513_1/1747135881284A402b_JPEG/462076798_1249977749474594_88835553201936809_n.jpg", bg: "from-stone-100 to-zinc-200", emoji: "🏭" },
    content: "어니언 성수 드디어 다녀왔어요. 폐공장 리모델링 감성 실화입니다 😭 cafun 공간·분위기 점수 9.6이 납득되는 비주얼. 아메리카노 한 잔 들고 창가에 앉아 있으면 유럽 어딘가 온 느낌. 주말엔 웨이팅 필수!!",
    tags: ["어니언성수", "성수카페", "인스타감성", "폐공장카페"],
    likes: 631, comments: 88, saves: 245, time: "어제", liked: true, saved: true,
  },
  {
    id: 5,
    user: { name: "준혁", handle: "@jun_matcha", avatar: "준혁" },
    cafe: { name: "테라로사 커피웍스", location: "이태원", score: 8.9 },
    image: { url: "https://ldb-phinf.pstatic.net/20250513_84/17471359377067onuG_JPEG/420501811_18082770877418171_3414049195818285086_n.jpg", bg: "from-green-100 to-emerald-200", emoji: "🍵" },
    content: "이태원 카페 투어하다 테라로사 들렀는데 matcha latte 진짜 맛있음 🌿 cafun으로 미리 '서비스 친절도' 탭 확인했는데 리뷰에 '직원분들이 재료 설명 잘 해줘서 좋아요' 라는 말이 많았는데 실제로 그랬음. 신기해서 더 신뢰하게 됨ㅋㅋ",
    tags: ["이태원카페", "테라로사", "말차라떼", "커피로스터리"],
    likes: 203, comments: 27, saves: 84, time: "2일 전", liked: false, saved: false,
  },
  {
    id: 6,
    user: { name: "유리", handle: "@uri_연남", avatar: "유리", badge: "TOP" },
    cafe: { name: "카페 식물관", location: "연남동", score: 9.0 },
    image: { url: "https://ldb-phinf.pstatic.net/20240504_139/1714805617063R2S6Q_JPEG/IMG_4482.jpeg", bg: "from-lime-100 to-green-200", emoji: "🌿" },
    content: "연남동 플랜테리어 카페 찾다가 cafun '공간' 필터로 발견한 카페 식물관 🪴 입구부터 식물로 가득한데 사진 찍을 곳이 너무 많아서 한 시간은 그냥 보냄. 논알코올 히비스커스 에이드도 눈으로 두 번 마시게 되는 비주얼 ❤️",
    tags: ["연남동카페", "플랜테리어", "카페식물관", "분위기맛집"],
    likes: 339, comments: 42, saves: 161, time: "3일 전", liked: false, saved: false,
  },
  {
    id: 7,
    user: { name: "도현", handle: "@dohyun_beans", avatar: "도현" },
    cafe: { name: "망원 로스터즈", location: "망원동", score: 8.5 },
    image: { url: "https://ldb-phinf.pstatic.net/20250513_230/1747135897980l47U8_JPEG/479490005_18122044390418171_7413340541561703055_n.jpg", bg: "from-yellow-100 to-amber-200", emoji: "🫘" },
    content: "망원 로컬 카페 찾다가 cafun 지역 필터로 발견한 숨겨진 로스터리 ☕ 싱글오리진 핸드드립 마셨는데 에티오피아 원두 향이 진짜... 장미향이 이렇게 커피에서 날 수 있다고? ABSA 커피 점수 8.5는 좀 낮은 것 같던데, 내 기준엔 10점이었음 🌹",
    tags: ["망원카페", "핸드드립", "싱글오리진", "로컬카페"],
    likes: 118, comments: 14, saves: 49, time: "4일 전", liked: false, saved: false,
  },
  {
    id: 8,
    user: { name: "나연", handle: "@na_dessert", avatar: "나연", badge: "NEW" },
    cafe: { name: "노티드 도넛 청담", location: "청담", score: 9.2 },
    image: { url: "https://ldb-phinf.pstatic.net/20250513_285/17471359065561aoHf_JPEG/%B5%FE%B1%E2%C2%FD%BD%D2%B6%B1.jpg", bg: "from-orange-100 to-amber-100", emoji: "🍩" },
    content: "디저트 맛집 찾을 때 이제 cafun 없이 못 살 것 같아요 🥲 노티드 도넛 cafun에서 디저트 9.2점 받은 거 보고 바로 달려갔는데 웨이팅 30분이었지만 완전 가치 있었음! 크림 도넛 터질 것 같은 비주얼에 맛까지... 행복 그 잡채 🍩✨",
    tags: ["노티드도넛", "청담카페", "도넛맛집", "디저트투어"],
    likes: 527, comments: 73, saves: 214, time: "5일 전", liked: false, saved: false,
  },
]

const TRENDING_TAGS = [
  { tag: "성수카페", count: "1.2만" },
  { tag: "작업카페", count: "9.4천" },
  { tag: "케이크맛집", count: "8.1천" },
  { tag: "인스타감성", count: "7.6천" },
  { tag: "핸드드립", count: "5.3천" },
  { tag: "플랜테리어", count: "4.8천" },
]

const SUGGESTED_USERS = [
  { name: "카페여행자", handle: "@cafe_traveler", posts: 142 },
  { name: "커피한잔", handle: "@onecup_daily", posts: 87 },
  { name: "디저트헌터", handle: "@dessert_kr", posts: 203 },
]

const TABS = ["전체", "인기", "팔로잉"] as const

// ─── 아바타 컴포넌트 ─────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-stone-400", "bg-sky-400", "bg-pink-400",
  "bg-emerald-400", "bg-amber-400", "bg-rose-400",
  "bg-teal-400", "bg-slate-400",
]

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm"
  return (
    <div className={`${sizeClass} ${AVATAR_COLORS[idx]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name[0]}
    </div>
  )
}

// ─── 이미지 영역 ──────────────────────────────────────────────────────────
function PostImage({ image }: { image: Post["image"] }) {
  const [failed, setFailed] = useState(false)

  if (image.url && !failed) {
    return (
      <div className="w-full aspect-[4/5] bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt="카페 사진"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  return (
    <div className={`w-full aspect-[4/5] bg-gradient-to-br ${image.bg} flex items-center justify-center`}>
      {failed
        ? <ImageOff className="h-12 w-12 text-muted-foreground/30" />
        : <span className="text-8xl select-none">{image.emoji}</span>
      }
    </div>
  )
}

// ─── 피드 카드 ────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onSave }: {
  post: Post
  onLike: (id: number) => void
  onSave: (id: number) => void
}) {
  const likeCount = post.liked ? post.likes + 1 : post.likes

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">

      {/* ① 유저 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar name={post.user.avatar} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">{post.user.name}</span>
            {post.user.badge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${post.user.badge === "TOP" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                {post.user.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{post.cafe.name} · {post.cafe.location}</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* ② 풀사이즈 이미지 */}
      <PostImage image={post.image} />

      {/* ③ 액션 버튼 — 이미지 바로 아래 */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(post.id)}
            className={`transition-all active:scale-90 ${post.liked ? "text-rose-500" : "text-foreground hover:text-rose-400"}`}
          >
            <Heart className={`h-6 w-6 ${post.liked ? "fill-rose-500" : ""}`} />
          </button>
          <button className="text-foreground hover:text-muted-foreground transition-colors">
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
        <button
          onClick={() => onSave(post.id)}
          className={`transition-all active:scale-90 ${post.saved ? "text-primary" : "text-foreground hover:text-muted-foreground"}`}
        >
          <Bookmark className={`h-6 w-6 ${post.saved ? "fill-primary" : ""}`} />
        </button>
      </div>

      {/* ④ 좋아요 수 */}
      <div className="px-4 pb-1">
        <span className="text-sm font-semibold text-foreground">좋아요 {likeCount.toLocaleString()}개</span>
      </div>

      {/* ⑤ 캡션 (인스타 스타일: 유저명 + 본문 인라인) */}
      <div className="px-4 pb-2">
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold mr-1.5">{post.user.name}</span>
          {post.content}
        </p>
      </div>

      {/* ⑥ 해시태그 */}
      <div className="px-4 pb-2 flex flex-wrap gap-1">
        {post.tags.map(tag => (
          <span key={tag} className="text-xs text-primary hover:text-primary/80 cursor-pointer">
            #{tag}
          </span>
        ))}
      </div>

      {/* ⑦ 댓글 수 + 시간 */}
      <div className="px-4 pb-3 flex items-center gap-3">
        <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          댓글 {post.comments}개 모두 보기
        </span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">{post.time}</span>
        <div className="ml-auto flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-amber-600">{post.cafe.score}</span>
        </div>
      </div>

    </article>
  )
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("전체")
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p))
  }
  const handleSave = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
  }

  const displayed = activeTab === "인기"
    ? [...posts].sort((a, b) => b.likes - a.likes)
    : posts

  return (
    <div className="min-h-screen bg-background">
      {/* 페이지 헤더 — 중립 톤 */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">커뮤니티</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-10">cafun 유저들의 진짜 카페 이야기</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 피드 */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* 글쓰기 유도 박스 */}
            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
              <Avatar name="나" size="sm" />
              <div className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
                오늘 방문한 카페 이야기를 나눠보세요 ☕
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-full transition-colors">
                작성
              </button>
            </div>

            {displayed.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
            ))}
          </div>

          {/* 사이드바 */}
          <aside className="flex flex-col gap-5">
            {/* 트렌딩 태그 */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">지금 인기 태그</h2>
              </div>
              <ul className="flex flex-col gap-2.5">
                {TRENDING_TAGS.map((item, i) => (
                  <li key={item.tag} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <span className="text-sm text-primary group-hover:text-primary/80 font-medium">#{item.tag}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 추천 유저 */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">추천 유저</h2>
              </div>
              <ul className="flex flex-col gap-3">
                {SUGGESTED_USERS.map(user => (
                  <li key={user.handle} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">리뷰 {user.posts}개</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/5 transition-colors">
                      팔로우
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI 추천 유도 — 중립 톤 */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Coffee className="h-4 w-4 text-primary" />
              </div>
              <p className="font-semibold text-sm text-foreground mb-1">AI가 골라주는 나만의 카페</p>
              <p className="text-xs text-muted-foreground mb-4">취향을 알려주면 딱 맞는 카페만 추려드려요</p>
              <a href="/onboarding" className="block text-center bg-primary text-primary-foreground text-sm font-semibold rounded-full py-2 hover:bg-primary/90 transition-colors">
                취향 설정하기 →
              </a>
            </div>
          </aside>

        </div>
      </div>

      <HomeFooter />
    </div>
  )
}
