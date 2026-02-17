interface MatchingInput {
  projectType: string // 'web-app' | 'mobile-app' | 'data-analysis' | 'research' | 'creative'
  techStack: string[] // ['react', 'python', 'javascript', etc.]
  budget: string // 'free' | 'under-20' | 'under-50' | 'flexible'
  experienceLevel: string // 'beginner' | 'intermediate' | 'advanced'
  primaryGoal: string // 'coding' | 'design' | 'writing' | 'research' | 'automation'
  features?: string[] // Optional specific features
}

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  pricingType: string
  hasFreeTier?: boolean
  categories: Array<{ category: { name: string; slug: string } }>
  tags: Array<{ tag: { name: string; slug: string } }>
}

interface MatchResult {
  tool: Tool
  score: number
  reasons: string[]
}

/**
 * Calculate match score for a tool based on user input
 * Total possible score: 100 points
 */
export function calculateMatchScore(tool: Tool, input: MatchingInput): MatchResult {
  let score = 0
  const reasons: string[] = []

  // 1. Budget Match (30 points)
  const budgetScore = calculateBudgetScore(tool, input.budget)
  score += budgetScore.score
  if (budgetScore.reason) reasons.push(budgetScore.reason)

  // 2. Primary Goal Alignment (25 points)
  const goalScore = calculateGoalScore(tool, input.primaryGoal)
  score += goalScore.score
  if (goalScore.reason) reasons.push(goalScore.reason)

  // 3. Tech Stack Compatibility (20 points)
  const techScore = calculateTechScore(tool, input.techStack)
  score += techScore.score
  if (techScore.reason) reasons.push(techScore.reason)

  // 4. Feature Match (15 points)
  const featureScore = calculateFeatureScore(tool, input.features || [])
  score += featureScore.score
  if (featureScore.reason) reasons.push(featureScore.reason)

  // 5. Experience Level (10 points)
  const experienceScore = calculateExperienceScore(tool, input.experienceLevel)
  score += experienceScore.score
  if (experienceScore.reason) reasons.push(experienceScore.reason)

  return {
    tool,
    score: Math.round(score),
    reasons,
  }
}

/**
 * Budget scoring (30 points max)
 */
function calculateBudgetScore(tool: Tool, budget: string): { score: number; reason?: string } {
  const pricingType = tool.pricingType.toLowerCase()
  const hasFreeTier = tool.hasFreeTier

  switch (budget) {
    case 'free':
      if (pricingType === 'free' || pricingType === 'open_source') {
        return { score: 30, reason: '✓ Completely free' }
      }
      if (hasFreeTier || pricingType === 'freemium') {
        return { score: 20, reason: '✓ Has free tier available' }
      }
      return { score: 0, reason: '✗ Requires payment' }

    case 'under-20':
      if (pricingType === 'free' || pricingType === 'open_source' || hasFreeTier) {
        return { score: 30, reason: '✓ Fits your budget (free tier)' }
      }
      if (pricingType === 'freemium' || pricingType === 'subscription') {
        return { score: 25, reason: '✓ Likely within $20/month' }
      }
      return { score: 15 }

    case 'under-50':
      if (pricingType !== 'paid') {
        return { score: 30, reason: '✓ Within your budget' }
      }
      return { score: 20 }

    case 'flexible':
      return { score: 30, reason: '✓ Flexible budget - all options available' }

    default:
      return { score: 15 }
  }
}

/**
 * Goal alignment scoring (25 points max)
 */
function calculateGoalScore(tool: Tool, goal: string): { score: number; reason?: string } {
  const categories = tool.categories.map((c) => c.category.slug.toLowerCase())
  const tags = tool.tags.map((t) => t.tag.slug.toLowerCase())

  const goalMap: Record<string, string[]> = {
    coding: ['development', 'code-completion', 'debugging'],
    design: ['design', 'image-generation', 'creative'],
    writing: ['writing', 'content', 'copywriting'],
    research: ['research', 'productivity', 'analysis'],
    automation: ['productivity', 'automation', 'workflow'],
  }

  const relevantTerms = goalMap[goal] || []
  const matches = relevantTerms.filter(
    (term) =>
      categories.some((cat) => cat.includes(term)) ||
      tags.some((tag) => tag.includes(term))
  )

  if (matches.length >= 2) {
    return { score: 25, reason: `✓ Perfect for ${goal}` }
  }
  if (matches.length === 1) {
    return { score: 15, reason: `✓ Good for ${goal}` }
  }
  return { score: 0 }
}

/**
 * Tech stack compatibility (20 points max)
 */
function calculateTechScore(tool: Tool, techStack: string[]): { score: number; reason?: string } {
  if (!techStack || techStack.length === 0) {
    return { score: 10, reason: '○ Tech stack not specified' }
  }

  const tags = tool.tags.map((t) => t.tag.name.toLowerCase())
  const description = tool.description.toLowerCase()

  const compatibleTechs = techStack.filter(
    (tech) =>
      tags.some((tag) => tag.includes(tech.toLowerCase())) ||
      description.includes(tech.toLowerCase())
  )

  if (compatibleTechs.length >= techStack.length) {
    return {
      score: 20,
      reason: `✓ Compatible with ${compatibleTechs.join(', ')}`,
    }
  }
  if (compatibleTechs.length > 0) {
    return {
      score: 10,
      reason: `✓ Works with ${compatibleTechs.join(', ')}`,
    }
  }
  return { score: 5 }
}

/**
 * Feature match (15 points max)
 */
function calculateFeatureScore(tool: Tool, features: string[]): { score: number; reason?: string } {
  if (!features || features.length === 0) {
    return { score: 7 }
  }

  const tags = tool.tags.map((t) => t.tag.slug.toLowerCase())
  const matchedFeatures = features.filter((f) =>
    tags.some((tag) => tag.includes(f.toLowerCase()))
  )

  if (matchedFeatures.length >= features.length) {
    return { score: 15, reason: '✓ Has all requested features' }
  }
  if (matchedFeatures.length > 0) {
    return { score: 10, reason: `✓ Has ${matchedFeatures.length} of ${features.length} features` }
  }
  return { score: 0 }
}

/**
 * Experience level (10 points max)
 */
function calculateExperienceScore(
  tool: Tool,
  level: string
): { score: number; reason?: string } {
  const tags = tool.tags.map((t) => t.tag.slug.toLowerCase())
  const isBeginnerFriendly = tags.some((tag) => tag.includes('beginner'))

  if (level === 'beginner' && isBeginnerFriendly) {
    return { score: 10, reason: '✓ Beginner-friendly' }
  }
  if (level === 'advanced' && !isBeginnerFriendly) {
    return { score: 10, reason: '✓ Suitable for advanced users' }
  }
  return { score: 7 }
}

/**
 * Get top N matches from a list of tools
 */
export function getTopMatches(
  tools: Tool[],
  input: MatchingInput,
  topN: number = 10
): MatchResult[] {
  const results = tools
    .map((tool) => calculateMatchScore(tool, input))
    .filter((result) => result.score > 15) // Only show tools with >30% match
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  return results
}
