import { Cafe, AspectKey } from './types'

/**
 * 필터 없음 → 종합 score 기준 정렬
 * 필터 있음 → 선택된 측면들의 유클리드 거리 기반 재랭킹
 *   (선택 측면 점수가 100에 가까울수록 상위)
 */
export function rankCafes(cafes: Cafe[], activeAspects: AspectKey[]): Cafe[] {
  if (activeAspects.length === 0) {
    return [...cafes].sort((a, b) => b.score - a.score)
  }

  // 이상적인 벡터: 선택된 모든 측면이 100점
  const ideal = 100

  const withDist = cafes.map((cafe) => {
    const sumSq = activeAspects.reduce((acc, key) => {
      const diff = ideal - (cafe.aspectScores[key] ?? 0)
      return acc + diff * diff
    }, 0)
    const distance = Math.sqrt(sumSq)
    return { cafe, distance }
  })

  return withDist
    .sort((a, b) => a.distance - b.distance)
    .map((item) => item.cafe)
}

/**
 * 카드에 보여줄 대표 키워드 (긍정 2개 + 부정 1개, 빈도순)
 */
export function getRepresentativeKeywords(cafe: Cafe, max = 3) {
  const all = Object.values(cafe.keywords).flat()
  const pos = all.filter((k) => k.sentiment === 'pos').sort((a, b) => b.count - a.count)
  const neg = all.filter((k) => k.sentiment === 'neg').sort((a, b) => b.count - a.count)

  return [
    ...pos.slice(0, max - 1),
    ...neg.slice(0, 1),
  ].slice(0, max)
}