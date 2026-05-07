"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Cafe } from "@/lib/types"
import { HomeCafeCard } from "@/components/HomeCafeCard"
import CafeCard from "@/components/CafeCard"

interface HomeCafeListSectionProps {
  title: string
  subtitle?: string
  cafes: Cafe[]
  viewAllLink?: string
  loading?: boolean
  useDetailCard?: boolean
}

export function HomeCafeListSection({
  title,
  subtitle,
  cafes,
  viewAllLink = "/search",
  loading = false,
  useDetailCard = false,
}: HomeCafeListSectionProps) {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            전체보기
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-secondary" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-secondary rounded w-2/3" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : cafes.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            조건에 맞는 카페가 없어요
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useDetailCard
              ? cafes.slice(0, 8).map((cafe, i) => (
                  <CafeCard key={cafe.id} cafe={cafe} rank={i + 1} />
                ))
              : cafes.slice(0, 8).map((cafe) => (
                  <HomeCafeCard key={cafe.id} cafe={cafe} />
                ))}
          </div>
        )}
      </div>
    </section>
  )
}
