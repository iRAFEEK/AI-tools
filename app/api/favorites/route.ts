import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} from '@/lib/db/favorites'

/**
 * GET /api/favorites
 * Get all favorites for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const favorites = await getUserFavorites(session.user.id)

    return NextResponse.json({
      success: true,
      data: favorites,
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/favorites
 * Add a tool to favorites
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
    const { toolId } = body

    if (!toolId) {
      return NextResponse.json(
        { success: false, error: 'toolId is required' },
        { status: 400 }
      )
    }

    const favorite = await addFavorite(session.user.id, toolId)

    return NextResponse.json({
      success: true,
      data: favorite,
      message: 'Tool added to favorites',
    })
  } catch (error: any) {
    console.error('Error adding favorite:', error)

    // Handle unique constraint violation (already favorited)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Tool already in favorites' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/favorites
 * Remove a tool from favorites
 */
export async function DELETE(request: NextRequest) {
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
    const { toolId } = body

    if (!toolId) {
      return NextResponse.json(
        { success: false, error: 'toolId is required' },
        { status: 400 }
      )
    }

    await removeFavorite(session.user.id, toolId)

    return NextResponse.json({
      success: true,
      message: 'Tool removed from favorites',
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
