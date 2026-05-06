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
  lat: number
  lon: number
  businessHours: string
  convenience: string[]
  informationFacilitie: string[]
  menus: unknown[]
  reviews: ApiReview[]
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
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    aspectVector: aspectVector.join(','),
    page: String(page),
    limit: String(limit),
  })
  const res = await fetch(`${BASE_URL}/cafe/search?${params}`)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
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
