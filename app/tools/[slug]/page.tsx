'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ExternalLink, Heart, Star, Users } from 'lucide-react'
import { RatingStars } from '@/components/reviews/RatingStars'
import { RatingInput } from '@/components/reviews/RatingInput'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewList } from '@/components/reviews/ReviewList'
import { useFavorites } from '@/hooks/useFavorites'

export const dynamic = 'force-dynamic'

export default function ToolDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [tool, setTool] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [refreshReviews, setRefreshReviews] = useState(0)

  // Always call hook unconditionally (Rules of Hooks)
  const { isFavorited, isLoading: favLoading, toggleFavorite } = useFavorites(tool?.id || '')

  // Fetch tool data
  useEffect(() => {
    async function fetchTool() {
      try {
        const res = await fetch(`/api/tools?slug=${slug}`)
        const data = await res.json()
        if (data.success && data.data?.tools?.length > 0) {
          setTool(data.data.tools[0])
        }
      } catch (error) {
        console.error('Error fetching tool:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (slug) {
      fetchTool()
    }
  }, [slug])

  const handleRatingSubmit = async (score: number) => {
    if (!tool) return

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id, score }),
      })

      if (res.ok) {
        // Refresh tool data to get updated average rating
        const toolRes = await fetch(`/api/tools?slug=${slug}`)
        const toolData = await toolRes.json()
        if (toolData.success && toolData.data?.tools?.length > 0) {
          setTool(toolData.data.tools[0])
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tool not found</h1>
          <p className="mt-2 text-gray-600">The tool you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            {tool.logoUrl && (
              <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-gray-100 p-3">
                <img
                  src={tool.logoUrl}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {/* Title and Actions */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                  <p className="mt-2 text-lg text-gray-600">{tool.description}</p>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  disabled={favLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorited
                      ? 'text-red-500 bg-red-50 hover:bg-red-100'
                      : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                  } ${favLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Meta Info */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {/* Rating */}
                {tool.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <RatingStars rating={tool.averageRating} size="sm" showValue />
                  </div>
                )}

                {/* Review Count */}
                {tool._count?.reviews > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{tool._count.reviews} reviews</span>
                  </div>
                )}

                {/* Pricing */}
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {tool.pricingType.split('_').map((word: string) =>
                    word.charAt(0) + word.slice(1).toLowerCase()
                  ).join(' ')}
                </span>
              </div>

              {/* Visit Website Button */}
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Long Description */}
        {tool.longDescription && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {tool.name}</h2>
            <p className="text-gray-700 whitespace-pre-line">{tool.longDescription}</p>
          </div>
        )}

        {/* Categories and Tags */}
        {(tool.categories?.length > 0 || tool.tags?.length > 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            {tool.categories?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.categories.map((cat: any) => (
                    <span
                      key={cat.category.id}
                      className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700"
                    >
                      {cat.category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tool.tags?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag: any) => (
                    <span
                      key={tag.tag.id}
                      className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700"
                    >
                      {tag.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rating Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rate this Tool</h2>
          <RatingInput onRatingChange={handleRatingSubmit} />
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Write a Review
            </button>
          </div>

          <ReviewList toolId={tool.id} key={refreshReviews} />
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <ReviewForm
                toolId={tool.id}
                onClose={() => setShowReviewForm(false)}
                onSuccess={() => {
                  setShowReviewForm(false)
                  setRefreshReviews(prev => prev + 1)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
