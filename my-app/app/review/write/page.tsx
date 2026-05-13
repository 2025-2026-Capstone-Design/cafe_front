"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Star, Camera, X, ChevronLeft, Info, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AspectKey, ASPECT_LABELS, ALL_ASPECTS } from "@/lib/types"

const ASPECT_ICONS: Record<AspectKey, string> = {
  coffee: "☕", bakery: "🥐", cake: "🎂", cookie: "🍪",
  bingsu: "🍧", dessert: "🍮", space: "🪑", vibe: "✨",
  service: "🤝", price: "💰", gift: "🎁", crowd: "🕐",
}

type AspectRating = "positive" | "negative" | "neutral" | null

function ReviewWriteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cafeId = searchParams.get("cafeId") || ""
  const cafeName = searchParams.get("cafeName") || "카페"

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [aspectRatings, setAspectRatings] = useState<Record<AspectKey, AspectRating>>(
    Object.fromEntries(ALL_ASPECTS.map(a => [a, null])) as Record<AspectKey, AspectRating>
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAspectRating = (aspectId: AspectKey, value: AspectRating) => {
    setAspectRatings(prev => ({
      ...prev,
      [aspectId]: prev[aspectId] === value ? null : value,
    }))
  }

  const handleImageUpload = () => {
    const mockImages = [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200&h=200&fit=crop",
    ]
    if (images.length < 5) {
      setImages(prev => [...prev, mockImages[prev.length % 2]])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (rating === 0 || content.length < 10) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (cafeId) router.push(`/cafe/${cafeId}`)
    else router.push("/")
  }

  const positiveAspects = ALL_ASPECTS.filter(k => aspectRatings[k] === "positive")
  const negativeAspects = ALL_ASPECTS.filter(k => aspectRatings[k] === "negative")

  const ratingLabels = ["", "별로예요", "그저 그래요", "보통이에요", "좋아요", "최고예요!"]

  return (
    <div className="min-h-screen bg-background">
      {/* Sub Header */}
      <div className="sticky top-16 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-muted-foreground">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">뒤로</span>
          </button>
          <h1 className="font-semibold">리뷰 작성</h1>
          <Button
            size="sm"
            disabled={rating === 0 || content.length < 10 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "저장 중..." : "완료"}
          </Button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        {/* Cafe Info */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
            ☕
          </div>
          <div>
            <h2 className="font-semibold">{cafeName}</h2>
            {cafeId && (
              <Link href={`/cafe/${cafeId}`} className="text-xs text-primary hover:underline">
                카페 상세 보기
              </Link>
            )}
          </div>
        </div>

        {/* Overall Rating */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">전체 평점</h3>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {ratingLabels[hoverRating || rating] || "별점을 선택해주세요"}
          </p>
        </div>

        {/* Aspect Ratings */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold">세부 평가</h3>
            <span className="text-xs text-muted-foreground">(선택사항)</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              각 항목을 평가해주세요
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ALL_ASPECTS.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <span className="text-xs flex items-center gap-1">
                    <span>{ASPECT_ICONS[key]}</span>
                    <span className="truncate max-w-[60px]">{ASPECT_LABELS[key].split('/')[0]}</span>
                  </span>
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => handleAspectRating(key, "positive")}
                      className={`p-1 rounded transition-colors ${
                        aspectRatings[key] === "positive"
                          ? "bg-emerald-500 text-white"
                          : "hover:bg-emerald-500/20 text-muted-foreground"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAspectRating(key, "neutral")}
                      className={`p-1 rounded transition-colors ${
                        aspectRatings[key] === "neutral"
                          ? "bg-muted-foreground text-white"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAspectRating(key, "negative")}
                      className={`p-1 rounded transition-colors ${
                        aspectRatings[key] === "negative"
                          ? "bg-rose-500 text-white"
                          : "hover:bg-rose-500/20 text-muted-foreground"
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(positiveAspects.length > 0 || negativeAspects.length > 0) && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">선택한 평가</p>
                <div className="flex flex-wrap gap-2">
                  {positiveAspects.map(key => (
                    <Badge key={key} className="bg-emerald-500/10 text-emerald-600 text-xs">
                      {ASPECT_ICONS[key]} {ASPECT_LABELS[key].split('/')[0]}
                    </Badge>
                  ))}
                  {negativeAspects.map(key => (
                    <Badge key={key} className="bg-rose-500/10 text-rose-600 text-xs">
                      {ASPECT_ICONS[key]} {ASPECT_LABELS[key].split('/')[0]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">리뷰 내용</h3>
          <Textarea
            placeholder="이 카페는 어떠셨나요? 자세한 경험을 공유해주세요. (최소 10자)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none"
          />
          <div className="flex justify-between mt-2">
            <p className={`text-xs ${content.length < 10 ? "text-muted-foreground" : "text-emerald-600"}`}>
              {content.length < 10 ? `최소 10자 이상 (${content.length}/10)` : `${content.length}자`}
            </p>
            <p className="text-xs text-muted-foreground">AI가 리뷰를 분석하여 측면별 감성을 자동으로 태깅합니다</p>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">
            사진 첨부 <span className="text-muted-foreground font-normal text-sm">(최대 5장)</span>
          </h3>
          <div className="flex gap-3 flex-wrap">
            {images.map((img, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                onClick={handleImageUpload}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors"
              >
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{images.length}/5</span>
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 rounded-xl p-4 mb-8">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            좋은 리뷰 작성 팁
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 구체적인 경험을 공유하면 다른 사용자에게 도움이 됩니다</li>
            <li>• 음료, 디저트, 분위기 등 다양한 측면을 언급해주세요</li>
            <li>• 사진과 함께라면 더 신뢰도 높은 리뷰가 됩니다</li>
          </ul>
        </div>
      </main>

      {/* Mobile Fixed Bottom */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          className="w-full"
          disabled={rating === 0 || content.length < 10 || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "저장 중..." : "리뷰 등록하기"}
        </Button>
      </div>
    </div>
  )
}

export default function ReviewWritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">로딩 중...</div>}>
      <ReviewWriteContent />
    </Suspense>
  )
}
