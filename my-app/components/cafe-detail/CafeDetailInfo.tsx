"use client"

import { Star, MapPin, Heart, Share2, Clock } from "lucide-react"
import { Cafe } from "@/lib/types"

interface Props {
  cafe: Cafe
  bookmarked: boolean
  onBookmark: () => void
}

export function CafeDetailInfo({ cafe, bookmarked, onBookmark }: Props) {
  const starRating = (cafe.score / 20).toFixed(1)
  const tags = cafe.topKeywords?.slice(0, 5).map(k => k.keyword) ?? []

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      {/* 이름 + 액션 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground leading-tight">{cafe.name}</h1>
          {cafe.isOpen !== undefined && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={`w-2 h-2 rounded-full ${cafe.isOpen ? "bg-emerald-500" : "bg-rose-400"}`} />
              <span className={`text-sm font-medium ${cafe.isOpen ? "text-emerald-600" : "text-rose-500"}`}>
                {cafe.isOpen ? "영업 중" : "영업 종료"}
              </span>
              {cafe.isOpen && (
                <span className="text-xs text-muted-foreground flex items-center gap-1 ml-1">
                  <Clock className="w-3 h-3" /> 오늘 22:00 마감
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onBookmark}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              bookmarked
                ? "bg-rose-50 border-rose-300 text-rose-500"
                : "border-border text-muted-foreground hover:border-rose-300 hover:text-rose-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${bookmarked ? "fill-rose-500" : ""}`} />
          </button>
          <button className="w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 별점 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Star
              key={i}
              className={`h-4 w-4 ${i <= Math.round(Number(starRating)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
        <span className="font-bold text-foreground">{starRating}</span>
        <span className="text-sm text-muted-foreground">리뷰 {(cafe.reviewCount ?? 0).toLocaleString()}개</span>
      </div>

      {/* 태그 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 bg-secondary rounded-full text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 주소 */}
      <div className="flex items-start gap-2.5 pt-3 border-t border-border">
        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-foreground">{cafe.address}</p>
          <button
            onClick={() => navigator.clipboard.writeText(cafe.address).catch(() => {})}
            className="text-xs text-primary hover:underline mt-0.5"
          >
            주소 복사
          </button>
        </div>
      </div>
    </div>
  )
}
