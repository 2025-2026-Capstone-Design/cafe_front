'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Cafe, Review } from '@/lib/types'
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks'
import { getCafeDetail } from '@/lib/api'
import { mapDetail } from '@/lib/mappers'
import { Heart, Navigation, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CafeDetailGallery } from '@/components/cafe-detail/CafeDetailGallery'
import { CafeDetailInfo } from '@/components/cafe-detail/CafeDetailInfo'
import { CafeDetailRadarChart } from '@/components/cafe-detail/CafeDetailRadarChart'
import { CafeDetailReviews } from '@/components/cafe-detail/CafeDetailReviews'
import { CafeDetailSidebar } from '@/components/cafe-detail/CafeDetailSidebar'
import { HomeFooter } from '@/components/HomeFooter'

export default function CafeDetailPage() {
  const { id } = useParams()
  const cafeId = Array.isArray(id) ? id[0] : (id ?? '')
  const router = useRouter()
  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCafeDetail(cafeId)
      .then(detail => {
        const mapped = mapDetail(detail)
        setCafe(mapped)
        setBookmarked(isBookmarked(mapped.id))
        const rawReviews = Array.isArray(detail.reviews?.reviews) ? detail.reviews.reviews : []
        const apiReviews: Review[] = rawReviews.map((r: { id?: number; userId?: number | string; createdAt?: string; reviewText?: string }, i: number) => ({
          id: r.id ?? i,
          author: r.userId != null ? String(r.userId) : '익명',
          date: r.createdAt ? r.createdAt.slice(0, 10) : '',
          text: r.reviewText ?? '',
          rating: 4,
        }))
        setReviews(apiReviews)
      })
      .catch(() => setCafe(null))
      .finally(() => setLoading(false))
  }, [cafeId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!cafe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-muted-foreground">카페를 찾을 수 없어요</p>
        <Button variant="outline" onClick={() => router.back()}>돌아가기</Button>
      </div>
    )
  }

  const handleBookmark = () => {
    const next = toggleBookmark(cafe)
    setBookmarked(next)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gallery */}
      <CafeDetailGallery imageUrl={cafe.imageUrl} name={cafe.name} />

      <div className="max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-8">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <CafeDetailInfo cafe={cafe} bookmarked={bookmarked} onBookmark={handleBookmark} />
            <CafeDetailRadarChart aspectScores={cafe.aspectScores} />
            <CafeDetailReviews reviews={reviews} totalCount={cafe.reviewCount ?? 0} cafeId={cafeId} cafeName={cafe.name} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CafeDetailSidebar cafe={cafe} />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 flex gap-3 md:hidden z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBookmark}
          className={bookmarked ? "text-red-500 border-red-500" : ""}
        >
          <Heart className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
        </Button>
        {cafe.lat && cafe.lon ? (
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => window.open(`https://maps.google.com/?q=${cafe.lat},${cafe.lon}`, '_blank')}
          >
            <Navigation className="h-4 w-4 mr-2" />
            길찾기
          </Button>
        ) : (
          <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        )}
      </div>

      <div className="hidden md:block">
        <HomeFooter />
      </div>
    </div>
  )
}
