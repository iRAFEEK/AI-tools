'use client'

import { useEffect, useState } from 'react'
import { ReviewCard } from './ReviewCard'

interface Review {
  id: string
  title: string
  content: string
  pros?: string | null
  cons?: string | null
  createdAt: Date | string
  user: {
    name: string | null
    image?: string | null
  }
}

interface ReviewListProps {
  toolId: string
  initialReviews?: Review[]
}

export function ReviewList({ toolId, initialReviews = [] }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [isLoading, setIsLoading] = useState(!initialReviews.length)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialReviews.length > 0) return

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?toolId=${toolId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch reviews')
        }

        setReviews(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [toolId, initialReviews])

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
