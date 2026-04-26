'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_CAFES } from '@/lib/mockData'
import { AspectKey, ASPECT_LABELS, Keyword } from '@/lib/types'
import { rankCafes } from '@/lib/ranking'
import { getPreferences } from '@/lib/preferences'
import CafeCard from '@/components/CafeCard'
import SearchBar from '@/components/SearchBar'
import FilterPanel, { KeywordId } from '@/components/FilterPanel'
import Link from 'next/link'

// 전체 카페에서 count 합산 기준 상위 키워드 추출
function getPopularKeywords(limit = 8): Keyword[] {
  const map = new Map<string, Keyword>()
  for (const cafe of MOCK_CAFES) {
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


const POPULAR_KEYWORDS = getPopularKeywords()

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedKeywords, setAppliedKeywords] = useState<KeywordId[]>([])
  const [preferences, setPreferences] = useState<AspectKey[]>([])

  useEffect(() => { setPreferences(getPreferences()) }, [])
  // 적용된 키워드에서 측면 키 추출 (중복 제거)
  const activeAspects = useMemo<AspectKey[]>(() => {
  const keys = appliedKeywords.map(id => id.split(':')[0] as AspectKey)
  return [...new Set(keys)]
  }, [appliedKeywords])

 const handleApply = useCallback((selected: Set<KeywordId>) => {
  setAppliedKeywords([...selected])
  setFilterOpen(false)
  if (selected.size > 0) router.push('/search')  // ← 추가
}, [router])

  const handleReset = useCallback(() => {
    setAppliedKeywords([])
    setFilterOpen(false)
  }, [])

  // onQueryChange 대신 별도 핸들러
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
    setQuery('')  // 지우면 홈으로 복귀
  }
}, [router])

  // 이름 검색 + 측면 기반 재랭킹
  const results = useMemo(() => {
  const filtered = MOCK_CAFES.filter((cafe) => {
    const matchAspect = activeAspects.length === 0 || activeAspects.some((k) => (cafe.aspectScores[k] ?? 0) > 0)
    return matchAspect
  })
  return rankCafes(filtered, activeAspects)
}, [activeAspects])  // query 의존성도 제거

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
            <h1 className="font-serif text-2xl font-semibold text-neutral-900 tracking-tight">
              {preferences.slice(0, 2).map(k => ASPECT_LABELS[k].split('/')[0]).join(' · ')} 취향 카페
            </h1>
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
            {POPULAR_KEYWORDS.map(kw => (
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

      {/* 결과 수 */}
      {!query.trim() && (
        <p className="text-[12px] text-neutral-400 mb-4">{statusText}</p>
      )}

      {/* 카드 그리드 */}
      <div className="min-h-[400px]">
        {results.length === 0 ? (
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