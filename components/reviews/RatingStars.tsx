import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating)
        const partial = index === Math.floor(rating) && rating % 1 !== 0

        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} ${
              filled
                ? 'fill-yellow-400 text-yellow-400'
                : partial
                ? 'fill-yellow-200 text-yellow-400'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        )
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
