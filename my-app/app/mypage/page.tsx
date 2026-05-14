'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Settings, Heart, Star, Bell, Shield, LogOut,
  ChevronRight, Edit2, Coffee, MessageSquare, Award, TrendingUp, Trash2,
} from 'lucide-react'
import { getUser, clearUser, getToken, User as AuthUser } from '@/lib/auth'
import { getBookmarks } from '@/lib/bookmarks'
import { getPreferences } from '@/lib/preferences'
import { ALL_ASPECTS, ASPECT_LABELS, AspectKey, Cafe } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getUserReviews, deleteReview, getCafeDetail, ApiReview } from '@/lib/api'
import { getCafeCache } from '@/lib/cafeCache'
import { REVIEW_ASPECT_MAP } from '@/lib/mappers'

function getPositiveAspects(review: ApiReview): AspectKey[] {
  return ALL_ASPECTS.filter(k => (review[REVIEW_ASPECT_MAP[k]] as number) === 1)
}

const CAFE_IMG_PLACEHOLDER = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=160&h=160&fit=crop'

async function fetchCafeInfoForReviews(
  reviews: ApiReview[],
): Promise<Record<string, { name: string; imageUrl: string }>> {
  const uniqueIds = [...new Set(reviews.map(r => r.cafeId))]
  const uniqueIdSet = new Set(uniqueIds)
  const infoMap: Record<string, { name: string; imageUrl: string }> = {}
  for (const cafe of getCafeCache()) {
    if (uniqueIdSet.has(cafe.id)) {
      infoMap[cafe.id] = { name: cafe.name, imageUrl: cafe.imageUrl ?? '' }
    }
  }
  const missing = uniqueIds.filter(id => !infoMap[id])
  await Promise.all(
    missing.map(id =>
      getCafeDetail(id)
        .then(d => { infoMap[id] = { name: d.name, imageUrl: d.imageUrls?.[0] ?? '' } })
        .catch(() => { infoMap[id] = { name: '알 수 없는 카페', imageUrl: '' } })
    )
  )
  return infoMap
}

const ASPECT_ICONS: Record<AspectKey, string> = {
  coffee: '☕', bakery: '🥐', cake: '🎂', cookie: '🍪',
  bingsu: '🍧', dessert: '🍮', space: '🪑', vibe: '✨',
  service: '🤝', price: '💰', gift: '🎁', crowd: '🕐',
}

const achievements = [
  { icon: Coffee,       title: '첫 리뷰',    description: '첫 번째 리뷰 작성',  achieved: false },
  { icon: Star,         title: '평론가',     description: '리뷰 10개 작성',     achieved: false },
  { icon: Award,        title: '카페 헌터',  description: '50개 카페 방문',     achieved: false },
  { icon: TrendingUp,   title: '인플루언서', description: '팔로워 100명 달성',  achieved: false },
  { icon: MessageSquare,title: '소통왕',     description: '댓글 50개 작성',     achieved: false },
  { icon: Heart,        title: '인기인',     description: '좋아요 500개 받기',  achieved: false },
]

