'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Settings, Heart, Star, Bell, Shield, LogOut,
  ChevronRight, Edit2, Coffee, MessageSquare, MapPin,
  Bookmark, Clock, Users, Flame, Camera,
} from 'lucide-react'
import { getUser, clearUser, User as AuthUser } from '@/lib/auth'
import { getBookmarks } from '@/lib/bookmarks'
import { getPreferences } from '@/lib/preferences'
import { AspectKey, Cafe } from '@/lib/types'

// ─── 취향 유형 정의 ──────────────────────────────────────────────────────
const TASTE_TYPES: Record<string, { emoji: string; label: string; desc: string; color: string }> = {
  vibe:    { emoji: '✨', label: '감성 탐험가',   desc: '분위기와 공간미가 최우선. 사진 찍기 좋은 카페를 찾아다니는 타입이에요.',      color: 'from-violet-50 to-purple-50 border-violet-200' },
  coffee:  { emoji: '☕', label: '커피 마니아',   desc: '원두의 풍미와 추출 방식에 진심. 스페셜티 로스터리를 사랑하는 타입이에요.',    color: 'from-amber-50 to-orange-50 border-amber-200' },
  cake:    { emoji: '🍰', label: '디저트 헌터',   desc: '케이크와 베이커리 맛집이라면 어디든 달려가는 달콤함 추구 타입이에요.',        color: 'from-pink-50 to-rose-50 border-pink-200' },
  space:   { emoji: '💻', label: '작업 카페러',   desc: '조용하고 콘센트 많은 작업하기 좋은 카페를 찾는 실용파 타입이에요.',          color: 'from-sky-50 to-blue-50 border-sky-200' },
  bakery:  { emoji: '🥐', label: '베이커리 러버', desc: '갓 구운 빵 향기에 이끌리는 아침형 카페 인간 타입이에요.',                    color: 'from-yellow-50 to-amber-50 border-yellow-200' },
  service: { emoji: '🤝', label: '단골 메이커',   desc: '친절한 서비스와 따뜻한 분위기를 중시하는 관계 중심 타입이에요.',             color: 'from-emerald-50 to-teal-50 border-emerald-200' },
}
const DEFAULT_TYPE = TASTE_TYPES.vibe

// ─── 하드코딩 활동 피드 ──────────────────────────────────────────────────
const ACTIVITY_FEED = [
  { icon: '☕', text: '어니언 성수를 방문했어요',       sub: '성수동 · ABSA 9.6점',    time: '2시간 전',  color: 'bg-amber-100 text-amber-700' },
  { icon: '⭐', text: '모노클 커피에 리뷰를 남겼어요',  sub: '"라떼 아트가 진짜 예쁨"',  time: '어제',      color: 'bg-yellow-100 text-yellow-700' },
  { icon: '🔖', text: '르뱅 베이커리를 저장했어요',     sub: '강남 · 케이크 9.1점',     time: '2일 전',    color: 'bg-pink-100 text-pink-700' },
  { icon: '👥', text: '김지은님과 카페 메이트가 됐어요', sub: '취향 일치율 94%',          time: '3일 전',    color: 'bg-violet-100 text-violet-700' },
  { icon: '🗺️', text: '연남동 카페 3곳을 탐험했어요',   sub: '카페 식물관 외 2곳',       time: '4일 전',    color: 'bg-emerald-100 text-emerald-700' },
  { icon: '☕', text: '테라로사 커피웍스를 방문했어요',  sub: '이태원 · 서비스 8.9점',   time: '5일 전',    color: 'bg-sky-100 text-sky-700' },
]

// ─── 하드코딩 배지 ───────────────────────────────────────────────────────
const BADGES = [
  { emoji: '🗺️', label: '탐험 시작',    desc: '첫 카페 방문',          done: true  },
  { emoji: '✍️', label: '첫 리뷰',      desc: '리뷰 1개 작성',         done: true  },
  { emoji: '🔖', label: '찜 10개',      desc: '카페 10곳 저장',        done: true  },
  { emoji: '👥', label: '첫 메이트',    desc: '카페 메이트 1명 연결',  done: true  },
  { emoji: '🌟', label: '카페 고수',    desc: '30곳 이상 방문',        done: false },
  { emoji: '📸', label: '포토그래퍼',   desc: '사진 20장 업로드',      done: false },
  { emoji: '🏆', label: '리뷰 킹',      desc: '리뷰 20개 작성',        done: false },
  { emoji: '🔥', label: '핫플 헌터',    desc: '오픈 1주 내 신규 카페', done: false },
]

