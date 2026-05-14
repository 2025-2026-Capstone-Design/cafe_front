"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Heart, Cake, Users, Wifi } from "lucide-react"

const featuredSlides = [
  {
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    badge: "이 달의 커피 픽",
    title: "커피맛 만족도 TOP",
    barista: "바리스타 김민준",
    comment: "\"원두 본연의 향이 살아있는 곳만 골랐어요. 아메리카노 한 잔이 하루를 바꿔줄 거예요.\"",
    href: "/search?aspect=coffee",
  },
  {
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    badge: "디저트 픽",
    title: "케이크 맛집 모음",
    barista: "바리스타 이서연",
    comment: "\"달콤한 케이크 한 조각이 하루의 피로를 날려줘요. 제가 직접 다녀온 곳들이에요.\"",
    href: "/search?aspect=cake",
  },
  {
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    badge: "공간 추천",
    title: "분위기 좋은 카페",
    barista: "바리스타 박도현",
    comment: "\"공간 자체가 힐링이 되는 카페들이에요. 사진도 찍고 책도 읽기 딱 좋아요.\"",
    href: "/search?aspect=vibe",
  },
]

const smallBanners = [
  {
    id: 1,
    title: "취향 설정",
    subtitle: "내 입맛에 맞는 카페",
    description: "12가지 항목으로 맞춤 추천을 받아보세요",
    icon: Heart,
    href: "/onboarding",
    bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
  {
    id: 2,
    title: "편의시설 설정",
    subtitle: "내가 원하는 환경",
    description: "와이파이·주차·콘센트 등 원하는 시설을 설정하세요",
    icon: Wifi,
    href: "/conveniences",
    bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "디저트 맛집",
    subtitle: "디저트 만족도 TOP",
    description: "케이크·빙수·베이커리 긍정 리뷰가 가장 많은 카페",
    icon: Cake,
    href: "/search?aspect=dessert",
    bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "조용한 공간",
    subtitle: "혼잡도 낮은 카페",
    description: "집중하기 좋은 카페만 모았어요",
    icon: Users,
    href: "/search?aspect=crowd",
    bgColor: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
]

export function PromoBanners() {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + featuredSlides.length) % featuredSlides.length), [])
  const next = useCallback(() =>
    setCurrent(c => (c + 1) % featuredSlides.length), [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = featuredSlides[current]

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* ── 대형 슬라이더 배너 ── */}
        <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-2xl min-h-[280px] lg:min-h-[400px]">
          {/* 슬라이드 이미지들 */}
          {featuredSlides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            </div>
          ))}

          {/* 콘텐츠 */}
          <Link href={slide.href} className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {slide.badge}
              </span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              {slide.title}
            </h3>

            {/* 바리스타 코멘트 */}
            <div className="flex items-start gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 mt-0.5 text-base">
                ☕
              </div>
              <div>
                <p className="text-xs text-white/60 mb-0.5">{slide.barista}</p>
                <p className="text-sm text-white/90 leading-relaxed italic">{slide.comment}</p>
              </div>
            </div>

            <div className="flex items-center text-white font-medium text-sm gap-2 group-hover:gap-3 transition-all">
              자세히 보기
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 좌우 화살표 */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* 도트 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {featuredSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── 중형 배너 4개 ── */}
        {smallBanners.map((banner) => {
          const Icon = banner.icon
          return (
            <Link
              key={banner.id}
              href={banner.href}
              className={`group relative overflow-hidden rounded-2xl ${banner.bgColor} p-5 flex flex-col justify-between min-h-[180px]`}
            >
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative">
                <p className="text-white/75 text-xs font-medium mb-1">{banner.subtitle}</p>
                <h3 className="text-lg font-bold text-white mb-1.5">{banner.title}</h3>
                <p className="text-sm text-white/65 line-clamp-2">{banner.description}</p>
              </div>
              <div className="relative flex items-center text-white/90 font-medium text-sm mt-3 gap-1 transition-all group-hover:gap-2">
                바로가기
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
