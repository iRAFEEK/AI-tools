import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { upsertRating } from '@/lib/db/ratings'

/**
 * POST /api/ratings
 * Create or update a rating
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
    const { toolId, score } = body

    // Validate input
    if (!toolId || !score) {
      return NextResponse.json(
        { success: false, error: 'toolId and score are required' },
        { status: 400 }
      )
    }

    if (score < 1 || score > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating score must be between 1 and 5' },
        { status: 400 }
      )
    }

    const result = await upsertRating(session.user.id, toolId, score)

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Rating saved successfully',
    })
  } catch (error) {
    console.error('Error saving rating:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save rating' },
      { status: 500 }
    )
  }
}
