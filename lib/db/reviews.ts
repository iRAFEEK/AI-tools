import { prisma } from '@/lib/prisma'

/**
 * Get reviews for a tool
 */
export async function getToolReviews(toolId: string, approved: boolean = true) {
  return prisma.review.findMany({
    where: {
      toolId,
      isApproved: approved,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Create a review
 */
export async function createReview(data: {
  userId: string
  toolId: string
  title: string
  content: string
  pros?: string
  cons?: string
}) {
  return prisma.review.create({
    data: {
      ...data,
      isApproved: false, // Requires admin approval
    },
  })
}

/**
 * Approve a review (admin only)
 */
export async function approveReview(reviewId: string) {
  return prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  })
}

/**
 * Get all pending reviews (admin only)
 */
export async function getPendingReviews() {
  return prisma.review.findMany({
    where: { isApproved: false },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tool: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
