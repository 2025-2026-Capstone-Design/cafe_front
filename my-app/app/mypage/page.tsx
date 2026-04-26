'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUser, clearUser, User } from '@/lib/auth'
import { ALL_ASPECTS, ASPECT_LABELS, AspectKey } from '@/lib/types'

const ASPECT_ICONS: Record<AspectKey, string> = {
  coffee: '☕', bakery: '🥐', cake: '🎂', cookie: '🍪',
  bingsu: '🍧', dessert: '🍮', space: '🪑', vibe: '✨',
  service: '🤝', price: '💰', gift: '🎁', crowd: '🕐',
}

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<AspectKey[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const u = getUser()
    setUser(u)

    const raw = document.cookie
      .split('; ')
      .find(r => r.startsWith('userPreferences='))
      ?.split('=')[1]
    if (raw) {
      try {
        setPreferences(JSON.parse(decodeURIComponent(raw)) as AspectKey[])
      } catch {
        setPreferences([])
      }
    }
    setMounted(true)
  }, [])

  const handleLogout = () => {
    clearUser()
    router.push('/')
  }

  if (!mounted) return null

  if (!user) {
    return (
      <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <p className="text-[15px] font-medium text-neutral-700">로그인이 필요해요</p>
          <p className="text-[13px] text-neutral-400 text-center">
            로그인하면 취향 관리와 더 많은 기능을 이용할 수 있어요.
          </p>
          <div className="flex gap-2 mt-2">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-900 text-white text-[14px] font-medium transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[14px] font-medium transition-colors"
            >
              회원가입
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 py-8">
      {/* 프로필 */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
        <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-lg">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-[16px] font-semibold text-neutral-900">{user.name}</p>
          <p className="text-[13px] text-neutral-400">{user.email}</p>
        </div>
      </div>

      {/* 취향 설정 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-neutral-900">나의 취향</h2>
          <Link
            href="/onboarding"
            className="text-[12px] text-violet-600 hover:underline"
          >
            수정하기
          </Link>
        </div>

        {preferences.length === 0 ? (
          <div className="bg-neutral-50 rounded-xl px-4 py-5 text-center">
            <p className="text-[13px] text-neutral-400 mb-3">아직 취향이 설정되지 않았어요</p>
            <Link
              href="/onboarding"
              className="text-[13px] text-violet-600 font-medium hover:underline"
            >
              취향 설정하기 →
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {preferences.map(key => (
              <span
                key={key}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-[13px] text-violet-800"
              >
                <span>{ASPECT_ICONS[key]}</span>
                {ASPECT_LABELS[key]}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 메뉴 */}
      <section className="mb-8">
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-3">메뉴</h2>
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
          <Link
            href="/bookmark"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-neutral-400">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
              <span className="text-[14px] text-neutral-700">찜한 카페</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-xl border border-neutral-200 text-[14px] text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
      >
        로그아웃
      </button>
    </main>
  )
}
