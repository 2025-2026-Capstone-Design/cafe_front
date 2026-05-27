"use client"

import { useState } from "react"
import { MapPin, Star, Coffee, Heart, Users } from "lucide-react"

interface OverlapCafe {
  name: string
  location: string
  score: number
  imageUrl: string
  matchReasons: string[]
  distance: string
}

interface FriendData {
  id: number
  name: string
  avatarColor: string
  matchScore: number
  cafes: OverlapCafe[]
}

const FRIENDS_DATA: FriendData[] = [
  {
    id: 1,
    name: "김지은",
    avatarColor: "bg-violet-400",
    matchScore: 94,
    cafes: [
      {
        name: "어니언 성수",
        location: "성수동",
        score: 9.6,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_95/1714807051138BmzpY_JPEG/IMG_4445.jpeg",
        matchReasons: ["공간", "분위기", "커피"],
        distance: "도보 12분",
      },
      {
        name: "모노클 커피",
        location: "성수동",
        score: 9.4,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_163/1714807049207a0P7V_JPEG/IMG_4447.jpeg",
        matchReasons: ["작업공간", "라떼", "감성"],
        distance: "도보 8분",
      },
      {
        name: "카페 베란다",
        location: "마포구",
        score: 8.8,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_210/17148070508969wvQS_JPEG/IMG_4448.jpeg",
        matchReasons: ["분위기", "커피", "조용함"],
        distance: "차로 15분",
      },
    ],
  },
  {
    id: 2,
    name: "박민준",
    avatarColor: "bg-sky-400",
    matchScore: 88,
    cafes: [
      {
        name: "르뱅 베이커리",
        location: "강남",
        score: 9.1,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_8/17148070456372KBC1_JPEG/IMG_4465.jpeg",
        matchReasons: ["베이커리", "케이크", "가격"],
        distance: "지하철 20분",
      },
      {
        name: "노티드 도넛 청담",
        location: "청담",
        score: 9.2,
        imageUrl: "https://ldb-phinf.pstatic.net/20250513_211/1747135975557TJSg8_JPEG/420478343_18082663858418171_6772008662502872835_n.jpg",
        matchReasons: ["디저트", "인테리어", "데이트"],
        distance: "차로 18분",
      },
      {
        name: "블루보틀 홍대",
        location: "홍대",
        score: 8.7,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_54/1714807042077mWBjY_JPEG/IMG_4460.jpeg",
        matchReasons: ["커피", "작업", "브랜드"],
        distance: "지하철 25분",
      },
    ],
  },
  {
    id: 3,
    name: "이수아",
    avatarColor: "bg-rose-400",
    matchScore: 83,
    cafes: [
      {
        name: "카페 식물관",
        location: "연남동",
        score: 9.0,
        imageUrl: "https://ldb-phinf.pstatic.net/20250513_296/1747135912549DLgc6_JPEG/482610228_1318736439173579_8954953484364667380_n.jpg",
        matchReasons: ["플랜테리어", "감성", "서비스"],
        distance: "도보 20분",
      },
      {
        name: "테라로사 이태원",
        location: "이태원",
        score: 8.9,
        imageUrl: "https://ldb-phinf.pstatic.net/20250513_11/17471359509469AAJf_JPEG/%C3%CA%C4%DA%BC%B3%B1%E2.jpg",
        matchReasons: ["말차", "로스터리", "서비스"],
        distance: "차로 22분",
      },
      {
        name: "어니언 성수",
        location: "성수동",
        score: 9.6,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_122/1714807051280g1Gjp_JPEG/IMG_4457.jpeg",
        matchReasons: ["분위기", "공간", "감성"],
        distance: "도보 12분",
      },
    ],
  },
  {
    id: 4,
    name: "최현석",
    avatarColor: "bg-emerald-400",
    matchScore: 79,
    cafes: [
      {
        name: "망원 로스터즈",
        location: "망원동",
        score: 8.5,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_247/1714807046611B45hh_JPEG/IMG_4479.jpeg",
        matchReasons: ["핸드드립", "싱글오리진", "로컬"],
        distance: "도보 5분",
      },
      {
        name: "프릳츠 커피",
        location: "도화동",
        score: 9.3,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_3/1714807393306BL3tN_JPEG/IMG_4484.jpeg",
        matchReasons: ["스페셜티", "핸드드립", "공간"],
        distance: "도보 18분",
      },
      {
        name: "블루보틀 홍대",
        location: "홍대",
        score: 8.7,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_52/17148073934049ctTD_JPEG/IMG_4486.jpeg",
        matchReasons: ["커피", "싱글오리진", "넓은 공간"],
        distance: "지하철 15분",
      },
    ],
  },
  {
    id: 5,
    name: "정나래",
    avatarColor: "bg-amber-400",
    matchScore: 76,
    cafes: [
      {
        name: "노티드 도넛 청담",
        location: "청담",
        score: 9.2,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_175/1714807026621OYfLK_JPEG/IMG_1936.jpeg",
        matchReasons: ["도넛", "디저트", "인테리어"],
        distance: "지하철 30분",
      },
      {
        name: "르뱅 베이커리",
        location: "강남",
        score: 9.1,
        imageUrl: "https://ldb-phinf.pstatic.net/20240504_273/1714807043180fYabu_JPEG/IMG_4441.jpeg",
        matchReasons: ["케이크", "베이커리", "감성"],
        distance: "지하철 25분",
      },
      {
        name: "카페 식물관",
        location: "연남동",
        score: 9.0,
        imageUrl: "https://ldb-phinf.pstatic.net/20250513_153/174713592878465nT2_JPEG/428699297_18085578916418171_3258172144866482615_n.jpg",
        matchReasons: ["플랜테리어", "분위기", "디저트"],
        distance: "도보 20분",
      },
    ],
  },
]

