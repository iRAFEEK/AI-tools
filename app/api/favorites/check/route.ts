import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/favorites/check?toolId=xxx
 * Check if a tool is favorited by the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false })
    }

    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json(
        { success: false, error: 'toolId is required' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_toolId: {
          userId: session.user.id,
          toolId,
        },
      },
    })

    return NextResponse.json({ isFavorited: !!favorite })
  } catch (error) {
    console.error('Error checking favorite:', error)
    return NextResponse.json({ isFavorited: false })
  }
}
