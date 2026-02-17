import { NextRequest, NextResponse } from 'next/server'
import { getAllTools, createTool } from '@/lib/db/tools'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { toolSchema } from '@/lib/utils/validation'
import { slugify } from '@/lib/utils/slugify'

/**
 * GET /api/tools
 * Get all tools with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const filters = {
      category: searchParams.get('category')?.split(','),
      tags: searchParams.get('tags')?.split(','),
      pricingType: searchParams.get('pricingType')?.split(','),
      search: searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as 'popular' | 'newest' | 'rating') || 'newest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const result = await getAllTools(filters)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tools
 * Create a new tool (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = toolSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = slugify(body.name)

    // Create tool
    const tool = await createTool({
      ...body,
      slug,
      categoryIds: body.categoryIds || [],
      tagIds: body.tagIds,
    })

    return NextResponse.json({
      success: true,
      data: tool,
      message: 'Tool created successfully',
    })
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tool' },
      { status: 500 }
    )
  }
}
