'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_ASPECTS, ASPECT_LABELS, AspectKey } from '@/lib/types'
import { getPreferences } from '@/lib/preferences'

const ASPECT_ICONS: Record<AspectKey, string> = {
  coffee:  '☕',
  bakery:  '🥐',
  cake:    '🎂',
  cookie:  '🍪',
  bingsu:  '🍧',
  dessert: '🍮',
  space:   '🪑',
  vibe:    '✨',
  service: '🤝',
  price:   '💰',
  gift:    '🎁',
  crowd:   '🕐',
}

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<AspectKey>>(new Set())

  useEffect(() => {
    const prefs = getPreferences()
    if (prefs.length > 0) setSelected(new Set(prefs))
  }, [])

  const toggle = (key: AspectKey) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const handleStart = () => {
  document.cookie = `userPreferences=${JSON.stringify([...selected])}; path=/; max-age=${60 * 60 * 24 * 365}`
  router.push('/')
}

const handleSkip = () => {
  document.cookie = `userPreferences=[]; path=/; max-age=${60 * 60 * 24 * 365}`
  router.push('/')
}

  return (
    <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-5 py-8">
      {/* 스텝 인디케이터 */}
      <p className="text-[11px] text-neutral-400 mb-6 tracking-wide">
        취향 설정 <span className="text-violet-600 font-medium">1/1</span>
      </p>

      <h1 className="font-serif text-[22px] font-semibold text-neutral-900 leading-snug mb-2">
        어떤 카페를<br />좋아하세요?
      </h1>
      <p className="text-[13px] text-neutral-500 mb-8 leading-relaxed">
        관심 있는 항목을 골라주세요.<br />
        선택한 취향으로 <span className="text-violet-600 font-medium">맞춤 카페</span>를 추천해드려요.
      </p>

      {/* 측면 카드 3열 그리드 */}
      <div className="grid grid-cols-3 gap-2.5 mb-8">
        {ALL_ASPECTS.map((key) => {
          const isOn = selected.has(key)
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`relative flex flex-col items-center py-4 px-2 rounded-xl border transition-all duration-120 text-center
                ${isOn
                  ? 'bg-violet-50 border-violet-300'
                  : 'bg-white border-neutral-200 hover:border-neutral-400'
                }`}
            >
              {/* 체크 뱃지 */}
              {isOn && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-700 flex items-center justify-center">
                  <svg width="8" height="7" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="1.8">
                    <path d="M1 4l3 3 5-6" />
                  </svg>
                </span>
              )}

              {/* 아이콘 */}
              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2.5
                ${isOn ? 'bg-violet-100' : 'bg-neutral-100'}`}>
                {ASPECT_ICONS[key]}
              </span>

              {/* 라벨 */}
              <span className={`text-[12px] leading-tight
                ${isOn ? 'text-violet-800 font-medium' : 'text-neutral-500'}`}>
                {ASPECT_LABELS[key]}
              </span>
            </button>
          )
        })}
      </div>

      {/* 하단 CTA */}
      <div className="sticky bottom-0 pb-2 bg-white pt-2">
        <p className="text-[12px] text-center text-neutral-400 mb-2.5">
          {selected.size === 0
            ? '0개 선택됨'
            : <><span className="text-violet-600 font-medium">{selected.size}개</span> 선택됨</>
          }
        </p>

        <button
          onClick={handleStart}
          disabled={selected.size === 0}
          className="w-full py-3.5 rounded-xl text-[15px] font-medium transition-colors
            disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
            bg-violet-700 hover:bg-violet-900 text-white"
        >
          {selected.size === 0 ? '시작하기' : `${selected.size}개 취향으로 시작하기`}
        </button>

        <button
          onClick={handleSkip}
          className="w-full mt-3 text-[12px] text-neutral-400 hover:text-neutral-600 bg-transparent border-none cursor-pointer"
        >
          나중에 설정할게요
        </button>
      </div>
    </main>
  )
}