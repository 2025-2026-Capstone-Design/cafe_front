'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cafe, AspectKey, ASPECT_LABELS, Keyword } from '@/lib/types'
import { getPreferences } from '@/lib/preferences'
import CafeCard from '@/components/CafeCard'
import SearchBar from '@/components/SearchBar'
import FilterPanel, { KeywordId } from '@/components/FilterPanel'
import Link from 'next/link'
import { searchCafes, aspectsToVector } from '@/lib/api'
import { mapSearchItem } from '@/lib/mappers'

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

const CATEGORY_GRID: { key: AspectKey; icon: string }[] = [
  { key: 'coffee', icon: '☕' },
  { key: 'bakery', icon: '🥐' },
  { key: 'cake',   icon: '🎂' },
  { key: 'bingsu', icon: '🍧' },
  { key: 'space',  icon: '🪑' },
  { key: 'vibe',   icon: '✨' },
]

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedKeywords, setAppliedKeywords] = useState<KeywordId[]>([])
  const [preferences, setPreferences] = useState<AspectKey[]>([])
  const [apiCafes, setApiCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { setPreferences(getPreferences()) }, [])

  // preferences가 정해지면 API로 personalized 결과 가져오기
  useEffect(() => {
    setLoading(true)
    const vector = preferences.length > 0
      ? aspectsToVector(preferences)
      : new Array(12).fill(0) as number[]
    searchCafes(vector, 1, 50)
      .then(data => setApiCafes(data.cafes.map(mapSearchItem)))
      .catch(() => setApiCafes([]))
      .finally(() => setLoading(false))
  }, [preferences.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  const activeAspects = useMemo<AspectKey[]>(() => {
    const keys = appliedKeywords.map(id => id.split(':')[0] as AspectKey)
    return [...new Set(keys)]
  }, [appliedKeywords])

  const handleApply = useCallback((selected: Set<KeywordId>) => {
    setAppliedKeywords([...selected])
    setFilterOpen(false)
    if (selected.size > 0) router.push('/search')
  }, [router])

  const handleReset = useCallback(() => {
    setAppliedKeywords([])
    setFilterOpen(false)
  }, [])

  const handleQueryChange = useCallback((v: string) => {
    setQuery(v)
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

  const results = apiCafes

  const statusText = useMemo(() => {
    const parts: string[] = []
    if (activeAspects.length > 0) parts.push('필터 적용됨')
    if (query) parts.push(`"${query}"`)
    return parts.length > 0 ? `${parts.join(' · ')} · ${results.length}개` : `전체 ${results.length}개`
  }, [activeAspects, query, results.length])

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 min-h-screen">
      {/* 헤더 */}
      <div className="mb-6">
        {preferences.length > 0 ? (
          <div className="mb-4">
            <p className="text-[12px] text-violet-500 font-medium mb-1">맞춤 추천</p>
            <h1 className="font-serif text-2xl font-semibold text-neutral-900 tracking-tight mb-1">
              {preferences.slice(0, 2).map(k => ASPECT_LABELS[k].split('/')[0]).join(' · ')} 취향 카페
            </h1>
            <Link href="/onboarding" className="text-[12px] text-violet-500 hover:underline">
              취향 재설정 →
            </Link>
          </div>
        ) : (
          <div className="mb-4">
            <h1 className="font-serif text-2xl font-semibold text-neutral-900 tracking-tight mb-1">
              근처 카페 추천
            </h1>
            <Link href="/onboarding" className="text-[12px] text-violet-500 hover:underline">
              취향을 설정하면 맞춤 추천을 받을 수 있어요 →
            </Link>
          </div>
        )}

        {/* 검색창 + 필터 버튼 */}
        <SearchBar
          query={query}
          onQueryChange={handleQueryChange}
          filterOpen={filterOpen}
          onFilterToggle={() => setFilterOpen((v) => !v)}
          appliedCount={appliedKeywords.length}
          appliedKeywords={appliedKeywords}
          onRemoveKeyword={handleRemoveKeyword}
          onSearch={handleSearch}
        />

        {/* 필터 패널 */}
        {filterOpen && (
          <FilterPanel
            applied={appliedKeywords}
            onApply={handleApply}
            onReset={handleReset}
          />
        )}

        {/* 인기 키워드 칩 */}
        {!filterOpen && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {popularKeywords.map(kw => (
              <button
                key={kw.text}
                onClick={() => router.push(`/search?q=${encodeURIComponent(kw.text)}`)}
                className="text-[12px] px-3 py-1 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                {kw.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 카테고리 그리드 */}
      {!filterOpen && (
        <div className="mb-6">
          <p className="text-[12px] text-neutral-400 mb-2.5">카테고리</p>
          <div className="grid grid-cols-6 gap-2">
            {CATEGORY_GRID.map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => router.push(`/search?aspect=${key}`)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-neutral-100 bg-white hover:border-violet-200 hover:bg-violet-50 transition-colors"
              >
                <span className="text-lg">{icon}</span>
                <span className="text-[9px] text-neutral-500 leading-tight text-center">
                  {ASPECT_LABELS[key].split('/')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 결과 수 */}
      {!query.trim() && (
        <p className="text-[12px] text-neutral-400 mb-4">{statusText}</p>
      )}

      {/* 카드 그리드 */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-neutral-100" />
                <div className="p-3.5 space-y-2">
                  <div className="h-3 bg-neutral-100 rounded w-2/3" />
                  <div className="h-2 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="text-center text-[14px] text-neutral-400 py-12">
            조건에 맞는 카페가 없어요
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((cafe, i) => (
              <CafeCard key={cafe.id} cafe={cafe} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
