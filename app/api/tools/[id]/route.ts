import { NextRequest, NextResponse } from 'next/server'
import { getToolById, updateTool, deleteTool } from '@/lib/db/tools'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/tools/[id]
 * Get a single tool by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tool = await getToolById(params.id)

    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: tool,
    })
  } catch (error) {
    console.error('Error fetching tool:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tool' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tools/[id]
 * Update a tool (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update tool
    const tool = await updateTool(params.id, body)

    return NextResponse.json({
      success: true,
      data: tool,
      message: 'Tool updated successfully',
    })
  } catch (error) {
    console.error('Error updating tool:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tool' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tools/[id]
 * Delete a tool (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await deleteTool(params.id)

    return NextResponse.json({
      success: true,
      message: 'Tool deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting tool:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tool' },
      { status: 500 }
    )
  }
}
