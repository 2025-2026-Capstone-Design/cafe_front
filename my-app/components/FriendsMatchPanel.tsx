"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Coffee, MapPin, Star, ChevronRight, UserPlus } from "lucide-react"

interface Friend {
  id: number
  name: string
  handle: string
  matchScore: number
  commonTastes: string[]
  suggestedCafe: { name: string; location: string; score: number }
  recentCafe: string
  avatarColor: string
  mutualCount: number
}

const FRIENDS: Friend[] = [
  {
    id: 1,
    name: "김지은",
    handle: "@jieun_k",
    matchScore: 94,
    commonTastes: ["커피", "작업공간", "분위기"],
    suggestedCafe: { name: "어니언 성수", location: "성수동", score: 9.6 },
    recentCafe: "모노클 커피",
    avatarColor: "bg-violet-400",
    mutualCount: 5,
  },
  {
    id: 2,
    name: "박민준",
    handle: "@minjun_p",
    matchScore: 88,
    commonTastes: ["베이커리", "케이크", "가격"],
    suggestedCafe: { name: "르뱅 베이커리", location: "강남", score: 9.1 },
    recentCafe: "노티드 도넛",
    avatarColor: "bg-sky-400",
    mutualCount: 3,
  },
  {
    id: 3,
    name: "이수아",
    handle: "@sua_cafe",
    matchScore: 83,
    commonTastes: ["감성", "디저트", "서비스"],
    suggestedCafe: { name: "카페 식물관", location: "연남동", score: 9.0 },
    recentCafe: "테라로사",
    avatarColor: "bg-rose-400",
    mutualCount: 7,
  },
  {
    id: 4,
    name: "최현석",
    handle: "@hs_beans",
    matchScore: 79,
    commonTastes: ["핸드드립", "싱글오리진", "공간"],
    suggestedCafe: { name: "망원 로스터즈", location: "망원동", score: 8.5 },
    recentCafe: "블루보틀 홍대",
    avatarColor: "bg-emerald-400",
    mutualCount: 2,
  },
  {
    id: 5,
    name: "정나래",
    handle: "@nare_sweets",
    matchScore: 76,
    commonTastes: ["케이크", "디저트", "인테리어"],
    suggestedCafe: { name: "노티드 도넛 청담", location: "청담", score: 9.2 },
    recentCafe: "어니언 성수",
    avatarColor: "bg-amber-400",
    mutualCount: 4,
  },
]

function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "bg-violet-100 text-violet-700 border-violet-200" :
    score >= 80 ? "bg-sky-100 text-sky-700 border-sky-200" :
                  "bg-stone-100 text-stone-600 border-stone-200"
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {score}% 매칭
    </span>
  )
}

function FriendCard({ friend }: { friend: Friend }) {
  const [requested, setRequested] = useState(false)

  return (
    <div className="flex-shrink-0 w-64 bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* 유저 정보 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-11 h-11 ${friend.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
            {friend.name[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{friend.name}</p>
            <p className="text-xs text-muted-foreground">{friend.handle}</p>
          </div>
        </div>
        <MatchBadge score={friend.matchScore} />
      </div>

      {/* 공통 취향 태그 */}
      <div className="flex flex-wrap gap-1">
        {friend.commonTastes.map(t => (
          <span key={t} className="text-[11px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
            {t}
          </span>
        ))}
      </div>

      {/* 같이 가면 좋을 카페 */}
      <div className="bg-secondary/60 rounded-xl px-3 py-2.5">
        <p className="text-[10px] text-muted-foreground mb-1 font-medium">같이 가면 좋을 카페</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Coffee className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">{friend.suggestedCafe.name}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-600">{friend.suggestedCafe.score}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{friend.suggestedCafe.location}</span>
        </div>
      </div>

      {/* 최근 방문 + 공통 친구 */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>최근 · {friend.recentCafe}</span>
        <span>공통 {friend.mutualCount}명</span>
      </div>

      {/* CTA */}
      <button
        onClick={() => setRequested(true)}
        className={`w-full text-sm font-medium py-2 rounded-xl transition-colors ${
          requested
            ? "bg-secondary text-muted-foreground cursor-default"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {requested ? "요청 전송됨" : "카페 메이트 신청"}
      </button>
    </div>
  )
}

export function FriendsMatchPanel() {
  return (
    <section className="py-10 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">취향 맞는 카페 메이트</h2>
            </div>
            <p className="text-sm text-muted-foreground">AI가 취향 점수를 분석해 딱 맞는 친구를 연결해드려요</p>
          </div>
          <Link
            href="/community"
            className="hidden md:flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            모두 보기
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 가로 스크롤 카드 */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {FRIENDS.map(f => (
            <div key={f.id} className="snap-start">
              <FriendCard friend={f} />
            </div>
          ))}

          {/* 더 찾기 카드 */}
          <div className="flex-shrink-0 w-64 border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 snap-start">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground mb-1">더 많은 메이트</p>
              <p className="text-xs text-muted-foreground">취향 설정을 완료하면 더 많은 카페 메이트를 찾을 수 있어요</p>
            </div>
            <Link
              href="/onboarding"
              className="text-xs text-primary border border-primary/30 rounded-full px-4 py-1.5 hover:bg-primary/5 transition-colors font-medium"
            >
              취향 설정하기
            </Link>
          </div>
        </div>

        {/* 모바일 전체보기 */}
        <div className="mt-4 md:hidden text-center">
          <Link href="/community" className="text-sm text-primary font-medium">
            커뮤니티에서 더 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
