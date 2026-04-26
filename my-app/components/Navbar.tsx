import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="font-semibold text-base text-neutral-900 tracking-tight">
          cafefit
        </Link>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-1">
          <Link
            href="/bookmark"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </Link>
          <Link
            href="/mypage"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}