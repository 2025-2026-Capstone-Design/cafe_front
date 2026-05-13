'use client'

import { useEffect, useRef, useState } from 'react'
import { KeywordId, CONVENIENCE_OPTIONS } from './FilterPanel'
import { ASPECT_LABELS, AspectKey } from '@/lib/types'
import { getRecentSearches, addRecentSearch, removeRecentSearch } from '@/lib/recentSearches'

interface Props {
  onSearch?: (q: string) => void
  query: string
  onQueryChange: (v: string) => void
  filterOpen: boolean
  onFilterToggle: () => void
  appliedCount: number
  appliedKeywords: KeywordId[]
  onRemoveKeyword: (id: KeywordId) => void
  appliedConveniences?: string[]
  onRemoveConvenience?: (apiName: string) => void
}

export default function SearchBar({
  query, onQueryChange,
  filterOpen, onFilterToggle,
  appliedCount, appliedKeywords, onRemoveKeyword, onSearch,
  appliedConveniences, onRemoveConvenience,
}: Props) {
  const [focused, setFocused] = useState(false)
  const [recents, setRecents] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRecents(getRecentSearches())
  }, [focused])

  // 포커스 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showDropdown = focused && recents.length > 0

  const handleSelect = (q: string) => {
    onQueryChange(q)
    addRecentSearch(q)
    setFocused(false)
    onSearch?.(q)
  }

  const handleSearch = () => {
    if (query.trim()) {
      addRecentSearch(query.trim())
      onSearch?.(query)
    }
  }

  const handleRemoveRecent = (e: React.MouseEvent, q: string) => {
    e.stopPropagation()
    removeRecentSearch(q)
    setRecents(getRecentSearches())
  }

  return (
    <div className="relative">
      {/* 검색창 + 필터 버튼 */}
      <div className="flex gap-2 items-center">
        <div className={`flex-1 flex items-center gap-2 border rounded-xl px-3.5 py-2.5 bg-white transition-colors
          ${focused ? 'border-violet-400 ring-2 ring-violet-100' : 'border-neutral-300'}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-neutral-400 shrink-0">
            <circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
            placeholder="카페 이름으로 검색..."
            className="flex-1 text-[14px] outline-none bg-transparent text-neutral-900 placeholder:text-neutral-400"
          />
          {query && (
            <button onClick={() => { onQueryChange(''); inputRef.current?.focus() }}
              className="text-neutral-300 hover:text-neutral-500 shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={onFilterToggle}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-[13px] transition-colors whitespace-nowrap
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

      {/* 드롭다운 */}
      {showDropdown && (
        <div ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden">

          {/* 최근 검색어 */}
          {!query.trim() && recents.length > 0 && (
            <div>
              <p className="px-4 pt-2.5 pb-1 text-[11px] text-neutral-400 font-medium">최근 검색어</p>
              {recents.map(r => (
                <div key={r} className="flex items-center gap-2 px-4 hover:bg-neutral-50">
                  <button onClick={() => handleSelect(r)}
                    className="flex-1 flex items-center gap-2.5 py-2.5 text-left">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
                      <path d="M3 12a9 9 0 1018 0A9 9 0 003 12zm9-4v4l3 3"/>
                    </svg>
                    <span className="text-[13px] text-neutral-700">{r}</span>
                  </button>
                  <button onClick={e => handleRemoveRecent(e, r)}
                    className="text-neutral-300 hover:text-neutral-500 p-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 적용된 필터 태그 */}
      {(appliedKeywords.length > 0 || (appliedConveniences?.length ?? 0) > 0) && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {appliedKeywords.map((id) => {
            const [asp, kw] = id.split(':') as [AspectKey, string]
            return (
              <span key={id}
                className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                {ASPECT_LABELS[asp]} · {kw}
                <button onClick={() => onRemoveKeyword(id)}
                  className="text-violet-400 hover:text-violet-700 leading-none text-[14px]">
                  ×
                </button>
              </span>
            )
          })}
          {appliedConveniences?.map((apiName) => {
            const option = CONVENIENCE_OPTIONS.find(o => o.apiName === apiName)
            return (
              <span key={apiName}
                className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {option?.label ?? apiName}
                <button onClick={() => onRemoveConvenience?.(apiName)}
                  className="text-emerald-400 hover:text-emerald-700 leading-none text-[14px]">
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
