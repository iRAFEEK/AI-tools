import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  createSubmission,
  getAllSubmissions,
} from '@/lib/db/submissions'
import { PricingType } from '@prisma/client'

/**
 * GET /api/submissions
 * Get all submissions (admin: all, user: own)
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

    let submissions: any[]

    // Admin sees all submissions, users see only their own
    if (session.user.role === 'ADMIN') {
      const { searchParams } = new URL(request.url)
      const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED' | null
      submissions = await getAllSubmissions(status || undefined)
    } else {
      // For now, return empty array for non-admin users
      // We'll add getUserSubmissions later if needed
      submissions = []
    }

    return NextResponse.json({
      success: true,
      data: submissions,
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/submissions
 * Submit a new tool
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
    const {
      name,
      description,
      websiteUrl,
      logoUrl,
      pricingType,
      categoryIds,
      tagIds,
      longDescription,
      pricingDetails,
      hasFreeTier,
    } = body

    // Validate required fields
    if (!name || !description || !websiteUrl || !pricingType) {
      return NextResponse.json(
        {
          success: false,
          error: 'name, description, websiteUrl, and pricingType are required',
        },
        { status: 400 }
      )
    }

    // Validate pricing type
    if (!Object.values(PricingType).includes(pricingType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid pricing type' },
        { status: 400 }
      )
    }

    const submission = await createSubmission({
      userId: session.user.id,
      name,
      description,
      websiteUrl,
      logoUrl,
      pricingType,
      categoryIds: categoryIds || [],
      tagIds,
      longDescription,
      pricingDetails,
      hasFreeTier,
    })

    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Tool submitted successfully! It will be reviewed by our team.',
    })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}
