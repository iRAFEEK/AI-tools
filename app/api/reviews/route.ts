import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getToolReviews, createReview } from '@/lib/db/reviews'

/**
 * GET /api/reviews?toolId=xxx
 * Get reviews for a tool
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json(
        { success: false, error: 'toolId is required' },
        { status: 400 }
      )
    }

    const reviews = await getToolReviews(toolId, true)

    return NextResponse.json({
      success: true,
      data: reviews,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reviews
 * Create a new review
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { toolId, title, content, pros, cons } = body

    // Validate required fields
    if (!toolId || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'toolId, title, and content are required' },
        { status: 400 }
      )
    }

    const review = await createReview({
      userId: session.user.id,
      toolId,
      title,
      content,
      pros,
      cons,
    })

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted! It will be visible after admin approval.',
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
