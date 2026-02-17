import { prisma } from '@/lib/prisma'
import { PricingType } from '@prisma/client'

/**
 * Create a tool submission
 */
export async function createSubmission(data: {
  userId: string
  name: string
  description: string
  websiteUrl: string
  logoUrl?: string
  pricingType: PricingType
  categoryIds: string[]
  tagIds?: string[]
  longDescription?: string
  pricingDetails?: string
  hasFreeTier?: boolean
}) {
  const { categoryIds, tagIds, ...submissionData } = data

  return prisma.toolSubmission.create({
    data: {
      ...submissionData,
      categoryIds,
      tagIds: tagIds || [],
      status: 'PENDING',
    },
  })
}

/**
 * Get all submissions (with optional status filter)
 */
export async function getAllSubmissions(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
  return prisma.toolSubmission.findMany({
    where: status ? { status } : undefined,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get submission by ID
 */
export async function getSubmissionById(id: string) {
  return prisma.toolSubmission.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Approve submission and create tool
 */
export async function approveSubmission(submissionId: string) {
  const submission = await getSubmissionById(submissionId)

  if (!submission) {
    throw new Error('Submission not found')
  }

  // Create slug from name
  const slug = submission.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Create the tool
  const tool = await prisma.tool.create({
    data: {
      name: submission.name,
      slug,
      description: submission.description,
      longDescription: submission.longDescription,
      websiteUrl: submission.websiteUrl,
      logoUrl: submission.logoUrl,
      pricingType: submission.pricingType,
      pricingDetails: submission.pricingDetails,
      hasFreeTier: submission.hasFreeTier,
      categories: {
        create: submission.categoryIds.map((id) => ({
          category: { connect: { id } },
        })),
      },
      tags: {
        create: submission.tagIds.map((id) => ({
          tag: { connect: { id } },
        })),
      },
    },
  })

  // Update submission status
  await prisma.toolSubmission.update({
    where: { id: submissionId },
    data: {
      status: 'APPROVED',
      reviewedAt: new Date(),
    },
  })

  return tool
}

/**
 * Reject submission
 */
export async function rejectSubmission(submissionId: string, reason?: string) {
  return prisma.toolSubmission.update({
    where: { id: submissionId },
    data: {
      status: 'REJECTED',
      rejectionReason: reason,
      reviewedAt: new Date(),
    },
  })
}
