'use client'

import { KeywordId } from './FilterPanel'
import { ASPECT_LABELS, AspectKey } from '@/lib/types'
console.log('SearchBar render')
interface Props {
  onSearch?: (q: string) => void
  query: string
  onQueryChange: (v: string) => void
  filterOpen: boolean
  onFilterToggle: () => void
  appliedCount: number
  appliedKeywords: KeywordId[]
  onRemoveKeyword: (id: KeywordId) => void
}

export default function SearchBar({
  query, onQueryChange,
  filterOpen, onFilterToggle,
  appliedCount, appliedKeywords, onRemoveKeyword,onSearch
}: Props) {
  return (
    <div>
      {/* 검색창 + 필터 버튼 */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 flex items-center gap-2 border border-neutral-300 rounded-xl px-3.5 py-2.5 bg-white">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-neutral-400 shrink-0">
            <circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSearch?.(query) }}  // ← 추가
            placeholder="카페 이름으로 검색..."
            className="flex-1 text-[14px] outline-none bg-transparent text-neutral-900 placeholder:text-neutral-400"
          />
          {query && (
            <button onClick={() => onSearch?.(query)} className="text-neutral-400 shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>
            </svg>
          </button>
          )}
        </div>

        <button
          onClick={onFilterToggle}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-[13px] transition-colors whitespace-nowrap
            ${filterOpen || appliedCount > 0
              ? 'bg-violet-700 border-violet-700 text-white'
              : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400'
            }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="7" y1="12" x2="17" y2="12"/>
            <line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
          필터
          {appliedCount > 0 && (
            <span className="text-[10px] bg-violet-500 text-white px-1.5 py-0.5 rounded-full leading-none">
              {appliedCount}
            </span>
          )}
        </button>
      </div>

      {/* 적용된 필터 태그 */}
      {appliedKeywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {appliedKeywords.map((id) => {
            const [asp, kw] = id.split(':') as [AspectKey, string]
            return (
              <span
                key={id}
                className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200"
              >
                {ASPECT_LABELS[asp]} · {kw}
                <button
                  onClick={() => onRemoveKeyword(id)}
                  className="text-violet-400 hover:text-violet-700 leading-none text-[14px]"
                >
                  ×
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}