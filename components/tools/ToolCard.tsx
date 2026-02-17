'use client'

import Link from 'next/link'
import { ToolWithRelations } from '@/types'
import { Star, Heart, Eye } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

interface ToolCardProps {
  tool: ToolWithRelations | any // Using any for now to handle different tool shapes
}

export function ToolCard({ tool }: ToolCardProps) {
  const { isFavorited, isLoading, toggleFavorite } = useFavorites(false)
  // Format pricing type for display
  const formatPricing = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Get first category for display
  const primaryCategory = tool.categories?.[0]?.category?.name

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block"
    >
      <div className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300">
        {/* Logo and Name */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {tool.logoUrl && (
              <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 p-2">
                <img
                  src={tool.logoUrl}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {tool.name}
              </h3>
              {primaryCategory && (
                <p className="text-sm text-gray-500">{primaryCategory}</p>
              )}
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(tool.id)
            }}
            disabled={isLoading}
            className={`transition-colors ${
              isFavorited
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 hover:text-red-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {tool.description}
        </p>

        {/* Pricing Badge */}
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {formatPricing(tool.pricingType)}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          {/* Rating */}
          {tool.averageRating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">
                {tool.averageRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Review count */}
          {tool._count?.reviews ? (
            <span>{tool._count.reviews} reviews</span>
          ) : tool.reviewCount ? (
            <span>{tool.reviewCount} reviews</span>
          ) : null}

          {/* View count */}
          {tool.viewCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{tool.viewCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
