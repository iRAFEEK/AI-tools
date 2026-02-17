import { PrismaClient } from '@prisma/client'

// Prisma Client Singleton
// Prevents creating multiple database connections in development
// (Next.js hot reloads can cause connection issues without this)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Usage in your app:
// import { prisma } from '@/lib/prisma'
// const users = await prisma.user.findMany()
