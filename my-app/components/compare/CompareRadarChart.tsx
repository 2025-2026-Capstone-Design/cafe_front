"use client"

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts"
import { AspectKey, ASPECT_LABELS, ALL_ASPECTS } from "@/lib/types"

interface CafeData {
  id: string
  name: string
  aspectScores: Record<AspectKey, number>
}

interface CompareRadarChartProps {
  cafes: CafeData[]
  colors: string[]
}

export function CompareRadarChart({ cafes, colors }: CompareRadarChartProps) {
  const chartData = ALL_ASPECTS.map((key) => {
    const point: Record<string, string | number> = {
      aspect: ASPECT_LABELS[key].split('/')[0],
      fullMark: 100,
    }
    cafes.forEach(cafe => {
      point[cafe.id] = cafe.aspectScores[key] ?? 0
    })
    return point
  })

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="aspect"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickCount={5}
          />
          {cafes.map((cafe, index) => (
            <Radar
              key={cafe.id}
              name={cafe.name}
              dataKey={cafe.id}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => {
              const cafe = cafes.find(c => c.id === name)
              return [value, cafe?.name || name]
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
