"use client"

import { useRouter } from "next/navigation"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

const popularAreas = [
  { name: "강남", count: 342 },
  { name: "성수", count: 287 },
  { name: "홍대", count: 256 },
  { name: "이태원", count: 198 },
  { name: "연남동", count: 176 },
  { name: "망원", count: 143 },
]

export function LocationBanner() {
  const router = useRouter()

  return (
    <section className="py-10 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">내 주변 카페 찾기</h3>
              <p className="text-sm text-muted-foreground">
                현재 위치 기반으로 가까운 추천 카페를 확인하세요
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {popularAreas.map((area, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(area.name)}`)}
                  className="px-3 py-1.5 text-sm bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
                >
                  {area.name}
                  <span className="ml-1 text-muted-foreground text-xs group-hover:text-primary-foreground">
                    {area.count}
                  </span>
                </button>
              ))}
            </div>
            <Button className="gap-2 shrink-0" onClick={() => router.push("/search")}>
              <Navigation className="h-4 w-4" />
              카페 검색하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