const TABS = ['저장', '리뷰', '취향', '활동'] as const

const ASPECT_ICONS: Partial<Record<AspectKey, string>> = {
  coffee: '☕', bakery: '🥐', cake: '🍰', cookie: '🍪',
  bingsu: '🍧', dessert: '🍮', space: '💻', vibe: '✨',
  service: '🤝', price: '💰', gift: '🎁', crowd: '🕐',
}
const ASPECT_LABELS: Partial<Record<AspectKey, string>> = {
  coffee: '커피', bakery: '베이커리', cake: '케이크', cookie: '쿠키',
  bingsu: '빙수', dessert: '디저트', space: '작업공간', vibe: '감성·분위기',
  service: '친절 서비스', price: '가성비', gift: '굿즈·선물', crowd: '조용함',
}

const SETTINGS = [
  { icon: Bell,   label: '알림 설정',     href: '#' },
  { icon: Shield, label: '개인정보 설정', href: '#' },
  { icon: Settings, label: '앱 설정',    href: '#' },
]

// ─── 빈 상태 컴포넌트 ────────────────────────────────────────────────────
function EmptyState({ icon: Icon, message, cta, href }: {
  icon: React.ElementType; message: string; cta?: string; href?: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
      <Icon className="w-10 h-10 opacity-20" />
      <p className="text-sm">{message}</p>
      {cta && href && (
        <Link href={href} className="text-sm text-primary font-medium hover:underline">{cta}</Link>
      )}
    </div>
  )
}

