const KEY = 'cafe_recent_searches'
const MAX = 5

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as string[]) : []
}

export function addRecentSearch(q: string): void {
  const trimmed = q.trim()
  if (!trimmed) return
  const list = getRecentSearches().filter(s => s !== trimmed)
  list.unshift(trimmed)
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
}

export function removeRecentSearch(q: string): void {
  const list = getRecentSearches().filter(s => s !== q)
  localStorage.setItem(KEY, JSON.stringify(list))
}
