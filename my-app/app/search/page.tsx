'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_CAFES } from '@/lib/mockData'
import { AspectKey } from '@/lib/types'
import { rankCafes } from '@/lib/ranking'
import FilterPanel, { KeywordId } from '@/components/FilterPanel'
import SearchBar from '@/components/SearchBar'
import { useSearchParams } from 'next/navigation'
import CafeDetailPanel from '@/components/CafeDetailPanel'



declare global {
  interface Window {
    initMap: () => void
  }
}

const CAFE_COORDS: Record<number, { lat: number; lng: number }> = {
  1: { lat: 37.5665, lng: 126.9241 },
  2: { lat: 37.5571, lng: 126.9389 },
  3: { lat: 37.5444, lng: 127.0557 },
  4: { lat: 37.5824, lng: 126.9823 },
  5: { lat: 37.5344, lng: 126.9997 },
  6: { lat: 37.5268, lng: 127.0283 },
}

// 마커 스타일 업데이트 순수 함수로 분리
function updateMarkerStyle(
  markers: Record<number, google.maps.marker.AdvancedMarkerElement>,
  selectedId: number | null
) {
  Object.entries(markers).forEach(([id, marker]) => {
    const el = marker.content as HTMLElement
    if (Number(id) === selectedId) {
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

export default function MapPage() {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Record<number, google.maps.marker.AdvancedMarkerElement>>({})
  const isMapInitializedRef = useRef(false) // ✅ 중복 초기화 방지
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
// query state 초기값 변경
  const [query, setQuery] = useState(initialQuery)
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedKeywords, setAppliedKeywords] = useState<KeywordId[]>([]) 
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [mapError, setMapError] = useState<string | null>(null) // ✅ 에러 상태 추가
  const [detailId, setDetailId] = useState<number | null>(null)

  const activeAspects = useMemo<AspectKey[]>(() => (
    [...new Set(appliedKeywords.map(id => id.split(':')[0] as AspectKey))]
  ), [appliedKeywords])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = MOCK_CAFES.filter(cafe => {
      const matchQ = !q || cafe.name.toLowerCase().includes(q) || cafe.address.toLowerCase().includes(q)
      const matchA = activeAspects.length === 0 || activeAspects.some(k => (cafe.aspectScores[k] ?? 0) > 0)
      return matchQ && matchA
    })
    return rankCafes(filtered, activeAspects)
  }, [query, activeAspects])

  // ✅ selectCafe를 initMap보다 먼저 정의 (ref로 참조)
  const selectCafeRef = useRef<(id: number) => void>(() => {})

  const selectCafe = useCallback((id: number) => {
    if (selectedId === id) {
      router.push(`/cafe/${id}`)
      return
    }
    setSelectedId(id)
    setDetailId(id)
    updateMarkerStyle(markersRef.current, id)
    const coords = CAFE_COORDS[id]
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(coords)
    }
    document.getElementById(`cafe-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedId, router])

  // ref 동기화 (stale closure 방지)
  useEffect(() => {
    selectCafeRef.current = selectCafe
  }, [selectCafe])

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

      MOCK_CAFES.forEach(cafe => {
        const coords = CAFE_COORDS[cafe.id]
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
          map,
          position: coords,
          content: pin,
          title: cafe.name,
        })

        // ✅ ref를 통해 항상 최신 selectCafe 호출
        marker.addListener('click', () => selectCafeRef.current(cafe.id))
        markersRef.current[cafe.id] = marker
      })
    } catch (err) {
      console.error('Google Maps 초기화 실패:', err)
      setMapError('지도를 불러오는 데 실패했습니다.')
    }
  }, []) // ✅ deps 비움 — selectCafe는 ref로 접근

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setMapError('Google Maps API 키가 설정되지 않았습니다.')
      return
    }

    // ✅ 이미 로드된 경우
    if (window.google?.maps) {
      initMap()
      return
    }

    // ✅ 스크립트 중복 방지
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    )
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
      // window.initMap만 정리 (script는 캐시 활용을 위해 유지)
      window.initMap = undefined as unknown as () => void
    }
  }, [initMap])

  const handleApply = (selected: Set<KeywordId>) => {
    setAppliedKeywords([...selected])
    setFilterOpen(false)
  }

  const handleReset = () => {
    setAppliedKeywords([])
    setFilterOpen(false)
  }

  const handleRemoveKeyword = (id: KeywordId) => {
  setAppliedKeywords(prev => prev.filter(k => k !== id))
}

  const selectedCafe = MOCK_CAFES.find(c => c.id === selectedId)

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
            appliedCount={appliedKeywords.length}  // .size → .length
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
        

        <div className="px-3.5 py-2 text-[11px] text-neutral-400 border-b border-neutral-100">
          {results.length}개 카페
          {activeAspects.length > 0 && (
            <span className="ml-1 text-violet-500">· 필터 적용됨</span>
          )}
        </div>
    <div className="flex-1 relative overflow-hidden">
      {/* 카드리스트 */}
      <div className={`absolute inset-0 overflow-y-auto transition-transform duration-200
        ${detailId ? '-translate-x-full' : 'translate-x-0'}`}>
        {results.length === 0 ? (
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
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 shrink-0 ml-1">
                      {cafe.score}점
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mb-1.5">{cafe.address}</p>
                  <div className="flex flex-wrap gap-1">
                    {repKeywords.map(kw => (
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
        {/* ✅ 에러 표시 */}
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
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
                {selectedCafe.score}점
              </span>
              <button
                onClick={() => router.push(`/cafe/${selectedCafe.id}`)}
                className="text-[11px] text-violet-600 hover:text-violet-800"
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