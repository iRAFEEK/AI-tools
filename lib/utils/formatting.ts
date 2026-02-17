import { formatDistanceToNow, format } from 'date-fns'

/**
 * Format a date as relative time
 * Example: "2 days ago", "3 hours ago"
 */
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Format a date as a readable string
 * Example: "January 15, 2024"
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMMM d, yyyy')
}

/**
 * Format a date with time
 * Example: "Jan 15, 2024 at 3:45 PM"
 */
export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a")
}

/**
 * Format a number with commas
 * Example: 1000 -> "1,000"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Truncate text to a maximum length with ellipsis
 * Example: "This is a long text..." (maxLength = 20)
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
