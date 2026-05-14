'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = 'userConveniences'

type ConvenienceKey = 'wifi' | 'parking' | 'outlet' | 'pet' | 'takeout' | 'group' | 'reservation' | 'kids'

const CONVENIENCE_ITEMS: { key: ConvenienceKey; icon: string; label: string; desc: string }[] = [
  { key: 'wifi',        icon: '📶', label: '와이파이',   desc: '무료 와이파이 제공' },
  { key: 'parking',     icon: '🚗', label: '주차',       desc: '주차 공간 있음' },
  { key: 'outlet',      icon: '🔌', label: '콘센트',     desc: '좌석 콘센트 제공' },
  { key: 'pet',         icon: '🐾', label: '반려동물',   desc: '반려동물 동반 가능' },
  { key: 'takeout',     icon: '🥡', label: '포장',       desc: '테이크아웃 가능' },
  { key: 'group',       icon: '👥', label: '단체석',     desc: '단체 이용 가능' },
  { key: 'reservation', icon: '📅', label: '예약',       desc: '사전 예약 가능' },
  { key: 'kids',        icon: '🧒', label: '키즈존',     desc: '어린이 동반 가능' },
]

function getSavedConveniences(): ConvenienceKey[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ConvenienceKey[]
  } catch {
    return []
  }
}

export default function ConveniencesPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<ConvenienceKey>>(new Set())

  useEffect(() => {
    const saved = getSavedConveniences()
    if (saved.length > 0) setSelected(new Set(saved))
  }, [])

  const toggle = (key: ConvenienceKey) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]))
    router.back()
  }

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, '[]')
    router.back()
  }

  return (
    <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-5 py-8">
      <p className="text-[11px] text-neutral-400 mb-6 tracking-wide">
        편의시설 설정 <span className="text-violet-600 font-medium">선택사항</span>
      </p>

      <h1 className="font-serif text-[22px] font-semibold text-neutral-900 leading-snug mb-2">
        어떤 편의시설이<br />필요하세요?
      </h1>
      <p className="text-[13px] text-neutral-500 mb-8 leading-relaxed">
        원하는 항목을 골라주세요.<br />
        선택한 편의시설이 있는 <span className="text-violet-600 font-medium">카페를 우선 추천</span>해드려요.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
        {CONVENIENCE_ITEMS.map(({ key, icon, label, desc }) => {
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
              {isOn && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-700 flex items-center justify-center">
                  <svg width="8" height="7" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="1.8">
                    <path d="M1 4l3 3 5-6" />
                  </svg>
                </span>
              )}

              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2.5
                ${isOn ? 'bg-violet-100' : 'bg-neutral-100'}`}>
                {icon}
              </span>

              <span className={`text-[12px] font-medium leading-tight mb-1
                ${isOn ? 'text-violet-800' : 'text-neutral-700'}`}>
                {label}
              </span>
              <span className="text-[10px] text-neutral-400 leading-tight">{desc}</span>
            </button>
          )
        })}
      </div>

      <div className="sticky bottom-0 pb-2 bg-white pt-2">
        <p className="text-[12px] text-center text-neutral-400 mb-2.5">
          {selected.size === 0
            ? '0개 선택됨'
            : <><span className="text-violet-600 font-medium">{selected.size}개</span> 선택됨</>
          }
        </p>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl text-[15px] font-medium transition-colors
            bg-violet-700 hover:bg-violet-900 text-white"
        >
          {selected.size === 0 ? '설정 없이 저장' : `${selected.size}개 편의시설 저장`}
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
