import { Cafe } from './types'

const BOOKMARK_KEY = 'cafe_bookmarks'

export function getBookmarks(): Cafe[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(BOOKMARK_KEY)
  if (!raw) return []
  const list = JSON.parse(raw) as Cafe[]
  return list.filter(c => c.id && c.name)
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some(c => c.id === id)
}

export function toggleBookmark(cafe: Cafe): boolean {
  const list = getBookmarks()
  const idx = list.findIndex(c => c.id === cafe.id)
  if (idx === -1) {
    list.push(cafe)
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list))
    return true
  } else {
    list.splice(idx, 1)
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list))
    return false
  }
}
