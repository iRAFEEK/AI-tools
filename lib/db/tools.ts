import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { ToolFilters } from '@/types'

/**
 * Get all tools with optional filtering, sorting, and pagination
 */
export async function getAllTools(filters?: ToolFilters) {
  const {
    category,
    tags,
    pricingType,
    search,
    sort = 'newest',
    page = 1,
    limit = 20,
  } = filters || {}

  // Build the where clause dynamically
  const where: Prisma.ToolWhereInput = {
    isPublished: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && category.length > 0 && {
      categories: {
        some: {
          category: {
            slug: { in: category },
          },
        },
      },
    }),
    ...(tags && tags.length > 0 && {
      tags: {
        some: {
          tag: {
            slug: { in: tags },
          },
        },
      },
    }),
    ...(pricingType && pricingType.length > 0 && {
      pricingType: { in: pricingType as any },
    }),
  }

  // Determine sort order
  const orderBy: Prisma.ToolOrderByWithRelationInput =
    sort === 'popular' ? { favoriteCount: 'desc' } :
    sort === 'rating' ? { averageRating: 'desc' } :
    { createdAt: 'desc' } // newest

  // Calculate pagination
  const skip = (page - 1) * limit

  // Execute queries in parallel
  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        categories: {
          include: { category: true },
        },
        tags: {
          include: { tag: true },
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
    }),
    prisma.tool.count({ where }),
  ])

  return {
    tools,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get a single tool by slug
 */
export async function getToolBySlug(slug: string) {
  return prisma.tool.findUnique({
    where: { slug },
    include: {
      categories: {
        include: { category: true },
      },
      tags: {
        include: { tag: true },
      },
      features: {
        include: { feature: true },
      },
      useCases: {
        include: { useCase: true },
      },
      techStacks: {
        include: { techStack: true },
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          favorites: true,
          reviews: true,
        },
      },
    },
  })
}

/**
 * Get a tool by ID
 */
export async function getToolById(id: string) {
  return prisma.tool.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
      },
      tags: {
        include: { tag: true },
      },
    },
  })
}

/**
 * Create a new tool
 */
export async function createTool(data: {
  name: string
  slug: string
  description: string
  longDescription?: string
  websiteUrl: string
  logoUrl?: string
  pricingType: string
  pricingDetails?: string
  hasFreeTier?: boolean
  categoryIds: string[]
  tagIds?: string[]
}) {
  const { categoryIds, tagIds, ...toolData } = data

  return prisma.tool.create({
    data: {
      ...toolData,
      categories: {
        create: categoryIds.map(id => ({
          category: { connect: { id } },
        })),
      },
      ...(tagIds && tagIds.length > 0 && {
        tags: {
          create: tagIds.map(id => ({
            tag: { connect: { id } },
          })),
        },
      }),
    },
  })
}

/**
 * Update a tool
 */
export async function updateTool(
  id: string,
  data: Partial<{
    name: string
    slug: string
    description: string
    longDescription: string
    websiteUrl: string
    logoUrl: string
    pricingType: string
    pricingDetails: string
    hasFreeTier: boolean
    isPublished: boolean
  }>
) {
  return prisma.tool.update({
    where: { id },
    data,
  })
}

/**
 * Delete a tool
 */
export async function deleteTool(id: string) {
  return prisma.tool.delete({
    where: { id },
  })
}

/**
 * Increment view count
 */
export async function incrementViewCount(id: string) {
  return prisma.tool.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
    },
  })
}

/**
 * Update average rating (called after rating is created/updated)
 */
export async function updateAverageRating(toolId: string) {
  const ratings = await prisma.rating.findMany({
    where: { toolId },
    select: { score: true },
  })

  if (ratings.length === 0) {
    await prisma.tool.update({
      where: { id: toolId },
      data: { averageRating: null, reviewCount: 0 },
    })
    return
  }

  const average = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length

  await prisma.tool.update({
    where: { id: toolId },
    data: {
      averageRating: average,
      reviewCount: ratings.length,
    },
  })
}
