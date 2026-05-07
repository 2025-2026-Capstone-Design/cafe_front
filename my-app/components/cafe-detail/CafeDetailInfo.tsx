"use client"

import { Star, MapPin, Heart, Share2, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cafe } from "@/lib/types"

interface Props {
  cafe: Cafe
  bookmarked: boolean
  onBookmark: () => void
}

export function CafeDetailInfo({ cafe, bookmarked, onBookmark }: Props) {
  const starRating = (cafe.score / 20).toFixed(1)

  const tags = cafe.topKeywords?.slice(0, 4).map(k => k.keyword) ?? []

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cafe.address).catch(() => {})
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{cafe.name}</h1>
          {cafe.isOpen !== undefined && (
            <span className={`text-sm font-medium mt-1 inline-block ${cafe.isOpen ? "text-green-600" : "text-red-500"}`}>
              {cafe.isOpen ? "영업 중" : "영업 종료"}
            </span>
          )}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onBookmark}
            className={bookmarked ? "text-red-500 border-red-500 hover:text-red-600" : ""}
          >
            <Heart className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Ratings */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-lg">{starRating}</span>
          <span className="text-muted-foreground text-sm">({(cafe.reviewCount ?? 0).toLocaleString()}개 리뷰)</span>
        </div>
        {cafe.score > 0 && (
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <ThumbsUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">ABSA 긍정도 {cafe.score}%</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-sm">#{tag}</Badge>
          ))}
        </div>
      )}

      {/* Address */}
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-foreground">{cafe.address}</p>
          <button onClick={handleCopyAddress} className="text-sm text-primary hover:underline mt-1">
            주소 복사
          </button>
        </div>
      </div>
    </div>
  )
}
