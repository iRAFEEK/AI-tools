// Simplified middleware - auth protection will be added later
// For now, just export a simple pass-through middleware

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, allow all requests
  // We'll add authentication protection after we set up login pages
  return NextResponse.next()
}

// Configure which routes middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