// ─── 메인 ────────────────────────────────────────────────────────────────
export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [bookmarks, setBookmarks] = useState<Cafe[]>([])
  const [preferences, setPreferences] = useState<AspectKey[]>([])
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('저장')

  useEffect(() => {
    setUser(getUser())
    setBookmarks(getBookmarks())
    setPreferences(getPreferences())
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!user) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="font-semibold text-base">로그인이 필요해요</p>
        <p className="text-sm text-muted-foreground text-center">
          로그인하면 내 카페 기록과 취향을 관리할 수 있어요.
        </p>
        <div className="flex gap-2 mt-1">
          <Link href="/login" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            로그인
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
            회원가입
          </Link>
        </div>
      </main>
    )
  }

  // 취향 유형 결정
  const tasteType = preferences.length > 0
    ? (TASTE_TYPES[preferences[0]] ?? DEFAULT_TYPE)
    : DEFAULT_TYPE

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

        {/* ── 프로필 카드 ─────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* 커버 영역 */}
          <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background relative">
            <button className="absolute top-3 right-3 w-7 h-7 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-5 pb-5">
            {/* 아바타 */}
            <div className="flex items-end justify-between -mt-8 mb-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-4 border-card flex items-center justify-center text-primary font-bold text-2xl">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={() => router.push('/onboarding')}
                className="flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                취향 수정
              </button>
            </div>

            {/* 이름 + 배지 */}
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold text-foreground">{user.name}</h1>
              <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                {tasteType.emoji} {tasteType.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

            {/* 통계 */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: '방문',   value: 37,              icon: MapPin   },
                { label: '리뷰',   value: 12,              icon: MessageSquare },
                { label: '저장',   value: bookmarks.length || 28, icon: Bookmark  },
                { label: '메이트', value: 5,               icon: Users    },
              ].map(s => (
                <div key={s.label} className="bg-secondary rounded-xl py-3">
                  <p className="text-base font-bold text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 탭 ──────────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-border">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4">

            {/* 저장 탭 */}
            {activeTab === '저장' && (
              bookmarks.length === 0 ? (
                <EmptyState icon={Heart} message="아직 저장한 카페가 없어요" cta="카페 둘러보기 →" href="/search" />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {bookmarks.map(cafe => (
                    <Link key={cafe.id} href={`/cafe/${cafe.id}`} className="group rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
                      {cafe.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-28 bg-secondary flex items-center justify-center text-3xl">☕</div>
                      )}
                      <div className="p-2.5">
                        <p className="text-sm font-semibold truncate">{cafe.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-muted-foreground">{(cafe.score / 20).toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}

            {/* 리뷰 탭 */}
            {activeTab === '리뷰' && (
              <div className="flex flex-col gap-3">
                {/* 하드코딩 샘플 리뷰 (마케팅 브랜치용) */}
                {[
                  { cafe: '어니언 성수', location: '성수동', score: 9.6, text: '폐공장 리모델링 감성 실화. 아메리카노 들고 창가에 앉아 있으면 유럽 어딘가 온 느낌이에요.', tags: ['분위기', '공간', '커피'], time: '2일 전', img: 'https://ldb-phinf.pstatic.net/20240504_95/1714807051138BmzpY_JPEG/IMG_4445.jpeg' },
                  { cafe: '모노클 커피', location: '성수동', score: 9.4, text: '라떼 아트 진짜 예쁘고 나무 인테리어가 따뜻한 느낌. 오래 있어도 눈치 안 줘서 자주 가요.', tags: ['라떼', '감성', '작업'], time: '5일 전', img: 'https://ldb-phinf.pstatic.net/20240504_163/1714807049207a0P7V_JPEG/IMG_4447.jpeg' },
                  { cafe: '테라로사 이태원', location: '이태원', score: 8.9, text: '말차 라떼가 진짜 맛있음. 직원분들이 원두 설명도 잘 해줘서 더 신뢰감 가는 카페.', tags: ['말차', '서비스', '로스터리'], time: '일주일 전', img: 'https://ldb-phinf.pstatic.net/20250513_11/17471359509469AAJf_JPEG/%C3%CA%C4%DA%BC%B3%B1%E2.jpg' },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl border border-border">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.img} alt={r.cafe} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground">{r.cafe}</p>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-amber-600 font-semibold">{r.score}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{r.location} · {r.time}</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed line-clamp-2 mb-2">{r.text}</p>
                      <div className="flex gap-1">
                        {r.tags.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/review/write" className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                  <Edit2 className="w-4 h-4" />
                  새 리뷰 작성하기
                </Link>
              </div>
            )}

            {/* 취향 탭 */}
            {activeTab === '취향' && (
              <div className="flex flex-col gap-4">
                {/* 취향 유형 카드 */}
                <div className={`bg-gradient-to-br ${tasteType.color} border rounded-2xl p-5`}>
                  <p className="text-3xl mb-2">{tasteType.emoji}</p>
                  <p className="font-bold text-foreground text-base mb-1">나는 {tasteType.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tasteType.desc}</p>
                </div>

                {/* 선호 취향 태그 */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2.5">선호하는 카페 요소</p>
                  {preferences.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground mb-3">아직 취향이 설정되지 않았어요</p>
                      <Link href="/onboarding" className="text-sm text-primary font-medium hover:underline">취향 설정하러 가기 →</Link>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {preferences.map((key, i) => (
                        <span key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${i === 0 ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-foreground border-border'}`}>
                          <span>{ASPECT_ICONS[key]}</span>
                          {ASPECT_LABELS[key]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 자주 간 지역 */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2.5">자주 가는 동네</p>
                  <div className="flex flex-wrap gap-2">
                    {['성수동', '연남동', '이태원', '홍대'].map((area, i) => (
                      <div key={area} className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{area}</span>
                        {i === 0 && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">최애</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/onboarding" className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 className="w-4 h-4" />
                  취향 다시 설정하기
                </Link>
              </div>
            )}

            {/* 활동 탭 */}
            {activeTab === '활동' && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold">최근 활동</span>
                </div>

                <div className="flex flex-col gap-1 mb-6">
                  {ACTIVITY_FEED.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5">
                      <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-sm flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>

                {/* 배지 */}
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">획득 배지</span>
                  <span className="text-xs text-muted-foreground ml-auto">{BADGES.filter(b => b.done).length}/{BADGES.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {BADGES.map((b, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center ${b.done ? 'border-primary/20 bg-primary/5' : 'border-border opacity-40'}`}>
                      <span className="text-xl">{b.emoji}</span>
                      <p className="text-[11px] font-semibold text-foreground leading-tight">{b.label}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── 설정 메뉴 ───────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {SETTINGS.map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center justify-between px-4 py-3.5 hover:bg-secondary/50 transition-colors border-b border-border">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
          <button
            onClick={() => { clearUser(); router.push('/') }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-500 hover:bg-rose-50 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>

      </main>
    </div>
  )
}
