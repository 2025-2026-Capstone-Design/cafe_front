import { Cafe, AspectKey, ASPECT_LABELS } from "@/lib/types"

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

interface Props { cafe: Cafe }

export function CafeDetailSidebar({ cafe }: Props) {
  const activeAspects = (Object.entries(cafe.aspectScores ?? {}) as [AspectKey, number][])
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)

  return (
    <div className="space-y-6">
      {/* Amenities */}
      {cafe.amenities && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">편의시설</h2>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(AMENITY_META).map(([key, { label, icon: Icon }]) => {
              const active = cafe.amenities[key as keyof typeof cafe.amenities]
              return (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground/40"
                  }`}>
                    <Icon />
                  </div>
                  <span className={`text-[10px] text-center ${active ? "text-foreground" : "text-muted-foreground/40"}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Top Keywords */}
      {(cafe.topKeywords?.length ?? 0) > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">인기 키워드</h2>
          <div className="flex flex-wrap gap-2">
            {cafe.topKeywords!.map(k => (
              <span key={k.keyword} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {k.keyword}
                <span className="ml-1 opacity-60">{k.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Aspect Bars */}
      {activeAspects.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">측면별 분석</h2>
          <div className="space-y-3">
            {activeAspects.map(([key, score]) => {
              const color = score >= 70 ? "bg-green-400" : score >= 40 ? "bg-yellow-400" : "bg-red-400"
              const kws = cafe.keywords?.[key] ?? []
              const total = kws.reduce((s, k) => s + k.count, 0)
              const posP = total > 0 ? kws.filter(k => k.sentiment === "pos").reduce((s, k) => s + k.count, 0) / total : 0
              const negP = total > 0 ? kws.filter(k => k.sentiment === "neg").reduce((s, k) => s + k.count, 0) / total : 0
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">{ASPECT_LABELS[key]}</span>
                    <span className="text-xs font-medium">{score}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
                  </div>
                  {total > 0 && (
                    <div className="flex gap-2 mt-0.5">
                      {posP > 0 && <span className="text-[10px] text-green-600">긍정 {Math.round(posP * 100)}%</span>}
                      {negP > 0 && <span className="text-[10px] text-red-500">부정 {Math.round(negP * 100)}%</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Keywords per aspect */}
      {activeAspects.filter(([k]) => (cafe.keywords?.[k]?.length ?? 0) > 0).length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">키워드</h2>
          <div className="space-y-4">
            {activeAspects
              .filter(([k]) => (cafe.keywords?.[k]?.length ?? 0) > 0)
              .map(([key]) => (
                <div key={key}>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{ASPECT_LABELS[key]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cafe.keywords![key]!.map(kw => (
                      <span key={kw.text} className={`text-xs px-2 py-0.5 rounded-full border ${
                        kw.sentiment === "pos"
                          ? "bg-green-50 text-green-800 border-green-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}>
                        {kw.text} <span className="opacity-50">{kw.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
