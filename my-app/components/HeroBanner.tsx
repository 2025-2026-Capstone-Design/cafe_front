"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

const bannerSlides = [
  {
    id: 1,
    title: "AI가 분석한\n당신만의 카페",
    subtitle: "수천 개의 리뷰를 ABSA로 분석해\n분위기, 맛, 서비스까지 세밀하게 추천",
    cta: "취향 설정하기",
    href: "/onboarding",
    bgImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&h=600&fit=crop",
  },
  {
    id: 2,
    title: "이번 주 인기 카페",
    subtitle: "긍정 리뷰 분석 TOP\n직접 가본 고객들이 극찬한 카페",
    cta: "카페 둘러보기",
    href: "/search",
    bgImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&h=600&fit=crop",
  },
  {
    id: 3,
    title: "내 취향에 딱 맞는\n카페 추천",
    subtitle: "커피, 디저트, 분위기 등\n원하는 요소로 맞춤 카페를 찾아보세요",
    cta: "지금 검색하기",
    href: "/search",
    bgImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&h=600&fit=crop",
  },
]

export function HeroBanner() {
  const router = useRouter()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev() }, [emblaApi])
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext() }, [emblaApi])
  const scrollTo = useCallback((index: number) => { if (emblaApi) emblaApi.scrollTo(index) }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

  return (
    <section className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {bannerSlides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0 aspect-[16/7] md:aspect-[16/5]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="text-card max-w-lg">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold whitespace-pre-line leading-tight">
                    {slide.title}
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-card/90 whitespace-pre-line leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Button
                    className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3"
                    onClick={() => router.push(slide.href)}
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 hover:bg-card rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 hover:bg-card rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex ? "bg-card w-6" : "bg-card/50 hover:bg-card/70 w-2"
            }`}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
