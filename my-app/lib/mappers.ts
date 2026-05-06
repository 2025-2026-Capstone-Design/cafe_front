import { Cafe, AspectKey, ALL_ASPECTS, Amenities } from './types'
import { CafeSearchItem, CafeDetail, ApiReview } from './api'

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

function mapConvenience(convenience: string[], info: string[]): Amenities {
  const all = [...convenience, ...info].map(s => s.toLowerCase())
  const has = (...terms: string[]) => terms.some(t => all.some(s => s.includes(t)))
  return {
    wifi:        has('wifi', 'wi-fi', '와이파이', '무선인터넷'),
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
  const reviewCount = item.topKeywords.reduce((s, k) => s + k.count, 0)
  return {
    id:           item.id,
    name:         item.name,
    address:      item.roadAddress,
    imageUrl:     item.imageUrls?.[0],
    reviewCount,
    score:        0,
    aspectScores: { ...EMPTY_SCORES },
    keywords:     {},
    amenities:    { ...EMPTY_AMENITIES },
    topKeywords:  item.topKeywords,
  }
}

export function mapDetail(detail: CafeDetail): Cafe {
  const aspectScores = computeAspectScores(detail.reviews)
  const nonZero = ALL_ASPECTS.map(k => aspectScores[k]).filter(s => s > 0)
  const score = nonZero.length > 0
    ? Math.round(nonZero.reduce((s, v) => s + v, 0) / nonZero.length)
    : 0
  return {
    id:           detail.id,
    name:         detail.name,
    address:      detail.address || detail.roadAddress,
    imageUrl:     detail.imageUrls?.[0],
    reviewCount:  detail.reviews.length,
    score,
    aspectScores,
    keywords:     {},
    amenities:    mapConvenience(detail.convenience ?? [], detail.informationFacilitie ?? []),
    lat:          detail.lat,
    lon:          detail.lon,
    topKeywords:  detail.topKeywords,
  }
}
