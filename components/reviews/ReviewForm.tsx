'use client'

import { useState } from 'react'
import { RatingInput } from './RatingInput'

interface ReviewFormProps {
  toolId: string
  onSuccess?: () => void
}

export function ReviewForm({ toolId, onSuccess }: ReviewFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Submit rating
      if (rating > 0) {
        await fetch('/api/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolId, value: rating }),
        })
      }

      // Submit review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          title,
          content,
          pros: pros || undefined,
          cons: cons || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      setSuccess(true)

      // Reset form
      setTitle('')
      setContent('')
      setPros('')
      setCons('')
      setRating(0)

      if (onSuccess) {
        onSuccess()
      }

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <RatingInput
          initialRating={rating}
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Summarize your experience"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Share your experience with this tool..."
        />
      </div>

      {/* Pros */}
      <div>
        <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2">
          Pros (Optional)
        </label>
        <textarea
          id="pros"
          value={pros}
          onChange={(e) => setPros(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="What did you like about this tool?"
        />
      </div>

      {/* Cons */}
      <div>
        <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2">
          Cons (Optional)
        </label>
        <textarea
          id="cons"
          value={cons}
          onChange={(e) => setCons(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="What could be improved?"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">
            Review submitted successfully! It will be visible after admin approval.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
