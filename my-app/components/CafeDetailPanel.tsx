'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_CAFES } from '@/lib/mockData'
import { Cafe, AspectKey, ASPECT_LABELS, ALL_ASPECTS } from '@/lib/types'
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks'
import { getCafeDetail } from '@/lib/api'
import { mapDetail } from '@/lib/mappers'

interface Props { cafeId: string }

export default function CafeDetailPanel({ cafeId }: Props) {
  const router = useRouter()
  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCafeDetail(cafeId)
      .then(detail => {
        const mapped = mapDetail(detail)
        setCafe(mapped)
        setBookmarked(isBookmarked(mapped.id))
      })
      .catch(() => {
        const fallback = MOCK_CAFES.find(c => c.id === cafeId) ?? null
        setCafe(fallback)
        if (fallback) setBookmarked(isBookmarked(fallback.id))
      })
      .finally(() => setLoading(false))
  }, [cafeId])

  if (loading) {
    return (
      <div className="px-3.5 py-8 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!cafe) return null

  const handleBookmark = () => {
    const next = toggleBookmark(cafe.id)
    setBookmarked(next)
  }

  const activeAspects = ALL_ASPECTS.filter((k: AspectKey) => (cafe.aspectScores[k] ?? 0) > 0)

  return (
    <div className="px-3.5 pb-8">
      {/* 카페명 + 메타 */}
      <div className="flex items-start justify-between py-3 border-b border-neutral-100 mb-3">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900">{cafe.name}</h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">{cafe.address}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">리뷰 {cafe.reviewCount}개</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
          <div className="flex items-center gap-1">
            {cafe.score > 0 && (
              <span className="text-sm font-semibold text-violet-700">{cafe.score}점</span>
            )}
            <button
              onClick={handleBookmark}
              aria-label={bookmarked ? '북마크 해제' : '북마크'}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={bookmarked ? '#3C3489' : 'none'}
                stroke={bookmarked ? '#3C3489' : '#9ca3af'}
                strokeWidth="1.6">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
            </button>
          </div>
          {cafe.isOpen !== undefined && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
              ${cafe.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-400'}`}>
              {cafe.isOpen ? '영업중' : '영업종료'}
            </span>
          )}
        </div>
      </div>

      {/* 상세페이지 이동 버튼 */}
      <button
        onClick={() => router.push(`/cafe/${cafe.id}`)}
        className="w-full py-2 mb-4 rounded-lg border border-violet-200 text-[12px] text-violet-700 hover:bg-violet-50 transition-colors"
      >
        상세페이지 보기 →
      </button>

      {/* 편의시설 */}
      <p className="text-[11px] font-semibold text-neutral-700 mb-2">편의시설</p>
      <div className="grid grid-cols-4 gap-y-2 mb-4">
        {Object.entries(AMENITY_LABELS).map(([key, label]) => {
          const active = cafe.amenities[key as keyof typeof cafe.amenities]
          return (
            <div key={key} className="flex flex-col items-center gap-0.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[14px]
                ${active ? 'bg-violet-50' : 'bg-neutral-100 opacity-30'}`}>
                {AMENITY_ICONS[key]}
              </div>
              <span className={`text-[9px] ${active ? 'text-neutral-600' : 'text-neutral-300'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* topKeywords (flat list from API) */}
      {(cafe.topKeywords?.length ?? 0) > 0 && activeAspects.length === 0 && (
        <>
          <p className="text-[11px] font-semibold text-neutral-700 mb-2">키워드</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {cafe.topKeywords!.slice(0, 10).map(k => (
              <span key={k.keyword} className="text-[10px] px-2 py-0.5 rounded-full border bg-violet-50 text-violet-700 border-violet-200">
                {k.keyword} <span className="opacity-50">{k.count}</span>
              </span>
            ))}
          </div>
        </>
      )}

      {/* 측면 점수 */}
      {activeAspects.length > 0 && (
        <>
          <p className="text-[11px] font-semibold text-neutral-700 mb-2">측면별 분석</p>
          <div className="space-y-2 mb-4">
            {activeAspects.map(key => {
              const score = cafe.aspectScores[key]
              const color = score >= 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-neutral-300' : 'bg-orange-400'
              return (
                <div key={key}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[11px] text-neutral-600">{ASPECT_LABELS[key]}</span>
                    <span className="text-[11px] text-neutral-400">{score}</span>
                  </div>
                  <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }}/>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 측면별 키워드 */}
          {activeAspects.filter(k => (cafe.keywords[k]?.length ?? 0) > 0).length > 0 && (
            <>
              <p className="text-[11px] font-semibold text-neutral-700 mb-2">키워드</p>
              <div className="space-y-3">
                {activeAspects
                  .filter(k => (cafe.keywords[k]?.length ?? 0) > 0)
                  .map(key => (
                    <div key={key}>
                      <p className="text-[10px] text-neutral-400 mb-1">{ASPECT_LABELS[key]}</p>
                      <div className="flex flex-wrap gap-1">
                        {cafe.keywords[key]!.map(kw => (
                          <span key={kw.text} className={`text-[10px] px-2 py-0.5 rounded-full border
                            ${kw.sentiment === 'pos'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-orange-50 text-orange-800 border-orange-200'}`}>
                            {kw.text} <span className="opacity-40">{kw.count}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

const AMENITY_LABELS: Record<string, string> = {
  parking: '주차', wifi: 'Wi-Fi', outlet: '콘센트', pet: '반려동물',
  takeout: '포장', group: '단체', reservation: '예약', kids: '키즈',
}

const AMENITY_ICONS: Record<string, string> = {
  parking: 'P', wifi: 'W', outlet: '⚡', pet: '🐾',
  takeout: '📦', group: '👥', reservation: '📅', kids: '👶',
}
