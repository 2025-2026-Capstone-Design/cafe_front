'use client'
import { ReactNode, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MOCK_CAFES } from '@/lib/mockData'
import { Cafe, ASPECT_LABELS, ALL_ASPECTS } from '@/lib/types'
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks'
import RadarChart from '@/components/RadarChart'
import { MOCK_REVIEWS, Review } from '@/lib/mockReviews'
import { getCafeDetail } from '@/lib/api'
import { mapDetail } from '@/lib/mappers'

interface AmenityMeta {
  label: string
  icon: ReactNode
}

// 아이콘 함수들 먼저 정의 후 이 객체 선언
const AMENITY_META: Record<string, AmenityMeta> = {
  parking:     { label: '주차',     icon: <ParkingIcon /> },
  wifi:        { label: 'Wi-Fi',    icon: <WifiIcon /> },
  outlet:      { label: '콘센트',   icon: <OutletIcon /> },
  pet:         { label: '반려동물', icon: <PetIcon /> },
  takeout:     { label: '포장',     icon: <TakeoutIcon /> },
  group:       { label: '단체',     icon: <GroupIcon /> },
  reservation: { label: '예약',     icon: <ReservationIcon /> },
  kids:        { label: '키즈',     icon: <KidsIcon /> },
}

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
        // API 리뷰를 Review 형식으로 변환
        const apiReviews: Review[] = detail.reviews.map((r, i) => ({
          id: r.id ?? i,
          author: r.userId ?? '익명',
          date: r.createdAt ? r.createdAt.slice(0, 10) : '',
          text: r.reviewText ?? '',
          rating: 4,
        }))
        setReviews(apiReviews)
      })
      .catch(() => {
        const fallback = MOCK_CAFES.find(c => c.id === cafeId) ?? null
        setCafe(fallback)
        if (fallback) {
          setBookmarked(isBookmarked(fallback.id))
          setReviews(MOCK_REVIEWS[fallback.id] ?? [])
        }
      })
      .finally(() => setLoading(false))
  }, [cafeId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!cafe) {
    return (
      <div className="flex items-center justify-center h-screen text-neutral-400 text-sm">
        카페를 찾을 수 없어요
      </div>
    )
  }

  const activeAspects = ALL_ASPECTS.filter(k => (cafe.aspectScores[k] ?? 0) > 0)

  const handleBookmark = () => {
    const next = toggleBookmark(cafe.id)
    setBookmarked(next)
  }

  return (
    <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 pb-8">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 pt-5 pb-4"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        뒤로
      </button>

      {/* 히어로 이미지 */}
      <div className="w-full h-52 rounded-2xl overflow-hidden bg-neutral-100 mb-5">
        {cafe.imageUrl ? (
          <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="24" rx="3" stroke="#d1d5db" strokeWidth="1.5"/>
              <circle cx="14" cy="17" r="3" fill="#d1d5db"/>
              <path d="M4 28l8-7 6 5 6-8 12 11" stroke="#d1d5db" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
        )}
      </div>

      {/* 카페명 + 메타 */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">{cafe.name}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{cafe.address}</p>
        </div>
        <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
          <div className="flex items-center gap-2">
            {cafe.score > 0 && (
              <span className="text-base font-semibold text-violet-700">{cafe.score}점</span>
            )}
            <button
              onClick={handleBookmark}
              aria-label={bookmarked ? '북마크 해제' : '북마크'}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24"
                fill={bookmarked ? '#3C3489' : 'none'}
                stroke={bookmarked ? '#3C3489' : '#9ca3af'}
                strokeWidth="1.6">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
            </button>
          </div>
          {cafe.isOpen !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${cafe.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-400'}`}>
              {cafe.isOpen ? '영업중' : '영업종료'}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-neutral-400 mb-6">리뷰 {cafe.reviewCount}개</p>

      {/* 편의시설 */}
      <Section title="편의시설">
        <div className="grid grid-cols-4 gap-y-3">
          {Object.entries(AMENITY_META).map(([key, { label, icon }]) => {
            const active = cafe.amenities[key as keyof typeof cafe.amenities]
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${active ? 'bg-violet-50 text-violet-700' : 'bg-neutral-100 text-neutral-300'}`}>
                  {icon}
                </div>
                <span className={`text-[10px] ${active ? 'text-neutral-700' : 'text-neutral-300'}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </Section>

      {/* topKeywords flat list (API data) */}
      {(cafe.topKeywords?.length ?? 0) > 0 && (
        <Section title="인기 키워드">
          <div className="flex flex-wrap gap-1.5">
            {cafe.topKeywords!.map(k => (
              <span key={k.keyword} className="text-xs px-2.5 py-1 rounded-full border bg-violet-50 text-violet-700 border-violet-200">
                {k.keyword}
                <span className="ml-1 opacity-50">{k.count}</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* ABSA 레이더 차트 */}
      {activeAspects.length > 0 && (
        <Section title="ABSA 분석 개요">
          <RadarChart scores={cafe.aspectScores} />
        </Section>
      )}

      {/* 측면별 점수 바 + 감성 비율 */}
      {activeAspects.length > 0 && (
        <Section title="측면별 분석">
          <div className="space-y-4">
            {activeAspects.map(key => {
              const score = cafe.aspectScores[key]
              const color = score >= 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-neutral-300' : 'bg-orange-400'
              const kws = cafe.keywords[key] ?? []
              const total = kws.reduce((s, k) => s + k.count, 0)
              const posP = total > 0 ? kws.filter(k => k.sentiment === 'pos').reduce((s, k) => s + k.count, 0) / total : 0
              const negP = total > 0 ? kws.filter(k => k.sentiment === 'neg').reduce((s, k) => s + k.count, 0) / total : 0
              const neuP = 1 - posP - negP
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-600">{ASPECT_LABELS[key]}</span>
                    <span className="text-xs font-medium text-neutral-500">{score}</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-1.5">
                    <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
                  </div>
                  {total > 0 && (
                    <>
                      <div className="flex h-1 rounded-full overflow-hidden gap-px">
                        {posP > 0 && <div className="bg-emerald-300" style={{ width: `${posP * 100}%` }} />}
                        {neuP > 0 && <div className="bg-neutral-200" style={{ width: `${neuP * 100}%` }} />}
                        {negP > 0 && <div className="bg-orange-300" style={{ width: `${negP * 100}%` }} />}
                      </div>
                      <div className="flex gap-2.5 mt-1">
                        {posP > 0 && <span className="text-[10px] text-emerald-600">긍정 {Math.round(posP * 100)}%</span>}
                        {negP > 0 && <span className="text-[10px] text-orange-500">부정 {Math.round(negP * 100)}%</span>}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* 측면별 키워드 */}
      {activeAspects.filter(k => (cafe.keywords[k]?.length ?? 0) > 0).length > 0 && (
        <Section title="키워드">
          <div className="space-y-4">
            {activeAspects
              .filter(k => (cafe.keywords[k]?.length ?? 0) > 0)
              .map(key => (
                <div key={key}>
                  <p className="text-[11px] font-medium text-neutral-400 mb-1.5">{ASPECT_LABELS[key]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cafe.keywords[key]!.map(kw => (
                      <span key={kw.text} className={`text-xs px-2.5 py-1 rounded-full border
                        ${kw.sentiment === 'pos'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-orange-50 text-orange-800 border-orange-200'}`}>
                        {kw.text}
                        <span className="ml-1 opacity-50">{kw.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* 리뷰 목록 */}
      {reviews.length > 0 && (
        <Section title={`리뷰 ${cafe.reviewCount.toLocaleString()}개`}>
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border border-neutral-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-[11px] font-medium text-violet-700">
                      {review.author.charAt(0)}
                    </div>
                    <span className="text-[12px] font-medium text-neutral-700">{review.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} width="10" height="10" viewBox="0 0 24 24"
                          fill={i < review.rating ? '#f59e0b' : 'none'}
                          stroke={i < review.rating ? '#f59e0b' : '#d1d5db'}
                          strokeWidth="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400">{review.date}</span>
                  </div>
                </div>
                <p className="text-[13px] text-neutral-600 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-neutral-900 mb-3">{title}</h2>
      {children}
    </div>
  )
}

function ParkingIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 17V7h4a3 3 0 010 6H9"/>
  </svg>
}
function WifiIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
  </svg>
}
function OutletIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9"/>
    <path d="M9 9v3m6-3v3M9 15a3 3 0 006 0"/>
  </svg>
}
function PetIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
    <path d="M8 14v.5A3.5 3.5 0 0011.5 18h1a3.5 3.5 0 003.5-3.5V14a2 2 0 00-2-2h-4a2 2 0 00-2 2z"/>
  </svg>
}
function TakeoutIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M6 2h12l2 7H4L6 2zM4 9v11a2 2 0 002 2h12a2 2 0 002-2V9"/>
    <path d="M9 14h6"/>
  </svg>
}
function GroupIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
}
function ReservationIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
}
function KidsIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v8m-4 0l1-4m6 4l-1-4M8 15l-2 4m8-4l2 4"/>
  </svg>
}
