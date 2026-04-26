'use client'

import { ALL_ASPECTS, AspectKey } from '@/lib/types'

const SHORT_LABELS: Record<AspectKey, string> = {
  coffee: '커피', bakery: '베이커리', cake: '케이크', cookie: '쿠키',
  bingsu: '빙수', dessert: '디저트', space: '공간', vibe: '분위기',
  service: '서비스', price: '가격', gift: '선물', crowd: '혼잡도',
}

interface Props {
  scores: Record<AspectKey, number>
}

export default function RadarChart({ scores }: Props) {
  const aspects = ALL_ASPECTS
  const n = aspects.length
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const maxR = 88
  const labelR = 122

  const toRad = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2
  const toPoint = (i: number, r: number) => ({
    x: cx + r * Math.cos(toRad(i)),
    y: cy + r * Math.sin(toRad(i)),
  })

  const gridPolygon = (frac: number) =>
    aspects.map((_, i) => {
      const p = toPoint(i, maxR * frac)
      return `${p.x},${p.y}`
    }).join(' ')

  const dataPolygon = aspects.map((key, i) => {
    const p = toPoint(i, maxR * ((scores[key] ?? 0) / 100))
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto block">
      {/* 그리드 */}
      {[0.25, 0.5, 0.75, 1].map(frac => (
        <polygon key={frac} points={gridPolygon(frac)}
          fill="none" stroke="#f3f4f6" strokeWidth="1" />
      ))}

      {/* 축 */}
      {aspects.map((_, i) => {
        const p = toPoint(i, maxR)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#f3f4f6" strokeWidth="1" />
      })}

      {/* 데이터 영역 */}
      <polygon points={dataPolygon}
        fill="rgba(60,52,137,0.10)" stroke="#3C3489" strokeWidth="1.5" strokeLinejoin="round" />

      {/* 데이터 점 */}
      {aspects.map((key, i) => {
        const score = scores[key] ?? 0
        if (score === 0) return null
        const p = toPoint(i, maxR * (score / 100))
        return <circle key={key} cx={p.x} cy={p.y} r="2.5" fill="#3C3489" />
      })}

      {/* 눈금 점수 (25/50/75) */}
      {[25, 50, 75].map(v => (
        <text key={v}
          x={cx + 3} y={cy - maxR * (v / 100) - 2}
          fontSize="7" fill="#d1d5db" textAnchor="start">
          {v}
        </text>
      ))}

      {/* 라벨 */}
      {aspects.map((key, i) => {
        const score = scores[key] ?? 0
        const a = toRad(i)
        const lx = cx + labelR * Math.cos(a)
        const ly = cy + labelR * Math.sin(a)
        const anchor = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle'
        return (
          <text key={key} x={lx} y={ly}
            textAnchor={anchor} dominantBaseline="middle"
            fontSize="8.5" fontFamily="sans-serif"
            fill={score > 0 ? '#6b7280' : '#e5e7eb'}>
            {SHORT_LABELS[key]}
          </text>
        )
      })}
    </svg>
  )
}
