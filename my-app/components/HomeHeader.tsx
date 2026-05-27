"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-foreground">cafun</span>
          </Link>

          <Link href="/search" className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <div className="pl-10 pr-4 py-2 w-full bg-secondary rounded-md text-muted-foreground text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
                카페 이름, 지역, 분위기로 검색
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/onboarding" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              AI 추천
            </Link>
            <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              검색
            </Link>
            <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              커뮤니티
            </Link>
            <Link href="/compare" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              비교
            </Link>
            <Link href="/mypage">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                마이페이지
              </Button>
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <Link href="/search" className="relative mb-4 block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <div className="pl-10 pr-4 py-2 w-full bg-secondary rounded-md text-muted-foreground text-sm">
                카페 이름, 지역, 분위기로 검색
              </div>
            </Link>
            <nav className="flex flex-col gap-3">
              <Link href="/onboarding" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                AI 추천
              </Link>
              <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                <MapPin className="h-4 w-4" />
                검색
              </Link>
              <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                커뮤니티
              </Link>
              <Link href="/compare" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                카페 비교
              </Link>
              <Link href="/mypage" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                마이페이지
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
