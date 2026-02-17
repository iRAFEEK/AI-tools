'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingInputProps {
  initialRating?: number
  onRatingChange: (rating: number) => void
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
}

export function RatingInput({
  initialRating = 0,
  onRatingChange,
  maxRating = 5,
  size = 'md',
}: RatingInputProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const handleClick = (value: number) => {
    setRating(value)
    onRatingChange(value)
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const value = index + 1
        const filled = value <= (hoveredRating || rating)

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <Star
              className={`${sizeClasses[size]} ${
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
