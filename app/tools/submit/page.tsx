'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function SubmitToolPage() {
  const router = useRouter()
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status = sessionResult?.status || 'loading'
  const [categories, setCategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/tools/submit')
    }
  }, [status, router])

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  // Show nothing if not authenticated (will redirect)
  if (!session) {
    return null
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    websiteUrl: '',
    logoUrl: '',
    pricingType: 'FREE',
    pricingDetails: '',
    hasFreeTier: false,
    categoryIds: [] as string[],
  })

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data)
        }
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit tool')
      }

      setSuccess(true)

      // Reset form
      setFormData({
        name: '',
        description: '',
        longDescription: '',
        websiteUrl: '',
        logoUrl: '',
        pricingType: 'FREE',
        pricingDetails: '',
        hasFreeTier: false,
        categoryIds: [],
      })

      // Redirect after 2 seconds
      setTimeout(() => router.push('/tools'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit tool')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit a Tool</h1>
          <p className="mt-2 text-gray-600">
            Know an AI tool that should be listed? Submit it for review!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          {/* Tool Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Tool Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., ChatGPT"
            />
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Brief description (1-2 sentences)"
            />
          </div>

          {/* Long Description */}
          <div>
            <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Detailed description, features, use cases..."
            />
          </div>

          {/* Website URL */}
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL *
            </label>
            <input
              type="url"
              id="websiteUrl"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              id="logoUrl"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Pricing Type */}
          <div>
            <label htmlFor="pricingType" className="block text-sm font-medium text-gray-700 mb-2">
              Pricing Type *
            </label>
            <select
              id="pricingType"
              value={formData.pricingType}
              onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="FREE">Free</option>
              <option value="FREEMIUM">Freemium</option>
              <option value="PAID">Paid</option>
              <option value="SUBSCRIPTION">Subscription</option>
              <option value="OPEN_SOURCE">Open Source</option>
            </select>
          </div>

          {/* Pricing Details */}
          <div>
            <label htmlFor="pricingDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Pricing Details
            </label>
            <input
              type="text"
              id="pricingDetails"
              value={formData.pricingDetails}
              onChange={(e) => setFormData({ ...formData, pricingDetails: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Free tier available, $10/month for pro"
            />
          </div>

          {/* Has Free Tier */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasFreeTier"
              checked={formData.hasFreeTier}
              onChange={(e) => setFormData({ ...formData, hasFreeTier: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hasFreeTier" className="ml-2 text-sm text-gray-700">
              Has a free tier
            </label>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
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
                Tool submitted successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Tool for Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
