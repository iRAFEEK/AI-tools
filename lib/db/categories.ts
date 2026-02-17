import { prisma } from '@/lib/prisma'

/**
 * Get all categories with tool counts
 */
export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: {
          tools: true,
        },
      },
    },
  })
}

/**
 * Get a single category by slug with its tools
 */
export async function getCategoryBySlug(slug: string, page = 1, limit = 20) {
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) return null

  const skip = (page - 1) * limit

  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where: {
        isPublished: true,
        categories: {
          some: {
            categoryId: category.id,
          },
        },
      },
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.tool.count({
      where: {
        isPublished: true,
        categories: {
          some: {
            categoryId: category.id,
          },
        },
      },
    }),
  ])

  return {
    category,
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
 * Create a new category
 */
export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  icon?: string
  order?: number
}) {
  return prisma.category.create({
    data,
  })
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  data: Partial<{
    name: string
    slug: string
    description: string
    icon: string
    order: number
  }>
) {
  return prisma.category.update({
    where: { id },
    data,
  })
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  })
}
