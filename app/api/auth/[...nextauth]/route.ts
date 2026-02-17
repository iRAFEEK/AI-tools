import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// This catches all auth routes: /api/auth/signin, /api/auth/signout, etc.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
