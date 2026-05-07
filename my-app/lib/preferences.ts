import { AspectKey } from './types'

export function getPreferences(): AspectKey[] {
  if (typeof window === 'undefined') return []
  const raw = document.cookie
    .split('; ')
    .find(r => r.startsWith('userPreferences='))
    ?.split('=')[1]
  if (!raw) return []
  try {
    return JSON.parse(decodeURIComponent(raw)) as AspectKey[]
  } catch {
    return []
  }
}

export function calcMatchRate(
  aspectScores: Record<AspectKey, number> | undefined | null,
  preferences: AspectKey[],
): number | null {
  if (preferences.length === 0 || !aspectScores) return null
  const avg =
    preferences.reduce((s, k) => s + (aspectScores[k] ?? 0), 0) / preferences.length
  return Math.round(avg)
}
