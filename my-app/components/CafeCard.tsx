'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Cafe, AspectKey, ASPECT_LABELS } from '@/lib/types'
import { getRepresentativeKeywords } from '@/lib/ranking'
import { getPreferences, calcMatchRate } from '@/lib/preferences'

interface Props {
  cafe: Cafe
  rank: number
}

function getTopAspects(cafe: Cafe, n = 2): AspectKey[] {
  return (Object.entries(cafe.aspectScores) as [AspectKey, number][])
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([key]) => key)
}

export default function CafeCard({ cafe, rank }: Props) {
  const keywords = getRepresentativeKeywords(cafe)
  const topAspects = getTopAspects(cafe)
  const [matchRate, setMatchRate] = useState<number | null>(null)

  useEffect(() => {
    const prefs = getPreferences()
    setMatchRate(calcMatchRate(cafe.aspectScores, prefs))
  }, [cafe.aspectScores])

  return (
    <Link
      href={`/cafe/${cafe.id}`}
      className="group block rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors duration-150 bg-white"
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-[4/3] bg-neutral-100">
        {cafe.imageUrl ? (
          <Image
            src={cafe.imageUrl}
            alt={cafe.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="14" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 28l8-7 6 5 6-8 12 11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* 바디 */}
      <div className="p-3.5">
        {/* 랭크 + 점수 + 매칭률 */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-neutral-400">#{rank}</span>
          <div className="flex items-center gap-1.5">
            {matchRate !== null && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                ✓ {matchRate}%
              </span>
            )}
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
              {cafe.score}점
            </span>
          </div>
        </div>

        {/* 강점 배지 */}
        <div className="flex gap-1 mb-2">
          {topAspects.map(key => (
            <span key={key} className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
              {ASPECT_LABELS[key].split('/')[0]} {cafe.aspectScores[key]}
            </span>
          ))}
        </div>

        {/* 카페명 */}
        <p className="font-semibold text-[15px] text-neutral-900 truncate mb-0.5 font-serif">
          {cafe.name}
        </p>

        {/* 주소 */}
        <p className="text-[12px] text-neutral-500 truncate mb-2.5">
          {cafe.address}
        </p>

        {/* 키워드 태그 */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {keywords.map((kw) => (
            <span
              key={kw.text}
              className={`text-[11px] px-2 py-0.5 rounded-full border
                ${kw.sentiment === 'pos'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-orange-50 text-orange-800 border-orange-200'
                }`}
            >
              {kw.text}
            </span>
          ))}
        </div>

        {/* 리뷰 수 */}
        <p className="text-[11px] text-neutral-400">
          리뷰 {cafe.reviewCount.toLocaleString()}개
        </p>
      </div>
    </Link>
  )
}