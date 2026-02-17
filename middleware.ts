import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Middleware to protect routes
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // Block non-admin users from accessing /admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Decide if middleware should run
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that anyone can access
        const publicRoutes = [
          '/',
          '/tools',
          '/categories',
          '/smart-match',
          '/about',
          '/login',
          '/register',
        ]

        // Check if current path starts with any public route
        const isPublicRoute = publicRoutes.some(route =>
          pathname.startsWith(route)
        )

        // Allow public routes without authentication
        if (isPublicRoute) return true

        // All other routes require authentication
        return !!token
      },
    },
  }
)

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
