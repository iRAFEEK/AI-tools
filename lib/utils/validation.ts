import { z } from 'zod'

// ============================================
// Tool Validation Schemas
// ============================================

export const toolSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  websiteUrl: z.string().url('Must be a valid URL'),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  pricingType: z.enum(['FREE', 'FREEMIUM', 'PAID', 'SUBSCRIPTION', 'OPEN_SOURCE']),
})

export const toolSubmissionSchema = toolSchema.extend({
  suggestedCategories: z.array(z.string()).min(1, 'Select at least one category'),
  suggestedTags: z.array(z.string()).optional(),
})

// ============================================
// Review Validation Schemas
// ============================================

export const reviewSchema = z.object({
  toolId: z.string().cuid('Invalid tool ID'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  content: z.string().min(20, 'Review must be at least 20 characters').max(5000),
  pros: z.string().max(1000).optional().or(z.literal('')),
  cons: z.string().max(1000).optional().or(z.literal('')),
})

// ============================================
// Rating Validation Schema
// ============================================

export const ratingSchema = z.object({
  toolId: z.string().cuid('Invalid tool ID'),
  score: z.number().int().min(1).max(5, 'Rating must be between 1 and 5 stars'),
})

// ============================================
// Matching Form Validation Schema
// ============================================

export const matchingFormSchema = z.object({
  projectType: z.string().min(1, 'Please select a project type'),
  techStack: z.array(z.string()).min(1, 'Select at least one technology'),
  budget: z.enum(['free', 'under-20', 'under-50', 'flexible']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  primaryGoal: z.string().min(1, 'Please select your primary goal'),
  specificFeatures: z.array(z.string()),
})

// ============================================
// Helper Functions
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email()
  return emailSchema.safeParse(email).success
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  const urlSchema = z.string().url()
  return urlSchema.safeParse(url).success
}

/**
 * Sanitize HTML to prevent XSS attacks
 * (Basic version - for production, use a library like DOMPurify)
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
