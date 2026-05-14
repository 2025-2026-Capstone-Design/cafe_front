const STORAGE_KEY = 'userConveniences'

type ConvenienceKey = 'wifi' | 'parking' | 'outlet' | 'pet' | 'takeout' | 'group' | 'reservation' | 'kids'

const KEY_TO_API_NAME: Partial<Record<ConvenienceKey, string>> = {
  wifi:        '무선 인터넷',
  parking:     '주차',
  pet:         '반려동물 동반',
  group:       '단체 이용 가능',
  kids:        '유아시설',
  reservation: '예약',
  takeout:     '포장',
}

export function getSavedConveniences(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ConvenienceKey[]
    return keys.flatMap(k => {
      const api = KEY_TO_API_NAME[k]
      return api ? [api] : []
    })
  } catch {
    return []
  }
}
