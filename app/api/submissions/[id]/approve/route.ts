import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { approveSubmission } from '@/lib/db/submissions'

/**
 * POST /api/submissions/[id]/approve
 * Approve a submission and create tool (admin only)
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

    const tool = await approveSubmission(id)

    return NextResponse.json({
      success: true,
      data: tool,
      message: 'Submission approved and tool created successfully!',
    })
  } catch (error) {
    console.error('Error approving submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve submission' },
      { status: 500 }
    )
  }
}
