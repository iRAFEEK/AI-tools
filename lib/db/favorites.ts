import { prisma } from '@/lib/prisma'

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      tool: {
        include: {
          categories: {
            include: { category: true },
          },
          tags: {
            include: { tag: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Check if a tool is favorited by a user
 */
export async function isFavorited(userId: string, toolId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_toolId: {
        userId,
        toolId,
      },
    },
  })
  return !!favorite
}

/**
 * Add a tool to favorites
 */
export async function addFavorite(userId: string, toolId: string) {
  // Create favorite
  const favorite = await prisma.favorite.create({
    data: {
      userId,
      toolId,
    },
  })

  // Increment favorite count on the tool
  await prisma.tool.update({
    where: { id: toolId },
    data: {
      favoriteCount: {
        increment: 1,
      },
    },
  })

  return favorite
}

/**
 * Remove a tool from favorites
 */
export async function removeFavorite(userId: string, toolId: string) {
  // Delete favorite
  const favorite = await prisma.favorite.delete({
    where: {
      userId_toolId: {
        userId,
        toolId,
      },
    },
  })

  // Decrement favorite count on the tool
  await prisma.tool.update({
    where: { id: toolId },
    data: {
      favoriteCount: {
        decrement: 1,
      },
    },
  })

  return favorite
}

/**
 * Get favorite count for a tool
 */
export async function getFavoriteCount(toolId: string) {
  return prisma.favorite.count({
    where: { toolId },
  })
}
