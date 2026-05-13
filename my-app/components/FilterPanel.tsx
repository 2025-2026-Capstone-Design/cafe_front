'use client'

import { useState } from 'react'
import { ALL_ASPECTS, ASPECT_LABELS, AspectKey } from '@/lib/types'

export const ASPECT_KEYWORDS: Record<AspectKey, string[]> = {
  coffee:  ['라떼', '아메리카노', '에스프레소', '원두', '산미', '말차'],
  bakery:  ['베이글', '크로와상', '식빵', '바게트', '스콘', '버터'],
  cake:    ['치즈케이크', '수플레', '티라미수', '생크림', '딸기', '바스크'],
  cookie:  ['쿠키', '브라우니', '마들렌', '까눌레', '마카롱'],
  bingsu:  ['빙수', '망고', '팥빙수', '과일', '수박', '소르베'],
  dessert: ['타르트', '에그타르트', '젤라또', '도넛', '푸딩', '파르페'],
  space:   ['테라스', '야외', '좌석', '주차', '콘센트', '노트북'],
  vibe:    ['분위기', '인테리어', '데이트', '감성', '음악', '힐링'],
  service: ['친절', '예약', '테이크아웃', '응대', '픽업', '정성'],
  price:   ['가격', '세트', '할인', '합리', '쿠폰'],
  gift:    ['포장', '선물', '생일', '기념일', '키링', '박스'],
  crowd:   ['웨이팅', '대기', '평일', '주말', '품절', '만석'],
}

export const CONVENIENCE_OPTIONS = [
  { key: 'wifi',        label: 'Wi-Fi',    apiName: '와이파이' },
  { key: 'parking',     label: '주차',     apiName: '주차' },
  { key: 'outlet',      label: '콘센트',   apiName: '콘센트' },
  { key: 'pet',         label: '반려동물', apiName: '반려동물' },
  { key: 'takeout',     label: '포장',     apiName: '포장' },
  { key: 'group',       label: '단체석',   apiName: '단체석' },
  { key: 'reservation', label: '예약',     apiName: '예약' },
  { key: 'kids',        label: '키즈',     apiName: '키즈' },
]

export type KeywordId = `${AspectKey}:${string}`

type TabKey = AspectKey | 'conveniences'

interface Props {
  applied: KeywordId[]
  appliedConveniences: string[]
  onApply: (keywords: Set<KeywordId>, conveniences: Set<string>) => void
  onReset: () => void
}

export default function FilterPanel({ applied, appliedConveniences, onApply, onReset }: Props) {
  const [curTab, setCurTab] = useState<TabKey>('coffee')
  const [pending, setPending] = useState<Set<KeywordId>>(new Set(applied))
  const [pendingConveniences, setPendingConveniences] = useState<Set<string>>(new Set(appliedConveniences))

  const toggleKw = (id: KeywordId) => {
    setPending((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleConvenience = (apiName: string) => {
    setPendingConveniences((prev) => {
      const next = new Set(prev)
      next.has(apiName) ? next.delete(apiName) : next.add(apiName)
      return next
    })
  }

  const handleReset = () => {
    setPending(new Set())
    setPendingConveniences(new Set())
    onReset()
  }

  const handleApply = () => {
    onApply(new Set(pending), new Set(pendingConveniences))
  }

  return (
    <div className="mt-2 border border-neutral-200 rounded-xl bg-white overflow-hidden">
      <div className="p-4">
        {/* 측면 탭 */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {ALL_ASPECTS.map((key) => {
            const count = [...pending].filter((k) => k.startsWith(key + ':')).length
            return (
              <button
                key={key}
                onClick={() => setCurTab(key)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] border transition-colors
                  ${curTab === key
                    ? 'bg-violet-50 border-violet-300 text-violet-800'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-neutral-400'
                  }`}
              >
                {ASPECT_LABELS[key]}
                {count > 0 && (
                  <span className="text-[10px] bg-violet-200 text-violet-800 px-1.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            )
          })}

          {/* 편의시설 탭 */}
          <button
            onClick={() => setCurTab('conveniences')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] border transition-colors
              ${curTab === 'conveniences'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-neutral-400'
              }`}
          >
            편의시설
            {pendingConveniences.size > 0 && (
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 rounded-full">
                {pendingConveniences.size}
              </span>
            )}
          </button>
        </div>

        <div className="h-px bg-neutral-100 mb-3.5" />

        {/* 키워드 칩 or 편의시설 칩 */}
        <div className="flex flex-wrap gap-2">
          {curTab === 'conveniences' ? (
            CONVENIENCE_OPTIONS.map(({ key, label, apiName }) => (
              <button
                key={key}
                onClick={() => toggleConvenience(apiName)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-colors
                  ${pendingConveniences.has(apiName)
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
              >
                {label}
              </button>
            ))
          ) : (
            ASPECT_KEYWORDS[curTab as AspectKey].map((kw) => {
              const id = `${curTab}:${kw}` as KeywordId
              return (
                <button
                  key={kw}
                  onClick={() => toggleKw(id)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-colors
                    ${pending.has(id)
                      ? 'bg-violet-700 border-violet-700 text-white'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                >
                  {kw}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between items-center px-4 py-3 bg-neutral-50 border-t border-neutral-100">
        <button
          onClick={handleReset}
          className="text-[12px] text-neutral-400 hover:text-neutral-700"
        >
          필터 초기화
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-1.5 bg-violet-700 hover:bg-violet-900 text-white text-[13px] font-medium rounded-lg transition-colors"
        >
          적용하기
        </button>
      </div>
    </div>
  )
}
