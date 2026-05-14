'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cafe, AspectKey, ASPECT_LABELS, Keyword } from '@/lib/types'
import { getPreferences } from '@/lib/preferences'
import SearchBar from '@/components/SearchBar'
import FilterPanel, { KeywordId } from '@/components/FilterPanel'
import Link from 'next/link'
import { searchCafes, aspectsToVector } from '@/lib/api'
import { mapSearchItem } from '@/lib/mappers'
import { setCafeCache } from '@/lib/cafeCache'
import { HeroBanner } from '@/components/HeroBanner'
import { PromoBanners } from '@/components/PromoBanners'
import { HomeCategorySection } from '@/components/HomeCategorySection'
import { SecondaryBanners } from '@/components/SecondaryBanners'
import { HomeCafeListSection } from '@/components/HomeCafeListSection'
import { AbsaFeatureSection } from '@/components/AbsaFeatureSection'
import { ReviewAnalysisPreview } from '@/components/ReviewAnalysisPreview'
import { LocationBanner } from '@/components/LocationBanner'
import { HomeFooter } from '@/components/HomeFooter'

function getPopularKeywords(cafes: Cafe[], limit = 8): Keyword[] {
  const map = new Map<string, Keyword>()
  for (const cafe of cafes) {
    for (const kws of Object.values(cafe.keywords)) {
      for (const kw of kws ?? []) {
        const prev = map.get(kw.text)
        if (prev) {
          map.set(kw.text, { ...prev, count: prev.count + kw.count })
        } else {
          map.set(kw.text, { ...kw })
        }
      }
    }
  }
  return [...map.values()]
    .filter(k => k.sentiment === 'pos')
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedKeywords, setAppliedKeywords] = useState<KeywordId[]>([])
  const [preferences, setPreferences] = useState<AspectKey[]>([])
  const [apiCafes, setApiCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { setPreferences(getPreferences()) }, [])

  useEffect(() => {
    setLoading(true)
    const vector = preferences.length > 0
      ? aspectsToVector(preferences)
      : new Array(12).fill(0) as number[]
    searchCafes(vector, 1, 50)
      .then(data => {
        const cafes = data.cafes.map(mapSearchItem)
        setCafeCache(cafes)
        setApiCafes(cafes)
      })
      .catch(() => setApiCafes([]))
      .finally(() => setLoading(false))
  }, [preferences.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = useCallback((selected: Set<KeywordId>, _conveniences: Set<string>) => {
    setAppliedKeywords([...selected])
    setFilterOpen(false)
    if (selected.size > 0) {
      const params = new URLSearchParams()
      params.set('keywords', [...selected].join(','))
      router.push(`/search?${params}`)
    }
  }, [router])

  const handleReset = useCallback(() => {
    setAppliedKeywords([])
    setFilterOpen(false)
  }, [])

  const handleRemoveKeyword = useCallback((id: KeywordId) => {
    setAppliedKeywords(prev => prev.filter(k => k !== id))
  }, [])

  const handleSearch = useCallback((q: string) => {
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`)
    } else {
      setQuery('')
    }
  }, [router])

  const popularKeywords = useMemo(() => getPopularKeywords(apiCafes), [apiCafes])

  const sectionTitle = useMemo(() => {
    if (preferences.length > 0) {
      return preferences.slice(0, 2).map(k => ASPECT_LABELS[k].split('/')[0]).join(' · ') + ' 취향 카페'
    }
    return '추천 카페'
  }, [preferences])

  const sectionSubtitle = preferences.length > 0
    ? 'ABSA 분석 결과 취향에 맞는 긍정 리뷰가 많은 카페'
    : 'ABSA 분석 결과 긍정 리뷰가 가장 많은 카페'

  return (
    <div className="min-h-screen bg-background">
      {/* 히어로 배너 */}
      <HeroBanner />

      {/* 프로모 배너 그리드 */}
      <PromoBanners />

      {/* 검색 섹션 */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4">
          {preferences.length > 0 ? (
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">맞춤 추천</span> · {sectionTitle}
              </p>
              <Link href="/onboarding" className="text-xs text-primary hover:underline">
                취향 재설정 →
              </Link>
            </div>
          ) : (
            <div className="mb-3">
              <Link href="/onboarding" className="text-xs text-primary hover:underline">
                취향을 설정하면 맞춤 추천을 받을 수 있어요 →
              </Link>
            </div>
          )}

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            filterOpen={filterOpen}
            onFilterToggle={() => setFilterOpen(v => !v)}
            appliedCount={appliedKeywords.length}
            appliedKeywords={appliedKeywords}
            onRemoveKeyword={handleRemoveKeyword}
            onSearch={handleSearch}
          />

          {filterOpen && (
            <FilterPanel
              applied={appliedKeywords}
              appliedConveniences={[]}
              onApply={handleApply}
              onReset={handleReset}
            />
          )}

          {!filterOpen && popularKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {popularKeywords.map(kw => (
                <button
                  key={kw.text}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(kw.text)}`)}
                  className="text-xs px-3 py-1 rounded-full border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {kw.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <HomeCategorySection />

      {/* 테마별 탐색 배너 */}
      <SecondaryBanners />

      {/* 추천 카페 리스트 */}
      <HomeCafeListSection
        title={sectionTitle}
        subtitle={sectionSubtitle}
        cafes={apiCafes}
        viewAllLink="/search"
        loading={loading}
      />

      {/* ABSA 기능 소개 */}
      <AbsaFeatureSection />

      {/* 리뷰 분석 미리보기 */}
      <ReviewAnalysisPreview />

      {/* 지역 검색 배너 */}
      <LocationBanner />

      {/* 푸터 */}
      <HomeFooter />
    </div>
  )
}
