const USER_KEY = 'cafe_user'

export interface User {
  id: string
  name: string
  email: string
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as User) : null
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY)
}

// DB 연동 전 mock — 추후 API 호출로 교체
export function mockSignup(name: string, email: string): User {
  const user: User = { id: crypto.randomUUID(), name, email }
  setUser(user)
  return user
}

export function mockLogin(email: string): User | null {
  // 저장된 유저 이메일과 비교 (실제 auth는 서버에서)
  const saved = getUser()
  if (saved && saved.email === email) return saved
  return null
}
