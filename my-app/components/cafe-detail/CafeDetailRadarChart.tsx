"use client"

import { AspectKey, ASPECT_LABELS } from "@/lib/types"

const ASPECT_META: Partial<Record<AspectKey, { emoji: string; shortLabel: string }>> = {
  coffee:  { emoji: "☕", shortLabel: "커피" },
  bakery:  { emoji: "🥐", shortLabel: "베이커리" },
  cake:    { emoji: "🍰", shortLabel: "케이크" },
  cookie:  { emoji: "🍪", shortLabel: "쿠키" },
  bingsu:  { emoji: "🍧", shortLabel: "빙수" },
  dessert: { emoji: "🍮", shortLabel: "디저트" },
  space:   { emoji: "💻", shortLabel: "작업공간" },
  vibe:    { emoji: "✨", shortLabel: "분위기" },
  service: { emoji: "🤝", shortLabel: "친절 서비스" },
  price:   { emoji: "💰", shortLabel: "가성비" },
  gift:    { emoji: "🎁", shortLabel: "굿즈" },
  crowd:   { emoji: "🕐", shortLabel: "조용함" },
}

const PERSONA_MAP: Partial<Record<AspectKey, { emoji: string; label: string }>> = {
  space:   { emoji: "💻", label: "혼자 작업하러" },
  vibe:    { emoji: "📸", label: "감성 사진 찍으러" },
  cake:    { emoji: "🍰", label: "달달한 디저트 먹으러" },
  coffee:  { emoji: "☕", label: "커피 한 잔 하러" },
  service: { emoji: "👫", label: "친구랑 수다 떨러" },
  price:   { emoji: "💸", label: "가성비 좋은 카페 찾는 분" },
  crowd:   { emoji: "🧘", label: "조용히 쉬러" },
  bakery:  { emoji: "🥐", label: "빵 맛집 찾는 분" },
}

interface Props {
  aspectScores: Record<AspectKey, number>
  compact?: boolean
}

export function CafeDetailRadarChart({ aspectScores, compact = false }: Props) {
  const entries = (Object.entries(aspectScores ?? {}) as [AspectKey, number][])
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)

  if (entries.length === 0) return null

  const top = entries.slice(0, compact ? 4 : 6)
  const personas = entries
    .slice(0, 3)
    .map(([key]) => PERSONA_MAP[key])
    .filter(Boolean) as { emoji: string; label: string }[]

  if (compact) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-3">이 카페의 강점</p>
        <div className="flex flex-wrap gap-2">
          {top.map(([key]) => {
            const meta = ASPECT_META[key]
            return (
              <span key={key} className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1.5 text-sm">
                <span>{meta?.emoji ?? "•"}</span>
                <span className="text-foreground font-medium">{meta?.shortLabel ?? ASPECT_LABELS[key]}</span>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl p-5 border border-border flex flex-col gap-5">
      {/* 이 카페는 */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3">이 카페는 이런 곳이에요</h2>
        <div className="flex flex-wrap gap-2">
          {top.map(([key]) => {
            const meta = ASPECT_META[key]
            return (
              <div key={key} className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
                <span className="text-lg">{meta?.emoji ?? "•"}</span>
                <span className="text-sm font-medium text-foreground">{meta?.shortLabel ?? ASPECT_LABELS[key]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 이런 분께 추천 */}
      {personas.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h2 className="text-base font-bold text-foreground mb-3">이런 분께 추천해요</h2>
          <div className="flex flex-col gap-2">
            {personas.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-base flex-shrink-0">
                  {p.emoji}
                </div>
                <span className="text-sm text-foreground">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
