import { Tool, User, Category, Review, Rating, Favorite, ToolSubmission } from '@prisma/client'

// ============================================
// Extended Types (with relations)
// ============================================

// Tool with all its relations
export type ToolWithRelations = Tool & {
  categories: { category: Category }[]
  reviews: Review[]
  ratings: Rating[]
  _count?: {
    favorites: number
    reviews: number
  }
}

// User with their activity
export type UserWithActivity = User & {
  favorites: Favorite[]
  reviews: Review[]
  ratings: Rating[]
}

// ============================================
// API Response Types
// ============================================

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// Form Input Types
// ============================================

export type ToolFormInput = {
  name: string
  description: string
  websiteUrl: string
  logoUrl?: string
  pricingType: 'FREE' | 'FREEMIUM' | 'PAID' | 'SUBSCRIPTION' | 'OPEN_SOURCE'
  categories: string[]
  tags?: string[]
}

export type ReviewFormInput = {
  toolId: string
  title: string
  content: string
  pros?: string
  cons?: string
}

export type MatchingFormInput = {
  projectType: string
  techStack: string[]
  budget: string
  experienceLevel: string
  primaryGoal: string
  specificFeatures: string[]
}

// ============================================
// Filter Types
// ============================================

export type ToolFilters = {
  category?: string[]
  tags?: string[]
  pricingType?: string[]
  search?: string
  sort?: 'popular' | 'newest' | 'rating'
  page?: number
  limit?: number
}

// ============================================
// Export Prisma types for convenience
// ============================================

export type { Tool, User, Category, Review, Rating, Favorite, ToolSubmission }
