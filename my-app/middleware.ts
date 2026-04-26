import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const prefs = request.cookies.get('userPreferences')
  if (!prefs && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}