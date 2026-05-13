const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export interface TopKeyword {
  keyword: string
  count: number
}

export interface CafeSearchItem {
  id: string
  name: string
  category: string
  roadAddress: string
  imageUrls: string[]
  description: string
  topKeywords: TopKeyword[]
  aspectVector?: number[]  // 12-dim, from cafe_aspect_vectors via cache
  lat?: number             // backend stores longitude here (~127)
  lon?: number             // backend stores latitude here (~37)
}

export interface SearchResponse {
  cafes: CafeSearchItem[]
  totalCount: number
  totalPages: number
}

export interface ApiReview {
  id: number
  cafeId: string
  userId: string
  reviewText: string
  coffeeBeverage?: number | null
  bakeryBread?: number | null
  cake?: number | null
  cookieBaked?: number | null
  bingsuFruit?: number | null
  otherDessert?: number | null
  spaceFacility?: number | null
  atmosphereVibe?: number | null
  service?: number | null
  priceValue?: number | null
  giftPackaging?: number | null
  crowdWaiting?: number | null
  createdAt: string
}

export interface CafeDetail extends CafeSearchItem {
  microReview: string
  address: string
  lat: number   // backend returns 127.xx here (actually longitude)
  lon: number   // backend returns 37.xx here (actually latitude)
  businessHours: string
  convenience: Record<string, boolean>
  informationFacilitie: string[]
  menus: unknown[]
  reviews: { reviews: ApiReview[]; totalCount: number }
}

const ASPECT_INDEX: Record<string, number> = {
  coffee: 0, bakery: 1, cake: 2, cookie: 3, bingsu: 4, dessert: 5,
  space: 6, vibe: 7, service: 8, price: 9, gift: 10, crowd: 11,
}

export function aspectsToVector(aspects: string[]): number[] {
  const vector = new Array(12).fill(0) as number[]
  for (const a of aspects) {
    const idx = ASPECT_INDEX[a]
    if (idx !== undefined) vector[idx] = 1
  }
  return vector
}

export async function searchCafes(
  aspectVector: number[],
  page = 1,
  limit = 50,
  conveniences: string[] = [],
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    aspectVector: aspectVector.join(','),
    page: String(page),
    limit: String(limit),
  })
  if (conveniences.length > 0) params.set('conveniences', conveniences.join(','))
  const res = await fetch(`${BASE_URL}/cafe/search?${params}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json() as Promise<SearchResponse>
}

export async function searchCafesAdvanced(
  aspectVector: number[],
  keywords: string[],
  page = 1,
  limit = 50,
  conveniences: string[] = [],
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    aspectVector: aspectVector.join(','),
    keywords: keywords.join(','),
    page: String(page),
    limit: String(limit),
  })
  if (conveniences.length > 0) params.set('conveniences', conveniences.join(','))
  const res = await fetch(`${BASE_URL}/cafe/search/advanced?${params}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Advanced search failed: ${res.status}`)
  return res.json() as Promise<SearchResponse>
}

export async function getCafeDetail(id: string): Promise<CafeDetail> {
  const res = await fetch(`${BASE_URL}/cafe/${id}`)
  if (!res.ok) throw new Error(`Detail fetch failed: ${res.status}`)
  return res.json() as Promise<CafeDetail>
}

export async function getReviews(
  cafeId: string,
  page = 1,
  limit = 20,
): Promise<{ reviews: ApiReview[] }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  const res = await fetch(`${BASE_URL}/cafe/${cafeId}/reviews?${params}`)
  if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`)
  return res.json() as Promise<{ reviews: ApiReview[] }>
}
