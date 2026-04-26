const BOOKMARK_KEY = 'cafe_bookmarks'

export function getBookmarks(): number[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(BOOKMARK_KEY)
  return raw ? (JSON.parse(raw) as number[]) : []
}

export function isBookmarked(id: number): boolean {
  return getBookmarks().includes(id)
}

// 북마크 토글 — 추가됐으면 true, 제거됐으면 false 반환
export function toggleBookmark(id: number): boolean {
  const list = getBookmarks()
  const idx = list.indexOf(id)
  if (idx === -1) {
    list.push(id)
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list))
    return true
  } else {
    list.splice(idx, 1)
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list))
    return false
  }
}
