'use client'

import { useState } from 'react'
import { ALL_ASPECTS, ASPECT_LABELS, AspectKey } from '@/lib/types'

// 측면별 세부 키워드 (각 5개)
export const ASPECT_KEYWORDS: Record<AspectKey, string[]> = {
  coffee:  ['아메리카노', '라떼', '카푸치노', '콜드브루', '핸드드립'],
  bakery:  ['크루아상', '소금빵', '스콘', '바게트', '식빵'],
  cake:    ['딸기케이크', '생크림', '조각케이크', '생일케이크', '치즈케이크'],
  cookie:  ['초코칩쿠키', '브라우니', '피낭시에', '마들렌', '쇼트브레드'],
  bingsu:  ['팥빙수', '과일빙수', '망고빙수', '딸기빙수', '눈꽃빙수'],
  dessert: ['와플', '크레페', '푸딩', '타르트', '파르페'],
  space:   ['넓은좌석', '콘센트', '주차가능', '개인석', '루프탑'],
  vibe:    ['조용한', '한옥', '인스타감성', '빈티지', '모던'],
  service: ['친절함', '빠른응대', '리필가능', '포장잘됨', '예약가능'],
  price:   ['가성비좋음', '저렴한', '합리적', '세트할인', '쿠폰'],
  gift:    ['선물박스', '리본포장', '케이크박스', '기프트백', '보냉백'],
  crowd:   ['평일한산', '웨이팅없음', '예약필수', '주말혼잡', '회전빠름'],
}

// 키워드 ID 형식: "coffee:아메리카노"
export type KeywordId = `${AspectKey}:${string}`

interface Props {
  applied: KeywordId[]
  onApply: (selected: Set<KeywordId>) => void
  onReset: () => void
}

export default function FilterPanel({ applied, onApply, onReset }: Props) {
  const [curTab, setCurTab] = useState<AspectKey>('coffee')
  const [pending, setPending] = useState<Set<KeywordId>>(new Set(applied))

  const toggleKw = (id: KeywordId) => {
    setPending((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleReset = () => {
    setPending(new Set())
    onReset()
  }

  const handleApply = () => {
    onApply(new Set(pending))
  }
  console.log('FilterPanel render')
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
        </div>

        <div className="h-px bg-neutral-100 mb-3.5" />

        {/* 키워드 칩 */}
        <div className="flex flex-wrap gap-2">
          {ASPECT_KEYWORDS[curTab].map((kw) => {
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
          })}
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