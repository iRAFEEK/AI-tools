import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  // Use Prisma to store sessions in database
  adapter: PrismaAdapter(prisma) as any,

  // Authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    // We'll add email/password (Credentials) later
  ],

  // Session configuration
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for sessions
  },

  // Custom pages
  pages: {
    signIn: '/login', // Custom login page (we'll create this later)
    error: '/login',   // Error page redirects to login
  },

  // Callbacks to customize behavior
  callbacks: {
    // Add user role to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },

    // Add user role to session object
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'USER' | 'ADMIN'
        session.user.id = token.id as string
      }
      return session
    },
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
}
