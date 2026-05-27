"use client"

import { useState } from "react"
import { Tag } from "lucide-react"

interface MenuItem {
  name: string
  price: string
  description: string
  images: string[]
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: "NEW두바이쫀득쿠키",
    price: "4,500",
    description: "100% 피스타치오 스프레드의 고소함, 마시멜로우로 만든 쫀득한 초코 쫀득피, 카타이프 조화",
    images: ["https://ldb-phinf.pstatic.net/20251125_60/1764075571317cWXB4_PNG/68724.jpg.png"],
  },
  {
    name: "고짠 고짠 소금빵",
    price: "3,800",
    description: "누적판매 25만개 이상. 본노엘 시그니쳐 소금빵. 1인당 5개 구매제한 제품.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_230/17420333151139MTEI_JPEG/%BC%D2%B1%DD%BB%A7.jpg",
      "https://ldb-phinf.pstatic.net/20250315_45/1742033299005mpa8i_JPEG/%BC%D2%B1%DD%BB%A7%A4%B8.jpg",
    ],
  },
  {
    name: "겉바 속촉 앙버터",
    price: "5,500",
    description: "누적판매 40만개 이상. 본노엘 시그니쳐 앙버터. 고메버터와 팥앙금의 환상의 조합.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_162/1742033686373SmBsL_JPEG/%BE%D3%B9%F6%C5%CD.jpg",
      "https://ldb-phinf.pstatic.net/20250315_111/1742033607850k8CT8_JPEG/%BE%D3%B9%F6%C5%CD.jpg",
    ],
  },
  {
    name: "프리미엄 생딸기케이크",
    price: "38,000~48,000",
    description: "시즌 종료 임박. 100% 동물성 생크림 + 생딸기를 듬뿍 넣어서 11년째 꾸준히 사랑받는 케이크.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_292/1742033543535YnlBI_JPEG/%B5%FE%B1%E2%C4%C9%C0%CC%C5%A9.jpg",
      "https://ldb-phinf.pstatic.net/20241204_105/1733324373609fpGze_JPEG/1733321013614.jpg",
    ],
  },
  {
    name: "고메버터 프레첼",
    price: "5,500",
    description: "개그우먼 홍윤화도 극찬한 단골 메뉴. '유민상의 배고픈 라디오'에 소개된 그 빵.",
    images: ["https://ldb-phinf.pstatic.net/20250315_178/1742033765744meP7P_JPEG/%C7%C1%B7%B9%C3%BF.jpg"],
  },
  {
    name: "밤식빵",
    price: "6,500",
    description: "압도적 1위 식빵! NO우유. 매일 만드는 수제 비스켓이 토핑으로 올라간 부드러운 대표 식빵.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_163/1742034012736XRbD4_JPEG/1716523935914.jpg",
      "https://ldb-phinf.pstatic.net/20250315_71/1742034013936ez9oj_JPEG/1716523935958.jpg",
    ],
  },
  {
    name: "보틀 생딸기 케이크",
    price: "6,000",
    description: "인당 구매제한 1개. 동물성 100% 생크림 + 생과일 딸기를 듬뿍 넣어서 매일 만들어요.",
    images: ["https://ldb-phinf.pstatic.net/20250315_90/1742035814126x5A4f_JPEG/1733655695264-5.jpg"],
  },
  {
    name: "바스크 치즈케이크",
    price: "7,000",
    description: "바닐라빈을 넣어 만든 수제 케이크. 시원하게 드시면 더 맛있어요.",
    images: ["https://ldb-phinf.pstatic.net/20250315_5/1742037277888Tw1GY_JPEG/1715943598673.jpg"],
  },
  {
    name: "발로나 초코소금빵",
    price: "4,300",
    description: "최고급 발로나 초콜릿. 소금빵에 초코를 전체 코팅하여 달짠달짠의 대표 메뉴.",
    images: ["https://ldb-phinf.pstatic.net/20250315_242/1742036779752hLMrW_JPEG/1715943602293.jpg"],
  },
  {
    name: "모카 소금빵",
    price: "4,300",
    description: "재구매율 99%. 추억의 로티보이 모카번이 연상되어 남녀노소 인기 만점.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_165/1742034890247hrb74_JPEG/1722350741489.jpg",
      "https://ldb-phinf.pstatic.net/20250315_152/1742034880776XX2YA_JPEG/1722350741424.jpg",
    ],
  },
  {
    name: "치즈 치아바타",
    price: "4,500",
    description: "",
    images: ["https://ldb-phinf.pstatic.net/20250315_138/1742040512130W20pq_JPEG/%C4%A1%C1%EE%C4%A1%BE%C6.jpg"],
  },
  {
    name: "우유식빵",
    price: "5,500",
    description: "본노엘 대표 식빵. 우유로 반죽하여 부드럽고 촉촉해서 잼을 발라 드셔도 좋아요.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_98/17420353052786YkR9_JPEG/1724661227318.jpg",
      "https://ldb-phinf.pstatic.net/20250315_88/1742035289203BJtfo_JPEG/1724661227249.jpg",
    ],
  },
  {
    name: "쌀식빵 (NO밀가루)",
    price: "5,000",
    description: "밀가루를 잘 소화시키지 못하는 분을 위한 식빵. NO 밀가루, 우유, 계란.",
    images: ["https://ldb-phinf.pstatic.net/20250315_125/1742036214704TmUzq_JPEG/1716523937255.jpg"],
  },
  {
    name: "단호박 쉬폰케이크",
    price: "8,000",
    description: "",
    images: ["https://ldb-phinf.pstatic.net/20250315_187/1742040456864lGTN9_JPEG/1732689387159-1.jpg"],
  },
  {
    name: "무화과 깜빠뉴",
    price: "6,500",
    description: "천연 발효종. 직접 키운 발효종과 와인에 절인 무화과, 호두, 건포도를 넣었어요.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_226/17420363147011K5Gm_JPEG/1715943627162.jpg",
      "https://ldb-phinf.pstatic.net/20250315_209/1742036314757Xlz99_JPEG/1715943627569.jpg",
    ],
  },
  {
    name: "엔젤 쉬폰케이크",
    price: "8,000",
    description: "쌀로 만든 쉬폰케이크.",
    images: ["https://ldb-phinf.pstatic.net/20250315_170/17420404093593xida_JPEG/cu1722354408490.jpg"],
  },
  {
    name: "싼딸기 바게트",
    price: "6,000",
    description: "봄 신메뉴.",
    images: ["https://ldb-phinf.pstatic.net/20250315_172/17420403848882lFmP_JPEG/1741768447357.jpg"],
  },
  {
    name: "완두 앙금빵",
    price: "2,500",
    description: "촉촉한 완두 앙금빵.",
    images: ["https://ldb-phinf.pstatic.net/20250315_251/1742040349458dXNt6_JPEG/1736742546589-3.jpg"],
  },
  {
    name: "동글동글 모닝빵",
    price: "3,500",
    description: "",
    images: ["https://ldb-phinf.pstatic.net/20250315_42/1742040334122hYnNr_JPEG/1716225483281.jpg"],
  },
  {
    name: "전통 카스테라",
    price: "6,000",
    description: "",
    images: ["https://ldb-phinf.pstatic.net/20250315_48/1742040318256IDIAI_JPEG/1716225483236.jpg"],
  },
  {
    name: "롤 카스테라",
    price: "6,000",
    description: "쌀로 만든 롤 카스테라.",
    images: ["https://ldb-phinf.pstatic.net/20250315_117/1742040300438TsKih_JPEG/1716225483198.jpg"],
  },
  {
    name: "휘낭시에",
    price: "4,500",
    description: "고메버터로 만든 휘낭시에.",
    images: ["https://ldb-phinf.pstatic.net/20250315_176/1742040273892DJYLL_JPEG/1741768268874-6.jpg"],
  },
  {
    name: "초코 휘낭시에",
    price: "4,500",
    description: "고메버터로 만든 초코 휘낭시에.",
    images: ["https://ldb-phinf.pstatic.net/20250315_172/1742040235269wM5eq_JPEG/1741768268874-8.jpg"],
  },
  {
    name: "비건 바게트",
    price: "2,500",
    description: "비건 바게트.",
    images: [
      "https://ldb-phinf.pstatic.net/20250315_206/1742040220757umstQ_JPEG/1741768268874-1.jpg",
      "https://ldb-phinf.pstatic.net/20250315_295/1742040220652tdPj6_JPEG/1741768268874-2.jpg",
    ],
  },
]

