"use client"

import Link from "next/link"
import { ArrowRight, Cake, Clock, Users, Leaf } from "lucide-react"

const secondaryBanners = [
  {
    id: 1,
    title: "조용한 작업 공간",
    subtitle: "집중이 필요할 때",
    description: "혼잡도 점수가 낮은 카페만 모았어요",
    icon: Users,
    href: "/search?aspect=crowd",
    gradient: "from-slate-700 to-slate-900",
    iconBg: "bg-slate-500",
  },
  {
    id: 2,
    title: "공간·편의시설",
    subtitle: "넓고 쾌적한 카페",
    description: "공간 만족도가 높고 편의시설이 잘 갖춰진 카페",
    icon: Clock,
    href: "/search?aspect=space",
    gradient: "from-indigo-600 to-indigo-800",
    iconBg: "bg-indigo-400",
  },
  {
    id: 3,
    title: "디저트 맛집",
    subtitle: "디저트 만족도 TOP",
    description: "케이크, 베이커리가 맛있는 카페",
    icon: Cake,
    href: "/search?aspect=cake",
    gradient: "from-orange-500 to-red-600",
    iconBg: "bg-orange-400",
  },
  {
    id: 4,
    title: "감성 분위기",
    subtitle: "분위기 좋은 카페",
    description: "분위기·인테리어 긍정 리뷰가 많은 카페",
    icon: Leaf,
    href: "/search?aspect=vibe",
    gradient: "from-green-500 to-emerald-600",
    iconBg: "bg-green-400",
  },
]

export function SecondaryBanners() {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">테마별 탐색</h2>
        <Link
          href="/search"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          전체보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryBanners.map((banner) => {
          const Icon = banner.icon
          return (
            <Link
              key={banner.id}
              href={banner.href}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${banner.gradient} p-4 transition-transform hover:scale-[1.02]`}
            >
              <div className={`w-10 h-10 rounded-lg ${banner.iconBg} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 text-xs mb-0.5">{banner.subtitle}</p>
              <h3 className="text-base font-bold text-white mb-1">{banner.title}</h3>
              <p className="text-xs text-white/60 line-clamp-1">{banner.description}</p>
              <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-white/50 transition-transform group-hover:translate-x-1" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
