import { Cafe, AspectKey, ALL_ASPECTS, Amenities } from './types'
import { CafeSearchItem, CafeDetail, ApiReview } from './api'

const ASPECT_VECTOR_INDEX: Record<AspectKey, number> = {
  coffee: 0, bakery: 1, cake: 2, cookie: 3, bingsu: 4,  dessert: 5,
  space:  6, vibe:   7, service: 8, price: 9, gift:  10, crowd:  11,
}

function vectorToAspectScores(vector: number[]): Record<AspectKey, number> {
  const scores = {} as Record<AspectKey, number>
  for (const key of ALL_ASPECTS) {
    const raw = vector[ASPECT_VECTOR_INDEX[key]] ?? 0
    scores[key] = Math.round(((raw + 1) / 2) * 100)
  }
  return scores
}

function scoreFromAspectScores(scores: Record<AspectKey, number>): number {
  const vals = ALL_ASPECTS.map(k => scores[k]).filter(s => s > 50)
  return vals.length > 0
    ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
    : 0
}

const REVIEW_ASPECT_MAP: Record<AspectKey, keyof ApiReview> = {
  coffee:  'coffeeBeverage',
  bakery:  'bakeryBread',
  cake:    'cake',
  cookie:  'cookieBaked',
  bingsu:  'bingsuFruit',
  dessert: 'otherDessert',
  space:   'spaceFacility',
  vibe:    'atmosphereVibe',
  service: 'service',
  price:   'priceValue',
  gift:    'giftPackaging',
  crowd:   'crowdWaiting',
}

function computeAspectScores(reviews: ApiReview[]): Record<AspectKey, number> {
  const scores = {} as Record<AspectKey, number>
  for (const key of ALL_ASPECTS) {
    const field = REVIEW_ASPECT_MAP[key]
    const vals = reviews
      .map(r => r[field] as number | null | undefined)
      .filter((v): v is number => v != null)
    scores[key] = vals.length > 0
      ? Math.round((vals.reduce((s, v) => s + (v - 1) / 2, 0) / vals.length) * 100)
      : 0
  }
  return scores
}

function mapConvenience(conv: Record<string, boolean>, info: string[]): Amenities {
  const convActive = Object.entries(conv)
    .filter(([, v]) => v)
    .map(([k]) => k.toLowerCase())
  const all = [...convActive, ...info.map(s => s.toLowerCase())]
  const has = (...terms: string[]) => terms.some(t => all.some(s => s.includes(t)))
  return {
    wifi:        has('wifi', 'wi-fi', '와이파이', '무선', 'internet'),
    parking:     has('주차'),
    outlet:      has('콘센트', '전원'),
    pet:         has('반려동물', '애완동물', '펫'),
    takeout:     has('포장', '테이크아웃'),
    group:       has('단체'),
    reservation: has('예약'),
    kids:        has('유아', '키즈', '아이의자'),
  }
}

const EMPTY_AMENITIES: Amenities = {
  wifi: false, parking: false, outlet: false, pet: false,
  takeout: false, group: false, reservation: false, kids: false,
}

const EMPTY_SCORES = ALL_ASPECTS.reduce(
  (acc, k) => ({ ...acc, [k]: 0 }),
  {} as Record<AspectKey, number>,
)

export function mapSearchItem(item: CafeSearchItem): Cafe {
  const keywords = item.topKeywords ?? []
  const reviewCount = keywords.reduce((s, k) => s + k.count, 0)
  const aspectScores = item.aspectVector?.length === 12
    ? vectorToAspectScores(item.aspectVector)
    : { ...EMPTY_SCORES }
  const score = item.aspectVector?.length === 12
    ? scoreFromAspectScores(aspectScores)
    : 0
  return {
    id:           String(item.id),
    name:         item.name,
    address:      item.roadAddress,
    imageUrl:     item.imageUrls?.[0],
    reviewCount,
    score,
    aspectScores,
    keywords:     {},
    amenities:    { ...EMPTY_AMENITIES },
    topKeywords:  keywords,
    lat:          item.lon,   // backend lat/lon fields are swapped
    lon:          item.lat,
  }
}

export function mapDetail(detail: CafeDetail): Cafe {
  const reviews: ApiReview[] = Array.isArray(detail.reviews?.reviews)
    ? detail.reviews.reviews
    : []
  const aspectScores = detail.aspectVector?.length === 12
    ? vectorToAspectScores(detail.aspectVector)
    : computeAspectScores(reviews)
  const score = detail.aspectVector?.length === 12
    ? scoreFromAspectScores(aspectScores)
    : (() => {
        const nonZero = ALL_ASPECTS.map(k => aspectScores[k]).filter(s => s > 0)
        return nonZero.length > 0
          ? Math.round(nonZero.reduce((s, v) => s + v, 0) / nonZero.length)
          : 0
      })()
  const conv: Record<string, boolean> =
    detail.convenience && typeof detail.convenience === 'object' && !Array.isArray(detail.convenience)
      ? detail.convenience
      : {}
  return {
    id:           String(detail.id),
    name:         detail.name,
    address:      detail.address || detail.roadAddress,
    imageUrl:     detail.imageUrls?.[0],
    reviewCount:  detail.reviews?.totalCount ?? reviews.length,
    score,
    aspectScores,
    keywords:     {},
    amenities:    mapConvenience(
      conv,
      Array.isArray(detail.informationFacilitie) ? detail.informationFacilitie : [],
    ),
    lat:          detail.lon,  // backend lat field actually holds longitude (127.xx)
    lon:          detail.lat,  // backend lon field actually holds latitude (37.xx)
    topKeywords:  detail.topKeywords ?? [],
  }
}
