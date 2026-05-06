export type AspectKey =
  | 'coffee'
  | 'bakery'
  | 'cake'
  | 'cookie'
  | 'bingsu'
  | 'dessert'
  | 'space'
  | 'vibe'
  | 'service'
  | 'price'
  | 'gift'
  | 'crowd'

export const ASPECT_LABELS: Record<AspectKey, string> = {
  coffee:  '커피/음료',
  bakery:  '베이커리/빵',
  cake:    '케이크',
  cookie:  '쿠키/구움과자',
  bingsu:  '빙수/과일',
  dessert: '기타 디저트',
  space:   '공간/편의시설',
  vibe:    '분위기/감성',
  service: '서비스',
  price:   '가격/가성비',
  gift:    '선물/포장',
  crowd:   '혼잡도/웨이팅',
}

export const ALL_ASPECTS = Object.keys(ASPECT_LABELS) as AspectKey[]

export interface Keyword {
  text: string
  sentiment: 'pos' | 'neg' | 'neu'
  count: number
}

export interface Amenities {
  parking:     boolean
  wifi:        boolean
  outlet:      boolean
  pet:         boolean
  takeout:     boolean
  group:       boolean
  reservation: boolean
  kids:        boolean
}

export interface Cafe {
  id:           string
  name:         string
  address:      string
  imageUrl?:    string
  reviewCount:  number
  score:        number                       // 종합 추천 점수 (0~100)
  aspectScores: Record<AspectKey, number>   // 각 측면 점수 (0~100, 데이터 없으면 0)
  keywords:     Partial<Record<AspectKey, Keyword[]>>
  amenities:    Amenities
  isOpen?:      boolean
  lat?:         number
  lon?:         number
  topKeywords?: { keyword: string; count: number }[]
}