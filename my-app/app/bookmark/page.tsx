'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBookmarks } from '@/lib/bookmarks'
import { MOCK_CAFES } from '@/lib/mockData'
import { Cafe } from '@/lib/types'
import CafeCard from '@/components/CafeCard'

export default function BookmarkPage() {
  const [bookmarkedCafes, setBookmarkedCafes] = useState<Cafe[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const ids = getBookmarks()
    const cafes = MOCK_CAFES.filter(c => ids.includes(c.id))  // ids and c.id are both strings
    setBookmarkedCafes(cafes)
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900 tracking-tight">
          찜한 카페
        </h1>
        {bookmarkedCafes.length > 0 && (
          <span className="text-[13px] text-neutral-400">{bookmarkedCafes.length}개</span>
        )}
      </div>

      {bookmarkedCafes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          <p className="text-[14px] text-neutral-400">아직 찜한 카페가 없어요</p>
          <Link
            href="/"
            className="mt-1 text-[13px] text-violet-600 font-medium hover:underline"
          >
            카페 둘러보기 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookmarkedCafes.map((cafe, i) => (
            <CafeCard key={cafe.id} cafe={cafe} rank={i + 1} />
          ))}
        </div>
      )}
    </main>
  )
}
