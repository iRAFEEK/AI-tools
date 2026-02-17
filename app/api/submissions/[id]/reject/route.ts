import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { rejectSubmission } from '@/lib/db/submissions'

/**
 * POST /api/submissions/[id]/reject
 * Reject a submission (admin only)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reason } = body

    await rejectSubmission(id, reason)

    return NextResponse.json({
      success: true,
      message: 'Submission rejected successfully',
    })
  } catch (error) {
    console.error('Error rejecting submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reject submission' },
      { status: 500 }
    )
  }
}
