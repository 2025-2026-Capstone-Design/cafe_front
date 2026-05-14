"use client"

import Link from "next/link"
import { Star, MapPin, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Cafe, AspectKey, ASPECT_LABELS } from "@/lib/types"

interface HomeCafeCardProps {
  cafe: Cafe
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop"

function getTags(cafe: Cafe): string[] {
  if (cafe.topKeywords && cafe.topKeywords.length > 0) {
    return cafe.topKeywords.slice(0, 3).map((k) => k.keyword)
  }
  return (Object.entries(cafe.aspectScores) as [AspectKey, number][])
    .filter(([, v]) => v > 60)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => ASPECT_LABELS[k].split("/")[0])
}

export function HomeCafeCard({ cafe }: HomeCafeCardProps) {
  const tags = getTags(cafe)
  const rating = (cafe.score / 20).toFixed(1)

  return (
    <Link
      href={`/cafe/${cafe.id}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={cafe.imageUrl || PLACEHOLDER}
          alt={cafe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-xs font-semibold text-primary">{cafe.score}%</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {cafe.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-foreground">{rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="text-xs line-clamp-1">{cafe.address}</span>
          <span className="text-xs">·</span>
          <span className="text-xs shrink-0">리뷰 {cafe.reviewCount.toLocaleString()}</span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