// BEST/NEW/시즌 뱃지 파싱
function getBadge(name: string): { label: string; color: string } | null {
  if (name.startsWith("NEW")) return { label: "NEW", color: "bg-violet-500 text-white" }
  if (name.includes("BEST")) return { label: "BEST", color: "bg-amber-500 text-white" }
  if (name.includes("한정메뉴") || name.includes("시즌") || name.includes("봄")) return { label: "시즌", color: "bg-rose-500 text-white" }
  return null
}

function MenuCard({ item }: { item: MenuItem }) {
  const [imgFailed, setImgFailed] = useState(false)
  const badge = getBadge(item.name)
  const cleanName = item.name
    .replace(/^NEW\s*/i, "")
    .replace(/^BEST\.\s*/i, "")
    .replace(/\[.*?\]/g, "")
    .trim()

  return (
    <div className="flex gap-3 py-3.5 border-b border-border last:border-b-0">
      {/* 이미지 */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0 relative">
        {!imgFailed && item.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.images[0]}
            alt={cleanName}
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl bg-secondary">🍞</div>
        )}
        {badge && (
          <span className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <p className="text-sm font-semibold text-foreground leading-snug">{cleanName}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
        )}
        <p className="text-sm font-bold text-foreground mt-0.5">{item.price}원</p>
      </div>
    </div>
  )
}

const SHOW_COUNT = 6

export function CafeDetailMenu() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? MENU_ITEMS : MENU_ITEMS.slice(0, SHOW_COUNT)

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Tag className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">메뉴</h2>
        <span className="text-xs text-muted-foreground ml-auto">{MENU_ITEMS.length}개</span>
      </div>

      <div className="divide-y-0">
        {visible.map((item, i) => (
          <MenuCard key={i} item={item} />
        ))}
      </div>

      {MENU_ITEMS.length > SHOW_COUNT && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full mt-2 py-2.5 text-sm font-medium text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
        >
          {expanded ? "접기" : `메뉴 전체보기 (${MENU_ITEMS.length - SHOW_COUNT}개 더)`}
        </button>
      )}
    </div>
  )
}
