import { Cafe } from './types'

let _cache: Cafe[] = []

export function setCafeCache(cafes: Cafe[]): void {
  _cache = cafes
}

export function getCafeCache(): Cafe[] {
  return _cache
}
