'use client'

import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Cafe, AspectKey, Keyword } from '@/lib/types'
import FilterPanel, { KeywordId } from '@/components/FilterPanel'
import { getPreferences } from '@/lib/preferences'
import SearchBar from '@/components/SearchBar'
import { useSearchParams } from 'next/navigation'
import CafeDetailPanel from '@/components/CafeDetailPanel'
import { searchCafes, searchCafesAdvanced, searchCafesByName, aspectsToVector } from '@/lib/api'
import { mapSearchItem } from '@/lib/mappers'

declare global {
  interface Window {
    initMap: () => void
  }
}

// 목 데이터용 좌표 (API 결과에는 좌표 없음)
const CAFE_COORDS: Record<string, { lat: number; lng: number }> = {
  '1': { lat: 37.5665, lng: 126.9241 },
  '2': { lat: 37.5571, lng: 126.9389 },
  '3': { lat: 37.5444, lng: 127.0557 },
  '4': { lat: 37.5824, lng: 126.9823 },
  '5': { lat: 37.5344, lng: 126.9997 },
  '6': { lat: 37.5268, lng: 127.0283 },
}

function getCoords(cafe: Cafe): { lat: number; lng: number } | null {
  if (cafe.lat && cafe.lon) return { lat: cafe.lat, lng: cafe.lon }
  return CAFE_COORDS[cafe.id] ?? null
}

function updateMarkerStyle(
  markers: Record<string, google.maps.marker.AdvancedMarkerElement>,
  selectedId: string | null
) {
  Object.entries(markers).forEach(([id, marker]) => {
    const wrapper = marker.content as HTMLElement
    const circle = wrapper.firstElementChild as HTMLElement | null
    const label = wrapper.lastElementChild as HTMLElement | null
    if (!circle || !label || circle === label) return
    if (id === selectedId) {
      circle.style.width = '36px'
      circle.style.height = '36px'
      circle.style.background = '#3C3489'
      circle.style.boxShadow = '0 2px 8px rgba(60,52,137,0.5)'
      label.style.display = 'block'
    } else {
      circle.style.width = '30px'
      circle.style.height = '30px'
      circle.style.background = '#7C3AED'
      circle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)'
      label.style.display = 'none'
    }
  })
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MapPage />
    </Suspense>
  )
}

