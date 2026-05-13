"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, X, Star, MapPin, ThumbsUp, Plus, ArrowLeftRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CompareRadarChart } from "@/components/compare/CompareRadarChart"
import { getCafeCache } from "@/lib/cafeCache"
import { searchCafes } from "@/lib/api"
import { mapSearchItem } from "@/lib/mappers"
import { Cafe, AspectKey, ASPECT_LABELS, ALL_ASPECTS } from "@/lib/types"

const COLORS = ["#8B5CF6", "#F59E0B", "#10B981"]

export default function ComparePage() {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [selected, setSelected] = useState<Cafe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeSlot, setActiveSlot] = useState<number | null>(null)

  useEffect(() => {
    const cached = getCafeCache()
    if (cached.length > 0) {
      setCafes(cached)
    } else {
      searchCafes(new Array(12).fill(0) as number[], 1, 50)
        .then(data => setCafes(data.cafes.map(mapSearchItem)))
        .catch(() => {})
    }
  }, [])

  const filtered = cafes.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selected.find(s => s.id === c.id)
  )

  const handleSelect = (cafe: Cafe) => {
    const slot = activeSlot ?? selected.length
    if (slot < 3) {
      const next = [...selected]
      next[slot] = cafe
      setSelected(next)
    }
    setIsSearchOpen(false)
    setSearchQuery("")
    setActiveSlot(null)
  }

  const handleRemove = (index: number) => {
    setSelected(selected.filter((_, i) => i !== index))
  }

  const openSearch = (slotIndex?: number) => {
    setActiveSlot(slotIndex ?? selected.length)
    setIsSearchOpen(true)
  }

  const getWinnerId = (key: AspectKey): string | null => {
    if (selected.length < 2) return null
    let max = -1
    let winnerId = ""
    selected.forEach(cafe => {
      const score = cafe.aspectScores?.[key] ?? 0
      if (score > max) { max = score; winnerId = cafe.id }
    })
    return winnerId
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">카페 비교</h1>
          <p className="text-muted-foreground">
            최대 3개의 카페를 선택하여 ABSA 측면별 점수를 비교해보세요
          </p>
        </div>

        {/* Cafe Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((slotIndex) => {
            const cafe = selected[slotIndex]
            return (
              <div
                key={slotIndex}
                className={`relative rounded-xl border-2 transition-all ${
                  cafe ? "border-border bg-card" : "border-dashed border-muted-foreground/30 bg-muted/20"
                }`}
              >
                {cafe ? (
                  <div className="p-4">
                    <button
                      onClick={() => handleRemove(slotIndex)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[slotIndex] }} />
                      <span className="text-xs text-muted-foreground">카페 {slotIndex + 1}</span>
                    </div>
                    {cafe.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={cafe.imageUrl}
                        alt={cafe.name}
                        className="w-full h-32 rounded-lg object-cover mb-3"
                      />
                    ) : (
                      <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center mb-3 text-muted-foreground text-3xl">
                        ☕
                      </div>
                    )}
                    <h3 className="font-semibold mb-1 truncate">{cafe.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{cafe.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-sm">{(cafe.score / 20).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({(cafe.reviewCount ?? 0).toLocaleString()})</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {cafe.score}점
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openSearch(slotIndex)}
                    className="w-full h-[240px] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-sm">카페 추가</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
            <div className="bg-card rounded-xl w-full max-w-md mx-4 shadow-xl">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="카페 이름으로 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.slice(0, 20).map((cafe) => (
                    <button
                      key={cafe.id}
                      onClick={() => handleSelect(cafe)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      {cafe.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cafe.imageUrl}
                          alt={cafe.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-xl">
                          ☕
                        </div>
                      )}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium truncate">{cafe.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{cafe.address}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{(cafe.score / 20).toFixed(1)}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    {cafes.length === 0 ? "카페 데이터 로딩 중..." : "검색 결과가 없습니다"}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                    setActiveSlot(null)
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Results */}
        {selected.length >= 2 && (
          <>
            {/* Radar Chart */}
            <div className="bg-card rounded-xl border border-border p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5" />
                ABSA 측면별 비교
              </h2>
              <div className="flex justify-center mb-4">
                <div className="flex gap-6 flex-wrap justify-center">
                  {selected.map((cafe, index) => (
                    <div key={cafe.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm">{cafe.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <CompareRadarChart cafes={selected} colors={COLORS} />
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold">상세 비교</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">측면</th>
                      {selected.map((cafe, index) => (
                        <th key={cafe.id} className="text-center p-4 font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                            <span className="truncate max-w-[120px]">{cafe.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_ASPECTS.map((key) => {
                      const winnerId = getWinnerId(key)
                      return (
                        <tr key={key} className="border-t border-border">
                          <td className="p-4 font-medium text-sm">{ASPECT_LABELS[key].split('/')[0]}</td>
                          {selected.map((cafe) => {
                            const score = cafe.aspectScores?.[key] ?? 0
                            const isWinner = cafe.id === winnerId
                            return (
                              <td key={cafe.id} className="text-center p-4">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${isWinner ? "bg-primary" : "bg-muted-foreground/50"}`}
                                      style={{ width: `${score}%` }}
                                    />
                                  </div>
                                  <span className={`text-sm font-medium min-w-[36px] ${isWinner ? "text-primary" : ""}`}>
                                    {score}
                                  </span>
                                  {isWinner && <Check className="w-4 h-4 text-primary" />}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selected.map((cafe, index) => {
                const wins = ALL_ASPECTS.filter(key => getWinnerId(key) === cafe.id).length
                const topAspects = ALL_ASPECTS
                  .map(key => ({ key, score: cafe.aspectScores?.[key] ?? 0 }))
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map(({ key }) => ASPECT_LABELS[key].split('/')[0])
                const avgScore = Math.round(
                  ALL_ASPECTS.reduce((s, k) => s + (cafe.aspectScores?.[k] ?? 0), 0) / ALL_ASPECTS.length
                )

                return (
                  <div
                    key={cafe.id}
                    className="bg-card rounded-xl border border-border p-4"
                    style={{ borderColor: COLORS[index] + "40" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <h3 className="font-semibold truncate">{cafe.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">우위 항목</span>
                        <span className="font-medium">{wins}개 / {ALL_ASPECTS.length}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">평균 점수</span>
                        <span className="font-medium">{avgScore}점</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">강점 TOP 3</span>
                        <div className="flex flex-wrap gap-1">
                          {topAspects.map(aspect => (
                            <Badge key={aspect} variant="secondary" className="text-xs">{aspect}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Link href={`/cafe/${cafe.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-4">상세 보기</Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {selected.length < 2 && (
          <div className="text-center py-16">
            <ArrowLeftRight className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">비교할 카페를 선택해주세요</h3>
            <p className="text-muted-foreground text-sm">
              최소 2개의 카페를 선택하면 상세 비교 결과를 확인할 수 있습니다
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
