import { prisma } from '@/lib/prisma'

/**
 * Create or update a rating (upsert)
 */
export async function upsertRating(
  userId: string,
  toolId: string,
  value: number
) {
  // Upsert rating (create or update if exists)
  const rating = await prisma.rating.upsert({
    where: {
      userId_toolId: {
        userId,
        toolId,
      },
    },
    update: {
      value,
    },
    create: {
      userId,
      toolId,
      value,
    },
  })

  // Recalculate average rating for the tool
  const avgResult = await prisma.rating.aggregate({
    where: { toolId },
    _avg: { value: true },
  })

  const averageRating = avgResult._avg.value || 0

  // Update tool with new average rating
  await prisma.tool.update({
    where: { id: toolId },
    data: { averageRating },
  })

  return { rating, averageRating }
}

/**
 * Get user's rating for a tool
 */
export async function getUserRating(userId: string, toolId: string) {
  return prisma.rating.findUnique({
    where: {
      userId_toolId: {
        userId,
        toolId,
      },
    },
  })
}