function MapPage() {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Record<string, google.maps.marker.AdvancedMarkerElement>>({})
  const isMapInitializedRef = useRef(false)
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const initialAspect = searchParams.get('aspect') as AspectKey | null

  const initialKeywordsParam = searchParams.get('keywords') ?? ''
  const initialKeywords: KeywordId[] = initialKeywordsParam
    ? (initialKeywordsParam.split(',') as KeywordId[])
    : []

  const initialConveniencesParam = searchParams.get('conveniences') ?? ''
  const initialConveniences: string[] = initialConveniencesParam
    ? initialConveniencesParam.split(',')
    : []

  const [query, setQuery] = useState(initialQuery)
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedKeywords, setAppliedKeywords] = useState<KeywordId[]>(initialKeywords)
  const [appliedConveniences, setAppliedConveniences] = useState<string[]>(initialConveniences)
  const [pinnedAspects, setPinnedAspects] = useState<AspectKey[]>(
    initialAspect ? [initialAspect] : []
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

  // API 결과 or mock fallback
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loadingCafes, setLoadingCafes] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [preferences] = useState<AspectKey[]>(() => getPreferences())

  const activeAspects = useMemo<AspectKey[]>(() => (
    [...new Set([
      ...pinnedAspects,
      ...appliedKeywords.map(id => id.split(':')[0] as AspectKey),
    ])]
  ), [pinnedAspects, appliedKeywords])

  const fetchCafesByAspect = useCallback((aspects: AspectKey[], keywords: string[], conveniences: string[] = []) => {
    setLoadingCafes(true)
    setPage(1)
    const vector = aspects.length > 0
      ? aspectsToVector(aspects)
      : preferences.length > 0
        ? aspectsToVector(preferences)
        : new Array(12).fill(0) as number[]
    const fetch$ = keywords.length > 0
      ? searchCafesAdvanced(vector, keywords, 1, 20, conveniences)
      : searchCafes(vector, 1, 20, conveniences)
    fetch$
      .then(data => {
        setCafes(data.cafes.map(mapSearchItem))
        setTotalPages(data.totalPages)
        setTotalCount(data.totalCount)
      })
      .catch((e) => { console.error('[fetchCafes] 에러:', e); setCafes([]) })
      .finally(() => setLoadingCafes(false))
  }, [preferences])  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCafes = useCallback((aspects: AspectKey[], keywords: string[], conveniences: string[] = [], name?: string) => {
    if (name) {
      setLoadingCafes(true)
      setPage(1)
      searchCafesByName(name, 1, 20)
        .then(data => {
          setCafes(data.cafes.map(mapSearchItem))
          setTotalPages(data.totalPages)
          setTotalCount(data.totalCount)
        })
        .catch((e) => {
          console.error('[fetchCafesByName] 에러:', e)
          // name search 엔드포인트 실패 시 aspect 검색으로 폴백
          fetchCafesByAspect(aspects, keywords, conveniences)
        })
        .finally(() => setLoadingCafes(false))
    } else {
      fetchCafesByAspect(aspects, keywords, conveniences)
    }
  }, [fetchCafesByAspect])  // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (page >= totalPages || loadingMore || loadingCafes) return
    const nextPage = page + 1
    setLoadingMore(true)

    const currentQuery = query.trim()
    const aspects = [...new Set([
      ...pinnedAspects,
      ...appliedKeywords.map(id => id.split(':')[0] as AspectKey),
    ])]
    const keywords = appliedKeywords.map(id => id.split(':')[1])
    const vector = aspects.length > 0
      ? aspectsToVector(aspects)
      : preferences.length > 0
        ? aspectsToVector(preferences)
        : new Array(12).fill(0) as number[]

    const fetchPromise = currentQuery
      ? searchCafesByName(currentQuery, nextPage, 20)
      : keywords.length > 0
        ? searchCafesAdvanced(vector, keywords, nextPage, 20, appliedConveniences)
        : searchCafes(vector, nextPage, 20, appliedConveniences)

    fetchPromise
      .then(data => {
        setCafes(prev => [...prev, ...data.cafes.map(mapSearchItem)])
        setPage(nextPage)
        setTotalPages(data.totalPages)
        setTotalCount(data.totalCount)
      })
      .catch(e => console.error('[loadMore] 에러:', e))
      .finally(() => setLoadingMore(false))
  }, [page, totalPages, loadingMore, loadingCafes, query, pinnedAspects, appliedKeywords, appliedConveniences, preferences])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const aspects = [...new Set([
      ...pinnedAspects,
      ...initialKeywords.map(id => id.split(':')[0] as AspectKey),
    ])]
    const keywords = initialKeywords.map(id => id.split(':')[1])
    fetchCafes(aspects, keywords, appliedConveniences, initialQuery.trim() || undefined)
  }, [pinnedAspects.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const prevQueryRef = useRef(initialQuery)
  useEffect(() => {
    const q = query.trim()
    if (q === prevQueryRef.current.trim()) return
    prevQueryRef.current = query
    const timer = setTimeout(() => {
      const aspects = [...new Set([
        ...pinnedAspects,
        ...appliedKeywords.map(id => id.split(':')[0] as AspectKey),
      ])]
      const keywords = appliedKeywords.map(id => id.split(':')[1])
      fetchCafes(aspects, keywords, appliedConveniences, q || undefined)
    }, 500)
    return () => clearTimeout(timer)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  const results = cafes

  const selectCafeRef = useRef<(id: string) => void>(() => {})

  const selectCafe = useCallback((id: string) => {
    if (selectedId === id) {
      router.push(`/cafe/${id}`)
      return
    }
    setSelectedId(id)
    setDetailId(id)
    updateMarkerStyle(markersRef.current, id)
    const cafe = cafes.find(c => c.id === id)
    const coords = cafe ? getCoords(cafe) : null
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(17)
      mapInstanceRef.current.panTo({ lat: coords.lat, lng: coords.lng })
    }
    document.getElementById(`cafe-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId, router, cafes])

  useEffect(() => {
    selectCafeRef.current = selectCafe
  }, [selectCafe])

  // 결과가 바뀌면 마커 재생성
  useEffect(() => {
    if (!mapInstanceRef.current) return
    // 기존 마커 제거
    Object.values(markersRef.current).forEach(m => { m.map = null })
    markersRef.current = {}
    // 새 마커 생성
    results.forEach(cafe => {
      const coords = getCoords(cafe)
      if (!coords) return

      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;'

      const circle = document.createElement('div')
      circle.style.cssText = `
        width: 30px; height: 30px;
        background: #7C3AED;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        display: flex; align-items: center; justify-content: center;
        transition: all 0.15s;
      `
      circle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/></svg>`

      const nameLabel = document.createElement('div')
      nameLabel.textContent = cafe.name
      nameLabel.style.cssText = `
        display: none;
        background: #3C3489; color: white;
        padding: 2px 8px; border-radius: 4px;
        font-size: 11px; font-weight: 500;
        white-space: nowrap; margin-top: 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      `
      wrapper.appendChild(circle)
      wrapper.appendChild(nameLabel)

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current!,
        position: coords,
        content: wrapper,
        title: cafe.name,
      })
      marker.addListener('click', () => selectCafeRef.current(cafe.id))
      markersRef.current[cafe.id] = marker
    })
    updateMarkerStyle(markersRef.current, selectedId)

    // 마커들이 모두 보이도록 bounds 조정
    const bounds = new window.google.maps.LatLngBounds()
    results.forEach(cafe => {
      const coords = getCoords(cafe)
      if (coords) bounds.extend(coords)
    })
    if (!bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds, 60)
    }
  }, [results, mapReady])  // eslint-disable-line react-hooks/exhaustive-deps

  const initMap = useCallback(() => {
    if (!mapRef.current || isMapInitializedRef.current) return
    isMapInitializedRef.current = true

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.555, lng: 126.990 },
        zoom: 15,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? 'DEMO_MAP_ID',
        disableDefaultUI: true,
        zoomControl: true,
      })
      mapInstanceRef.current = map
      setMapReady(true)
    } catch (err) {
      console.error('Google Maps 초기화 실패:', err)
      setMapError('지도를 불러오는 데 실패했습니다.')
    }
  }, [setMapReady])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setMapError('Google Maps API 키가 설정되지 않았습니다.')
      return
    }

    if (window.google?.maps) {
      initMap()
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', initMap)
      return () => existingScript.removeEventListener('load', initMap)
    }

    window.initMap = initMap
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&callback=initMap&loading=async`
    script.async = true
    script.onerror = () => setMapError('Google Maps 스크립트 로드 실패. API 키를 확인하세요.')
    document.head.appendChild(script)

    return () => {
      window.initMap = undefined as unknown as () => void
    }
  }, [initMap])

  const handleApply = (selected: Set<KeywordId>, conveniences: Set<string>) => {
    const ids = [...selected]
    const convArr = [...conveniences]
    const aspects = [...new Set([...pinnedAspects, ...ids.map(id => id.split(':')[0] as AspectKey)])]
    const keywords = ids.map(id => id.split(':')[1])
    setAppliedKeywords(ids)
    setAppliedConveniences(convArr)
    setFilterOpen(false)
    fetchCafesByAspect(aspects, keywords, convArr)

    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (ids.length > 0) params.set('keywords', ids.join(','))
    else if (pinnedAspects.length > 0) params.set('aspect', pinnedAspects[0])
    if (convArr.length > 0) params.set('conveniences', convArr.join(','))
    router.replace(`/search?${params.toString()}`)
  }

  const handleReset = () => {
    setAppliedKeywords([])
    setAppliedConveniences([])
    setPinnedAspects([])
    setFilterOpen(false)
    setQuery('')
    fetchCafesByAspect([], [], [])
    router.replace('/search')
  }

  const handleRemoveKeyword = (id: KeywordId) => {
    const next = appliedKeywords.filter(k => k !== id)
    const aspects = [...new Set([...pinnedAspects, ...next.map(k => k.split(':')[0] as AspectKey)])]
    const keywords = next.map(k => k.split(':')[1])
    setAppliedKeywords(next)
    fetchCafesByAspect(aspects, keywords, appliedConveniences)
  }

  const handleRemoveConvenience = (apiName: string) => {
    const next = appliedConveniences.filter(c => c !== apiName)
    const aspects = [...new Set([...pinnedAspects, ...appliedKeywords.map(k => k.split(':')[0] as AspectKey)])]
    const keywords = appliedKeywords.map(k => k.split(':')[1])
    setAppliedConveniences(next)
    fetchCafesByAspect(aspects, keywords, next)
  }

  const closeDetail = useCallback(() => {
    setDetailId(null)
    setSelectedId(null)
    updateMarkerStyle(markersRef.current, null)
  }, [])

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden font-sans">
      {/* ── 왼쪽 목록 패널 (항상 표시) ── */}
      <div className="w-[340px] shrink-0 flex flex-col border-r border-neutral-200 bg-white overflow-x-hidden">
        <div className="p-3">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            filterOpen={filterOpen}
            onFilterToggle={() => setFilterOpen(v => !v)}
            appliedCount={appliedKeywords.length + appliedConveniences.length}
            appliedKeywords={appliedKeywords}
            onRemoveKeyword={handleRemoveKeyword}
            appliedConveniences={appliedConveniences}
            onRemoveConvenience={handleRemoveConvenience}
          />
          {filterOpen && (
            <div className="border-t border-neutral-100">
              <FilterPanel
                applied={appliedKeywords}
                appliedConveniences={appliedConveniences}
                onApply={handleApply}
                onReset={handleReset}
              />
            </div>
          )}
        </div>

        <div className="px-3.5 py-2 text-[11px] text-neutral-400 border-b border-neutral-100 flex items-center gap-2">
          {loadingCafes ? <span>검색 중…</span> : <span>{results.length}{totalCount > results.length ? ` / ${totalCount}` : ''}개 카페</span>}
          {activeAspects.length > 0 && <span className="text-violet-500">· 필터 적용됨</span>}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {loadingCafes ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-[13px] text-neutral-400 py-12">조건에 맞는 카페가 없어요</p>
          ) : (
            <>
              {results.map((cafe, i) => {
                const isSelected = selectedId === cafe.id
                const repKeywords = (Object.values(cafe.keywords).flat() as Keyword[]).sort((a, b) => b.count - a.count).slice(0, 3)
                const flatKeywords = cafe.topKeywords?.slice(0, 3) ?? []
                const thumbColors = ['#C8B49A','#D4C4A8','#A8C4C8','#B8C4A8','#C4A8B8','#B4A898']
                return (
                  <div
                    key={cafe.id}
                    id={`cafe-card-${cafe.id}`}
                    onClick={() => selectCafe(cafe.id)}
                    className={`flex gap-2.5 px-3.5 py-3 border-b border-neutral-100 cursor-pointer transition-colors
                      ${isSelected ? 'bg-violet-50' : 'hover:bg-neutral-50'}`}
                  >
                    <div
                      className="w-16 h-16 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
                      style={{ background: `${thumbColors[i % thumbColors.length]}22` }}
                    >
                      {cafe.imageUrl ? (
                        <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                          <rect x="4" y="8" width="32" height="24" rx="3" stroke="#aaa" strokeWidth="1.5" opacity="0.5"/>
                          <circle cx="14" cy="17" r="3" fill="#aaa" opacity="0.5"/>
                          <path d="M4 28l8-7 6 5 6-8 12 11" stroke="#aaa" strokeWidth="1.5" fill="none" opacity="0.5"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="font-serif text-[14px] font-semibold text-neutral-900 truncate max-w-[130px]">{cafe.name}</span>
                        {cafe.score > 0 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 shrink-0 ml-1">
                            {cafe.score}점
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate mb-1.5">{cafe.address}</p>
                      <div className="flex flex-wrap gap-1">
                        {(repKeywords.length > 0 ? repKeywords : flatKeywords.map(k => ({ text: k.keyword, sentiment: 'pos' as const, count: k.count }))).map(kw => (
                          <span key={kw.text} className={`text-[10px] px-1.5 py-0.5 rounded-full border
                            ${kw.sentiment === 'pos' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-orange-50 text-orange-800 border-orange-200'}`}>
                            {kw.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
              {page < totalPages && (
                <div className="px-3.5 py-4 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="text-[12px] text-violet-600 border border-violet-200 rounded-lg px-4 py-2 hover:bg-violet-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />
                        불러오는 중…
                      </>
                    ) : (
                      `더 보기 (${totalCount - results.length}개 남음)`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── 오른쪽 지도 + 상세 오버레이 ── */}
      <div className="flex-1 relative overflow-hidden">
        {mapError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
            <p className="text-[13px] text-neutral-500">{mapError}</p>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full" />
        )}

        {/* 상세 패널 — 지도 위 슬라이드 오버레이 */}
        <div className={`absolute top-0 left-0 h-full w-[360px] bg-white shadow-2xl overflow-y-auto z-10
          transition-transform duration-200 ${detailId ? 'translate-x-0' : '-translate-x-full'}`}>
          {detailId && (
            <>
              <button
                onClick={closeDetail}
                className="sticky top-0 z-10 flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 px-3.5 py-3 border-b border-neutral-100 w-full bg-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                닫기
              </button>
              <CafeDetailPanel cafeId={detailId} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
