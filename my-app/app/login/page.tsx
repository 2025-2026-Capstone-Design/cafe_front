'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockLogin, setUser } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    // TODO: DB 연동 시 API 호출로 교체
    await new Promise(r => setTimeout(r, 400))
    const user = mockLogin(email.trim())
    setLoading(false)

    if (!user) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
      return
    }

    setUser(user)
    router.push('/')
  }

  return (
    <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-[22px] font-semibold text-neutral-900 mb-1">
          로그인
        </h1>
        <p className="text-[13px] text-neutral-500">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-violet-600 font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-[14px] text-neutral-900
              placeholder:text-neutral-300 focus:outline-none focus:border-violet-400 focus:ring-2
              focus:ring-violet-100 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-[14px] text-neutral-900
              placeholder:text-neutral-300 focus:outline-none focus:border-violet-400 focus:ring-2
              focus:ring-violet-100 transition-colors"
          />
        </div>

        {error && (
          <p className="text-[13px] text-orange-600 bg-orange-50 border border-orange-200 rounded-xl px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-[15px] font-medium transition-colors mt-2
            disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
            bg-violet-700 hover:bg-violet-900 text-white"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </main>
  )
}
