import { Cafe } from "@/lib/types"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"

// ─── 편의시설 ────────────────────────────────────────────────────────────
interface AmenityItem { label: string; icon: () => React.ReactNode }

const AMENITY_META: Record<string, AmenityItem> = {
  parking:     { label: "주차",     icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg> },
  wifi:        { label: "Wi-Fi",    icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg> },
  outlet:      { label: "콘센트",   icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 9v3m6-3v3M9 15a3 3 0 006 0"/></svg> },
  pet:         { label: "반려동물", icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/><path d="M8 14v.5A3.5 3.5 0 0011.5 18h1a3.5 3.5 0 003.5-3.5V14a2 2 0 00-2-2h-4a2 2 0 00-2 2z"/></svg> },
  takeout:     { label: "포장",     icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2h12l2 7H4L6 2zM4 9v11a2 2 0 002 2h12a2 2 0 002-2V9"/><path d="M9 14h6"/></svg> },
  group:       { label: "단체",     icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  reservation: { label: "예약",     icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  kids:        { label: "키즈",     icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="2"/><path d="M12 7v8m-4 0l1-4m6 4l-1-4M8 15l-2 4m8-4l2 4"/></svg> },
}

// ─── 하드코딩 유사 카페 ──────────────────────────────────────────────────
const SIMILAR_CAFES = [
  { name: "어니언 성수", location: "성수동", score: 9.6, img: "https://ldb-phinf.pstatic.net/20240504_95/1714807051138BmzpY_JPEG/IMG_4445.jpeg" },
  { name: "모노클 커피", location: "성수동", score: 9.4, img: "https://ldb-phinf.pstatic.net/20240504_163/1714807049207a0P7V_JPEG/IMG_4447.jpeg" },
  { name: "카페 식물관", location: "연남동", score: 9.0, img: "https://ldb-phinf.pstatic.net/20250513_296/1747135912549DLgc6_JPEG/482610228_1318736439173579_8954953484364667380_n.jpg" },
]

interface Props { cafe: Cafe }

export function CafeDetailSidebar({ cafe }: Props) {
  const keywords = cafe.topKeywords?.slice(0, 10) ?? []

  return (
    <div className="flex flex-col gap-4">

      {/* 편의시설 */}
      {cafe.amenities && (
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="text-base font-bold text-foreground mb-4">편의시설</h2>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(AMENITY_META).map(([key, { label, icon: Icon }]) => {
              const active = cafe.amenities[key as keyof typeof cafe.amenities]
              return (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground/30"
                  }`}>
                    <Icon />
                  </div>
                  <span className={`text-[10px] text-center leading-tight ${active ? "text-foreground font-medium" : "text-muted-foreground/40"}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 인기 키워드 */}
      {keywords.length > 0 && (
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="text-base font-bold text-foreground mb-3">사람들이 많이 언급한 키워드</h2>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map(k => (
              <span key={k.keyword} className="text-xs px-2.5 py-1 bg-secondary rounded-full text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                #{k.keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 비슷한 카페 */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <h2 className="text-base font-bold text-foreground mb-3">비슷한 카페</h2>
        <div className="flex flex-col gap-3">
          {SIMILAR_CAFES.map(c => (
            <Link key={c.name} href="/search" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{c.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{c.location}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-amber-600">{c.score}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
