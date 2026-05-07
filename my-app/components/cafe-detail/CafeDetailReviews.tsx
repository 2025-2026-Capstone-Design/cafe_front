"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Review } from "@/lib/types"

interface Props {
  reviews: Review[]
  totalCount: number
}

export function CafeDetailReviews({ reviews, totalCount }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)

  if (reviews.length === 0) return null

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">리뷰</h2>
          <p className="text-sm text-muted-foreground mt-1">
            총 {(totalCount ?? 0).toLocaleString()}개 리뷰
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{review.author}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className={`text-sm text-foreground leading-relaxed ${expanded !== review.id ? "line-clamp-3" : ""}`}>
              {review.text}
            </p>
            {review.text.length > 120 && (
              <button
                className="text-sm text-primary hover:underline mt-1"
                onClick={() => setExpanded(expanded === review.id ? null : review.id)}
              >
                {expanded === review.id ? "접기" : "더보기"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <Button className="w-full" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          리뷰 작성하기
        </Button>
      </div>
    </div>
  )
}