function CafeCard({ cafe }: { cafe: OverlapCafe }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex-shrink-0 w-56 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
      {/* 이미지 */}
      <div className="relative h-40 bg-secondary overflow-hidden">
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cafe.imageUrl}
            alt={cafe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <Coffee className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <button
          onClick={() => setSaved(v => !v)}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            saved ? "bg-rose-500 text-white" : "bg-black/30 text-white hover:bg-black/50"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${saved ? "fill-white" : ""}`} />
        </button>
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">{cafe.score}</span>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-3">
        <p className="font-semibold text-sm text-foreground mb-0.5">{cafe.name}</p>
        <div className="flex items-center gap-1 mb-2.5">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{cafe.location} · {cafe.distance}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {cafe.matchReasons.map(r => (
            <span key={r} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FriendCafeOverlapPanel() {
  const [selectedId, setSelectedId] = useState(1)
  const selected = FRIENDS_DATA.find(f => f.id === selectedId)!

  return (
    <section className="py-10 bg-secondary/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">

        {/* 헤더 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="h-3.5 w-3.5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">친구와 겹치는 카페</h2>
          </div>
          <p className="text-sm text-muted-foreground">두 사람의 취향을 모두 만족하는 AI 추천 카페예요</p>
        </div>

        {/* 친구 탭 선택 */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {FRIENDS_DATA.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              className={`flex items-center gap-2 flex-shrink-0 px-3.5 py-2 rounded-full border text-sm font-medium transition-all ${
                selectedId === f.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <div className={`w-5 h-5 ${f.avatarColor} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>
                {f.name[0]}
              </div>
              {f.name}
              <span className={`text-[10px] font-bold ${selectedId === f.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {f.matchScore}%
              </span>
            </button>
          ))}
        </div>

        {/* 선택된 친구 요약 */}
        <div className="flex items-center gap-3 mb-4 bg-card border border-border rounded-xl px-4 py-3">
          <div className={`w-9 h-9 ${selected.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
            {selected.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {selected.name}님과 <span className="text-primary">{selected.matchScore}% 취향 일치</span>
            </p>
            <p className="text-xs text-muted-foreground">아래 카페들은 두 분 모두 좋아할 확률이 높아요</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1">
            <Coffee className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">추천 {selected.cafes.length}곳</span>
          </div>
        </div>

        {/* 카페 카드 가로 스크롤 */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {selected.cafes.map(cafe => (
            <div key={cafe.name} className="snap-start">
              <CafeCard cafe={cafe} />
            </div>
          ))}

          {/* 더보기 카드 */}
          <div className="flex-shrink-0 w-56 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 p-4 snap-start">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Coffee className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              더 많은 공통 카페는<br />취향 설정 완료 후 확인 가능해요
            </p>
            <a href="/search" className="text-xs text-primary font-medium hover:underline">
              전체 카페 보기 →
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
