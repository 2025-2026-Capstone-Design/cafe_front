'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register, apiLogin } from '@/lib/api'
import { setUser, setToken } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (name.trim().length < 2 || name.trim().length > 20) {
      setError('닉네임은 2자 이상 20자 이하여야 해요.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않아요.')
      return
    }
    const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/
    if (!pwPattern.test(password)) {
      setError('비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 해요.')
      return
    }

    setLoading(true)
    try {
      const user = await register(name.trim(), email.trim(), password.trim())
      setUser({ id: user.id, name: user.nickname, email: user.email })
      // 가입 즉시 자동 로그인 — 토큰 저장
      const { access_token } = await apiLogin(email.trim(), password.trim())
      setToken(access_token)
      router.push('/onboarding')
    } catch {
      setError('회원가입에 실패했어요. 이미 사용 중인 이메일일 수 있어요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-[22px] font-semibold text-neutral-900 mb-1">
          회원가입
        </h1>
        <p className="text-[13px] text-neutral-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-violet-600 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
            닉네임 <span className="text-neutral-400 font-normal">(2~20자)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-[14px] text-neutral-900
              placeholder:text-neutral-300 focus:outline-none focus:border-violet-400 focus:ring-2
              focus:ring-violet-100 transition-colors"
          />
        </div>

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
            placeholder="영문+숫자+특수문자 포함"
            className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-[14px] text-neutral-900
              placeholder:text-neutral-300 focus:outline-none focus:border-violet-400 focus:ring-2
              focus:ring-violet-100 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="비밀번호 재입력"
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
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </main>
  )
}
