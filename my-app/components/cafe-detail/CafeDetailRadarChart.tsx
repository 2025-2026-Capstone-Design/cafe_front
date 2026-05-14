"use client"

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts"
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { AspectKey, ASPECT_LABELS } from "@/lib/types"

interface Props {
  aspectScores: Record<AspectKey, number>
  compact?: boolean
}

function getStatus(score: number) {
  if (score >= 80) return { icon: ThumbsUp, color: "text-green-600", bg: "bg-green-50", label: "긍정" }
  if (score >= 60) return { icon: Minus,    color: "text-yellow-600", bg: "bg-yellow-50", label: "보통" }
  return               { icon: ThumbsDown, color: "text-red-500",   bg: "bg-red-50",    label: "부정" }
}

export function CafeDetailRadarChart({ aspectScores, compact = false }: Props) {
  const entries = (Object.entries(aspectScores ?? {}) as [AspectKey, number][])
    .filter(([, v]) => v > 0)

  if (entries.length === 0) return null

  const data = entries.map(([key, value]) => ({
    aspect: ASPECT_LABELS[key].split("/")[0],
    score: value,
    fullMark: 100,
  }))

  const radarChart = (
    <div className={compact ? "h-[260px] w-full" : "h-[320px] w-full"}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="aspect" tick={{ fontSize: compact ? 10 : 11 }} tickLine={false} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} tickCount={5} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const score = payload[0].value as number
              const status = getStatus(score)
              return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-foreground">{payload[0].payload.aspect}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <status.icon className={`h-4 w-4 ${status.color}`} />
                    <span className={`font-bold ${status.color}`}>{score}점</span>
                    <span className="text-sm text-muted-foreground">({status.label})</span>
                  </div>
                </div>
              )
            }}
          />
          <Radar
            name="점수"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )

  if (compact) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border">
        <p className="text-[11px] font-semibold text-neutral-700 mb-2">ABSA 감성 분석</p>
        {radarChart}
      </div>
    )
  }

  const sorted = [...entries].sort((a, b) => b[1] - a[1])
  const topAspects = sorted.slice(0, 3)
  const bottomAspects = sorted.slice(-3).reverse()

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">ABSA 감성 분석</h2>
        <p className="text-sm text-muted-foreground mt-1">
          리뷰를 AI가 분석한 측면별 평가
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {radarChart}

        {/* Score Details */}
        <div className="space-y-5">
          {/* Top 3 */}
          <div>
            <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" /> 강점 TOP 3
            </h3>
            <div className="space-y-2">
              {topAspects.map(([key, score]) => (
                <div key={key} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                  <span className="font-medium text-foreground text-sm">{ASPECT_LABELS[key].split("/")[0]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-sm font-bold text-green-600 w-8 text-right">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom 3 */}
          <div>
            <h3 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
              <ThumbsDown className="h-4 w-4" /> 개선 필요 TOP 3
            </h3>
            <div className="space-y-2">
              {bottomAspects.map(([key, score]) => {
                const status = getStatus(score)
                return (
                  <div key={key} className={`flex items-center justify-between ${status.bg} rounded-lg p-3`}>
                    <span className="font-medium text-foreground text-sm">{ASPECT_LABELS[key].split("/")[0]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-red-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${status.color} w-8 text-right`}>{score}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* All grid */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">전체 항목</h3>
            <div className="grid grid-cols-3 gap-2">
              {entries.map(([key, score]) => {
                const status = getStatus(score)
                return (
                  <div key={key} className={`text-center p-2 rounded-lg ${status.bg}`}>
                    <p className="text-xs text-muted-foreground mb-1">{ASPECT_LABELS[key].split("/")[0]}</p>
                    <p className={`font-bold text-sm ${status.color}`}>{score}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
