import Link from "next/link"

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}

function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

export function HomeFooter() {
  return (
    <footer className="bg-foreground text-card py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl">cafun</span>
            </Link>
            <p className="text-card/70 text-sm leading-relaxed">
              AI 기반 감성 분석으로
              <br />
              당신에게 딱 맞는 카페를 추천합니다
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-card/10 hover:bg-card/20 rounded-full flex items-center justify-center transition-colors">
                <IconInstagram />
              </a>
              <a href="#" className="w-9 h-9 bg-card/10 hover:bg-card/20 rounded-full flex items-center justify-center transition-colors">
                <IconTwitter />
              </a>
              <a href="#" className="w-9 h-9 bg-card/10 hover:bg-card/20 rounded-full flex items-center justify-center transition-colors">
                <IconGithub />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-card/70">
              <li><Link href="/onboarding" className="hover:text-card transition-colors">AI 추천</Link></li>
              <li><Link href="/search" className="hover:text-card transition-colors">카페 검색</Link></li>
              <li><Link href="/search" className="hover:text-card transition-colors">내 주변 카페</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm text-card/70">
              <li><Link href="#" className="hover:text-card transition-colors">공지사항</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">자주 묻는 질문</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">1:1 문의</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">회사 정보</h4>
            <ul className="space-y-2 text-sm text-card/70">
              <li><Link href="#" className="hover:text-card transition-colors">회사 소개</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">이용약관</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-card/10 text-center text-sm text-card/50">
          <p>© 2026 cafun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
