import { formatDistanceToNow } from 'date-fns'

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

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const createdDate =
    typeof review.createdAt === 'string'
      ? new Date(review.createdAt)
      : review.createdAt

  return (
    <div className="border-b border-gray-200 pb-6 last:border-0">
      {/* User and Date */}
      <div className="flex items-center gap-3 mb-3">
        {review.user.image ? (
          <img
            src={review.user.image}
            alt={review.user.name || 'User'}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {review.user.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">
            {review.user.name || 'Anonymous'}
          </p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(createdDate, { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>

      {/* Content */}
      <p className="text-gray-600 mb-4">{review.content}</p>

      {/* Pros and Cons */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {review.pros && (
            <div className="rounded-lg bg-green-50 p-3">
              <p className="font-medium text-green-900 mb-1">✓ Pros</p>
              <p className="text-sm text-green-700">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="font-medium text-red-900 mb-1">✗ Cons</p>
              <p className="text-sm text-red-700">{review.cons}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
