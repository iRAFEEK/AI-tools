import { getAllTools } from '@/lib/db/tools'
import { ToolCard } from '@/components/tools/ToolCard'

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic'

export default async function ToolsPage() {
  // Fetch tools from database
  const { tools, pagination } = await getAllTools({
    page: 1,
    limit: 20,
    sort: 'newest',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Tools Directory
          </h1>
          <p className="mt-2 text-gray-600">
            Discover the best AI tools for your projects
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {pagination.total} tools available
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tools found. Add your first tool!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Pagination (placeholder) */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <span className="text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
