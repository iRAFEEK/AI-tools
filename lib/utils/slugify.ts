/**
 * Convert a string to a URL-friendly slug
 * Example: "GitHub Copilot" -> "github-copilot"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if needed
 * Example: "github-copilot" might become "github-copilot-2"
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  let slug = baseSlug
  let counter = 2

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
