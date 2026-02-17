import Link from 'next/link'
import { ArrowRight, Sparkles, Search, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-8">
            <Sparkles className="h-4 w-4" />
            AI Tools Directory for Students
          </div>

          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
            Discover the Best
            <span className="text-blue-600"> AI Tools </span>
            for Your Projects
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect AI tools for coding, design, research, and more.
            Curated for students who want to build amazing projects.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Tools
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/smart-match"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Sparkles className="h-5 w-5" />
              Smart Match
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Easy Discovery
            </h3>
            <p className="text-gray-600">
              Browse tools by category, pricing, or search for exactly what you need
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Recommendations
            </h3>
            <p className="text-gray-600">
              Answer a few questions and get personalized tool recommendations
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Student Reviews
            </h3>
            <p className="text-gray-600">
              Read honest reviews from other students who've used these tools
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect AI Tool?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join students discovering and using the best AI tools for their projects
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
