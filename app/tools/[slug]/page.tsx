import { notFound } from 'next/navigation'
import { getToolBySlug } from '@/lib/db/tools'
import { Star, ExternalLink, Heart } from 'lucide-react'

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic'

interface ToolDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  // Format pricing type
  const formatPricing = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <a
          href="/tools"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Back to all tools
        </a>

        {/* Tool Header */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-6">
            {/* Logo */}
            {tool.logoUrl && (
              <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 p-3">
                <img
                  src={tool.logoUrl}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {/* Name and Description */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {tool.name}
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    {tool.description}
                  </p>
                </div>

                {/* Favorite Button */}
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center gap-6 text-sm">
                {tool.averageRating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {tool.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({tool._count?.reviews || 0} reviews)
                    </span>
                  </div>
                )}
                <div className="text-gray-500">
                  {tool.viewCount} views
                </div>
                <div className="text-gray-500">
                  {tool._count?.favorites || 0} favorites
                </div>
              </div>

              {/* Categories and Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.categories.map((tc) => (
                  <span
                    key={tc.category.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {tc.category.name}
                  </span>
                ))}
                {tool.tags.slice(0, 3).map((tt) => (
                  <span
                    key={tt.tag.id}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {tt.tag.name}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        {tool.longDescription && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About {tool.name}
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">
                {tool.longDescription}
              </p>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-base font-medium text-blue-700">
              {formatPricing(tool.pricingType)}
            </span>
            {tool.hasFreeTier && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Has free tier
              </span>
            )}
          </div>
          {tool.pricingDetails && (
            <p className="mt-3 text-gray-600">{tool.pricingDetails}</p>
          )}
        </div>

        {/* Reviews Section (placeholder) */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Reviews ({tool._count?.reviews || 0})
          </h2>
          {tool.reviews && tool.reviews.length > 0 ? (
            <div className="space-y-4">
              {tool.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {review.user.name || 'Anonymous'}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{review.title}</h3>
                  <p className="text-gray-600 text-sm">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  )
}
