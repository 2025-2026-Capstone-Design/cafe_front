"use client"

import { useState } from "react"
import { Star, PenLine, ThumbsUp } from "lucide-react"
import { Review } from "@/lib/types"
import { MOCK_REVIEWS } from "@/lib/mockReviews"
import Link from "next/link"

interface Props {
  reviews: Review[]
  totalCount: number
  cafeId: string
  cafeName: string
}

const AVATAR_COLORS = [
  "bg-violet-300", "bg-sky-300", "bg-rose-300",
  "bg-emerald-300", "bg-amber-300", "bg-pink-300",
]

export function CafeDetailReviews({ reviews, totalCount, cafeId, cafeName }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [helpfulIds, setHelpfulIds] = useState<Set<number>>(new Set())

  const displayReviews = reviews.length > 0
    ? reviews
    : process.env.NODE_ENV === "development" ? MOCK_REVIEWS : []

  const toggleHelpful = (id: number) => {
    setHelpfulIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">방문 후기</h2>
          <p className="text-xs text-muted-foreground mt-0.5">총 {(totalCount ?? 0).toLocaleString()}개</p>
        </div>
        <Link
          href={`/review/write?cafeId=${cafeId}&cafeName=${encodeURIComponent(cafeName)}`}
          className="flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground px-3.5 py-2 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <PenLine className="h-3.5 w-3.5" />
          리뷰 쓰기
        </Link>
      </div>

      {displayReviews.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          <p className="text-sm">아직 리뷰가 없어요</p>
          <p className="text-xs mt-1">첫 번째 리뷰를 남겨보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayReviews.map((review, idx) => {
            const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]
            const isExpanded = expandedId === review.id
            const isHelpful = helpfulIds.has(review.id)
            const isLong = review.text.length > 100

            return (
              <div key={review.id} className="p-4 rounded-xl border border-border">
                {/* 유저 + 별점 */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {review.author.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{review.author}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`h-3 w-3 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                        ))}
                      </div>
                      {review.date && <span className="text-xs text-muted-foreground">{review.date}</span>}
                    </div>
                  </div>
                </div>

                {/* 본문 */}
                <p className={`text-sm text-foreground leading-relaxed ${!isExpanded && isLong ? "line-clamp-3" : ""}`}>
                  {review.text}
                </p>
                {isLong && (
                  <button
                    className="text-xs text-primary mt-1 hover:underline"
                    onClick={() => setExpandedId(isExpanded ? null : review.id)}
                  >
                    {isExpanded ? "접기" : "더보기"}
                  </button>
                )}

                {/* 도움이 됐어요 */}
                <div className="flex justify-end mt-2.5">
                  <button
                    onClick={() => toggleHelpful(review.id)}
                    className={`flex items-center gap-1 text-xs rounded-full px-2.5 py-1 transition-colors ${
                      isHelpful ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${isHelpful ? "fill-primary" : ""}`} />
                    도움이 됐어요
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
