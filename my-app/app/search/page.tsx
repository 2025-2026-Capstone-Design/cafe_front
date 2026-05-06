'use client'

import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_CAFES } from '@/lib/mockData'
import { Cafe, AspectKey } from '@/lib/types'
import { rankCafes } from '@/lib/ranking'
import FilterPanel, { KeywordId } from '@/components/FilterPanel'
import SearchBar from '@/components/SearchBar'
import { useSearchParams } from 'next/navigation'
import CafeDetailPanel from '@/components/CafeDetailPanel'
import { searchCafes, aspectsToVector } from '@/lib/api'
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
    const el = marker.content as HTMLElement
    if (id === selectedId) {
      el.style.background = '#3C3489'
      el.style.borderColor = '#3C3489'
      el.style.color = '#EEEDFE'
    } else {
      el.style.background = 'white'
      el.style.borderColor = '#d1d5db'
      el.style.color = '#1a1a1a'
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

  const [query, setQuery] = useState(initialQuery)
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedKeywords, setAppliedKeywords] = useState<KeywordId[]>([])
  const [pinnedAspects, setPinnedAspects] = useState<AspectKey[]>(
    initialAspect ? [initialAspect] : []
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  // API 결과 or mock fallback
  const [cafes, setCafes] = useState<Cafe[]>(MOCK_CAFES)
  const [loadingCafes, setLoadingCafes] = useState(false)

  const activeAspects = useMemo<AspectKey[]>(() => (
    [...new Set([
      ...pinnedAspects,
      ...appliedKeywords.map(id => id.split(':')[0] as AspectKey),
    ])]
  ), [pinnedAspects, appliedKeywords])

  // activeAspects가 바뀌면 API 재조회
  useEffect(() => {
    if (activeAspects.length === 0) {
      setCafes(MOCK_CAFES)
      return
    }
    setLoadingCafes(true)
    searchCafes(aspectsToVector(activeAspects), 1, 50)
      .then(data => setCafes(data.cafes.map(mapSearchItem)))
      .catch(() => setCafes(MOCK_CAFES))
      .finally(() => setLoadingCafes(false))
  }, [activeAspects.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? cafes.filter(cafe =>
          cafe.name.toLowerCase().includes(q) || cafe.address.toLowerCase().includes(q)
        )
      : cafes
    return rankCafes(filtered, activeAspects)
  }, [cafes, query, activeAspects])

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
      mapInstanceRef.current.panTo(coords)
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

      const pin = document.createElement('div')
      pin.textContent = cafe.name
      pin.style.cssText = `
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 500;
        font-family: 'Noto Sans KR', sans-serif;
        color: #1a1a1a;
        white-space: nowrap;
        cursor: pointer;
        box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        transition: all 0.15s;
      `

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current!,
        position: coords,
        content: pin,
        title: cafe.name,
      })
      marker.addListener('click', () => selectCafeRef.current(cafe.id))
      markersRef.current[cafe.id] = marker
    })
    updateMarkerStyle(markersRef.current, selectedId)
  }, [results])  // eslint-disable-line react-hooks/exhaustive-deps

  const initMap = useCallback(() => {
    if (!mapRef.current || isMapInitializedRef.current) return
    isMapInitializedRef.current = true

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.555, lng: 126.990 },
        zoom: 13,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? 'DEMO_MAP_ID',
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      })
      mapInstanceRef.current = map
    } catch (err) {
      console.error('Google Maps 초기화 실패:', err)
      setMapError('지도를 불러오는 데 실패했습니다.')
    }
  }, [])

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

  const handleApply = (selected: Set<KeywordId>) => {
    setAppliedKeywords([...selected])
    setFilterOpen(false)
  }

  const handleReset = () => {
    setAppliedKeywords([])
    setPinnedAspects([])
    setFilterOpen(false)
  }

  const handleRemoveKeyword = (id: KeywordId) => {
    setAppliedKeywords(prev => prev.filter(k => k !== id))
  }

  const selectedCafe = results.find(c => c.id === selectedId)

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden font-sans">
      {/* ── 왼쪽 패널 ── */}
      <div className="w-[320px] shrink-0 flex flex-col border-r border-neutral-200 bg-white overflow-hidden">
        <div className="p-3">
          <button
            onClick={() => { setDetailId(null); setSelectedId(null); updateMarkerStyle(markersRef.current, null) }}
            className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-neutral-700 mb-3"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            목록으로
          </button>

          <SearchBar
            query={query}
            onQueryChange={setQuery}
            filterOpen={filterOpen}
            onFilterToggle={() => setFilterOpen(v => !v)}
            appliedCount={appliedKeywords.length}
            appliedKeywords={appliedKeywords}
            onRemoveKeyword={handleRemoveKeyword}
          />

          {filterOpen && (
            <div className="overflow-y-auto max-h-[60vh] border-t border-neutral-100">
              <FilterPanel
                applied={appliedKeywords}
                onApply={handleApply}
                onReset={handleReset}
              />
            </div>
          )}
        </div>

        <div className="px-3.5 py-2 text-[11px] text-neutral-400 border-b border-neutral-100 flex items-center gap-2">
          {loadingCafes
            ? <span>검색 중…</span>
            : <span>{results.length}개 카페</span>
          }
          {activeAspects.length > 0 && (
            <span className="text-violet-500">· 필터 적용됨</span>
          )}
        </div>

        <div className="flex-1 relative overflow-hidden">
          {/* 카드 리스트 */}
          <div className={`absolute inset-0 overflow-y-auto transition-transform duration-200
            ${detailId ? '-translate-x-full' : 'translate-x-0'}`}>
            {loadingCafes ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <p className="text-center text-[13px] text-neutral-400 py-12">
                조건에 맞는 카페가 없어요
              </p>
            ) : (
              results.map((cafe, i) => {
                const isSelected = selectedId === cafe.id
                const repKeywords = Object.values(cafe.keywords)
                  .flat()
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 3)
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
                      className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ background: `${thumbColors[i % thumbColors.length]}22` }}
                    >
                      {cafe.imageUrl ? (
                        <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-full object-cover rounded-lg" />
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
                        <span className="font-serif text-[14px] font-semibold text-neutral-900 truncate max-w-[130px]">
                          {cafe.name}
                        </span>
                        {cafe.score > 0 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 shrink-0 ml-1">
                            {cafe.score}점
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate mb-1.5">{cafe.address}</p>
                      <div className="flex flex-wrap gap-1">
                        {(repKeywords.length > 0 ? repKeywords : flatKeywords.map(k => ({ text: k.keyword, sentiment: 'pos' as const, count: k.count }))).map(kw => (
                          <span
                            key={kw.text}
                            className={`text-[10px] px-1.5 py-0.5 rounded-full border
                              ${kw.sentiment === 'pos'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-orange-50 text-orange-800 border-orange-200'
                              }`}
                          >
                            {kw.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* 상세 패널 */}
          <div className={`absolute inset-0 overflow-y-auto bg-white transition-transform duration-200
            ${detailId ? 'translate-x-0' : 'translate-x-full'}`}>
            <button
              onClick={() => setDetailId(null)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 px-3.5 py-3 border-b border-neutral-100 w-full"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              목록으로
            </button>
            {detailId && <CafeDetailPanel cafeId={detailId} />}
          </div>
        </div>
      </div>

      {/* ── 오른쪽 지도 ── */}
      <div className="flex-1 relative">
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

        {selectedCafe && !mapError && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 bg-white border border-neutral-200 rounded-xl p-3.5 shadow-sm">
            <p className="font-serif text-[14px] font-semibold text-neutral-900 mb-0.5">
              {selectedCafe.name}
            </p>
            <p className="text-[11px] text-neutral-500 mb-2.5">{selectedCafe.address}</p>
            <div className="flex justify-between items-center">
              {selectedCafe.score > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                  {selectedCafe.score}점
                </span>
              )}
              <button
                onClick={() => router.push(`/cafe/${selectedCafe.id}`)}
                className="text-[11px] text-violet-600 hover:text-violet-800 ml-auto"
              >
                상세보기 →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
