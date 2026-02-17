import { NextRequest, NextResponse } from 'next/server'
import { getAllTools } from '@/lib/db/tools'
import { getTopMatches } from '@/lib/algorithms/matching-algorithm'

/**
 * POST /api/matching
 * Get tool recommendations based on user input
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectType, techStack, budget, experienceLevel, primaryGoal, features } = body

    // Validate required fields
    if (!projectType || !budget || !experienceLevel || !primaryGoal) {
      return NextResponse.json(
        {
          success: false,
          error: 'projectType, budget, experienceLevel, and primaryGoal are required',
        },
        { status: 400 }
      )
    }

    // Get all published tools
    const { tools } = await getAllTools({
      page: 1,
      limit: 1000, // Get all tools for matching
    })

    // Calculate matches
    const matches = getTopMatches(
      tools,
      {
        projectType,
        techStack: techStack || [],
        budget,
        experienceLevel,
        primaryGoal,
        features: features || [],
      },
      10 // Top 10 matches
    )

    return NextResponse.json({
      success: true,
      data: {
        matches,
        input: {
          projectType,
          techStack,
          budget,
          experienceLevel,
          primaryGoal,
          features,
        },
      },
    })
  } catch (error) {
    console.error('Error calculating matches:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate matches' },
      { status: 500 }
    )
  }
}