const menuItems = [
  { icon: Bell,    label: '알림 설정',     href: '/mypage/notifications' },
  { icon: Shield,  label: '개인정보 설정', href: '/mypage/privacy' },
  { icon: Settings,label: '앱 설정',       href: '/mypage/settings' },
]

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [bookmarks, setBookmarks] = useState<Cafe[]>([])
  const [preferences, setPreferences] = useState<AspectKey[]>([])
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('bookmarks')
  const [myReviews, setMyReviews] = useState<ApiReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [cafeInfoMap, setCafeInfoMap] = useState<Record<string, { name: string; imageUrl: string }>>({})

  useEffect(() => {
    setUser(getUser())
    setBookmarks(getBookmarks())
    setPreferences(getPreferences())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (activeTab !== 'reviews') return
    if (myReviews.length > 0) return
    const token = getToken()
    if (!token) return
    setReviewsLoading(true)
    getUserReviews(token)
      .then(async ({ reviews }) => {
        setMyReviews(reviews)
        const infoMap = await fetchCafeInfoForReviews(reviews)
        setCafeInfoMap(infoMap)
      })
      .catch(() => setMyReviews([]))
      .finally(() => setReviewsLoading(false))
  }, [activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteReview = async (review: ApiReview) => {
    const token = getToken()
    if (!token) return
    if (!confirm('이 리뷰를 삭제할까요?')) return
    await deleteReview(review.cafeId, review.id, token)
    setMyReviews(prev => prev.filter(r => r.id !== review.id))
  }

  const handleLogout = () => {
    clearUser()
    router.push('/')
  }

  if (!mounted) return null

  if (!user) {
    return (
      <main className="w-full max-w-[672px] min-w-[320px] mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <User className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-[15px] font-medium">로그인이 필요해요</p>
          <p className="text-[13px] text-muted-foreground text-center">
            로그인하면 취향 관리와 더 많은 기능을 이용할 수 있어요.
          </p>
          <div className="flex gap-2 mt-2">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-[14px] font-medium transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-[14px] font-medium transition-colors"
            >
              회원가입
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 mb-6 border border-border">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-4 border-primary/20">
                {user.name.charAt(0)}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Badge variant="secondary" className="w-fit mx-auto sm:mx-0">카페 탐험가</Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
              <div className="flex justify-center sm:justify-start gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold">{bookmarks.length}</p>
                  <p className="text-xs text-muted-foreground">북마크</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{preferences.length}</p>
                  <p className="text-xs text-muted-foreground">취향</p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push('/onboarding')}>
              <Edit2 className="w-4 h-4" />
              취향 수정
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookmarks">찜한 카페</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="preferences">내 취향</TabsTrigger>
            <TabsTrigger value="achievements">업적</TabsTrigger>
          </TabsList>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="mt-4">
            {bookmarks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">아직 찜한 카페가 없어요</p>
                <Link href="/search" className="text-primary text-sm hover:underline mt-2 inline-block">
                  카페 둘러보기 →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarks.map((cafe) => (
                  <Link
                    key={cafe.id}
                    href={`/cafe/${cafe.id}`}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all"
                  >
                    {cafe.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 bg-muted flex items-center justify-center text-4xl">☕</div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{cafe.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{(cafe.score / 20).toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{cafe.address}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Reviews Tab */}
          <TabsContent value="reviews" className="mt-4">
            {reviewsLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">불러오는 중...</div>
            ) : myReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">아직 작성한 리뷰가 없어요</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myReviews.map(review => {
                  const cafeInfo = cafeInfoMap[review.cafeId]
                  const positives = getPositiveAspects(review)
                  return (
                    <div key={review.id} className="bg-card rounded-xl border border-border overflow-hidden">
                      {/* 카페 헤더 */}
                      <Link href={`/cafe/${review.cafeId}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cafeInfo?.imageUrl || CAFE_IMG_PLACEHOLDER}
                          alt={cafeInfo?.name ?? ''}
                          className="w-12 h-12 rounded-lg shrink-0 object-cover bg-muted"
                          onError={(e) => { (e.target as HTMLImageElement).src = CAFE_IMG_PLACEHOLDER }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {cafeInfo?.name ?? '카페 정보 불러오는 중…'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </Link>

                      {/* 리뷰 본문 */}
                      <div className="px-4 py-3">
                        {review.reviewText ? (
                          <p className="text-sm text-foreground leading-relaxed line-clamp-3 mb-3">
                            {review.reviewText}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic mb-3">작성한 리뷰 내용이 없어요</p>
                        )}

                        {/* 긍정 항목 뱃지 */}
                        {positives.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {positives.map(key => (
                              <span key={key} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span>{ASPECT_ICONS[key]}</span>
                                {ASPECT_LABELS[key].split('/')[0]}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 삭제 버튼 */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDeleteReview(review)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">나의 취향 설정</h2>
                <Link href="/onboarding" className="text-primary text-sm hover:underline">수정하기</Link>
              </div>
              {preferences.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">아직 취향이 설정되지 않았어요</p>
                  <Link href="/onboarding">
                    <Button>취향 설정하기</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {preferences.map(key => (
                      <span
                        key={key}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary"
                      >
                        <span>{ASPECT_ICONS[key]}</span>
                        {ASPECT_LABELS[key]}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_ASPECTS.map(key => {
                      const selected = preferences.includes(key)
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                            selected ? 'bg-primary/10 text-primary' : 'bg-muted/30 text-muted-foreground'
                          }`}
                        >
                          <span>{ASPECT_ICONS[key]}</span>
                          <span className="truncate">{ASPECT_LABELS[key].split('/')[0]}</span>
                          {selected && <span className="ml-auto text-xs">✓</span>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.map((item, index) => (
                <div
                  key={index}
                  className={`bg-card rounded-xl p-4 border text-center ${
                    item.achieved ? 'border-primary/30 bg-primary/5' : 'border-border opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    item.achieved ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Settings Menu */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <h2 className="px-4 py-3 font-semibold border-b border-border">설정</h2>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">로그아웃</span>
          </button>
        </div>
      </main>
    </div>
  )
}
