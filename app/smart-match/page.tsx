'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import { RatingStars } from '@/components/reviews/RatingStars'

interface MatchResult {
  tool: any
  score: number
  reasons: string[]
}

export default function SmartMatchPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<MatchResult[]>([])

  const [formData, setFormData] = useState({
    projectType: '',
    techStack: [] as string[],
    budget: '',
    experienceLevel: '',
    primaryGoal: '',
  })

  const handleSubmitWithData = async (data: typeof formData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setResults(result.data.matches)
        setStep(6) // Results step
      } else {
        alert(result.error || 'Failed to get matches')
      }
    } catch (error) {
      console.error('Error getting matches:', error)
      alert('Failed to get matches')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => handleSubmitWithData(formData)

  const toggleTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }))
  }

  const techOptions = ['React', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Node.js', 'Next.js', 'Vue', 'Angular']

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-4">
            <Sparkles className="h-4 w-4" />
            Smart Match
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Find Your Perfect AI Tools
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Answer a few questions and get personalized recommendations
          </p>
        </div>

        {/* Progress Bar */}
        {step < 6 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {step} of 5</span>
              <span>{Math.round((step / 5) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          {/* Step 1: Project Type */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What are you building?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'web-app', label: 'Web Application', desc: 'Websites, web apps, SaaS' },
                  { value: 'mobile-app', label: 'Mobile App', desc: 'iOS, Android apps' },
                  { value: 'data-analysis', label: 'Data Analysis', desc: 'Data science, ML projects' },
                  { value: 'research', label: 'Research Paper', desc: 'Academic research, writing' },
                  { value: 'creative', label: 'Creative Project', desc: 'Design, art, media' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFormData({ ...formData, projectType: option.value })
                      setStep(2)
                    }}
                    className={`text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ${
                      formData.projectType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Tech Stack */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What technologies are you using?
              </h2>
              <p className="text-gray-600 mb-6">Select all that apply (optional)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.techStack.includes(tech)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
                >
                  <ArrowLeft className="inline h-5 w-5 mr-2" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="inline h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What's your budget?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'free', label: 'Free only', desc: 'I need completely free tools' },
                  { value: 'under-20', label: 'Under $20/month', desc: 'Affordable subscription' },
                  { value: 'under-50', label: 'Under $50/month', desc: 'Mid-tier budget' },
                  { value: 'flexible', label: 'Flexible', desc: 'Budget is not a constraint' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFormData({ ...formData, budget: option.value })
                      setStep(4)
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ${
                      formData.budget === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
              >
                <ArrowLeft className="inline h-5 w-5 mr-2" />
                Back
              </button>
            </div>
          )}

          {/* Step 4: Experience Level */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What's your experience level?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Beginner', desc: 'Just getting started' },
                  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                  { value: 'advanced', label: 'Advanced', desc: 'Very experienced' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFormData({ ...formData, experienceLevel: option.value })
                      setStep(5)
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ${
                      formData.experienceLevel === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(3)}
                className="mt-6 w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
              >
                <ArrowLeft className="inline h-5 w-5 mr-2" />
                Back
              </button>
            </div>
          )}

          {/* Step 5: Primary Goal */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What's your main goal?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'coding', label: 'Coding Assistance', desc: 'Code completion, debugging, help' },
                  { value: 'design', label: 'Design & Images', desc: 'UI/UX, graphics, image generation' },
                  { value: 'writing', label: 'Writing & Content', desc: 'Copywriting, articles, documentation' },
                  { value: 'research', label: 'Research & Analysis', desc: 'Data analysis, insights, learning' },
                  { value: 'automation', label: 'Automation', desc: 'Workflow automation, productivity' },
                ].map((option) => (
                  <button
                    key={option.value}
                  <button
                    key={option.value}
                    onClick={() => {
                      const updatedData = { ...formData, primaryGoal: option.value }
                      setFormData(updatedData)
                      handleSubmitWithData(updatedData)
                    }}
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ${
                      formData.primaryGoal === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(4)}
                className="mt-6 w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
              >
                <ArrowLeft className="inline h-5 w-5 mr-2" />
                Back
              </button>
            </div>
          )}

          {/* Step 6: Results */}
          {step === 6 && (
            <div>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Perfect Matches! 🎯
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Based on your answers, here are the top {results.length} tools for you:
                  </p>

                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div
                        key={result.tool.id}
                        className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Rank */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-600'
                            }`}>
                              {index + 1}
                            </div>
                          </div>

                          {/* Tool Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {result.tool.name}
                                </h3>
                                {result.tool.averageRating > 0 && (
                                  <div className="mt-1">
                                    <RatingStars rating={result.tool.averageRating} size="sm" showValue />
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{result.score}%</div>
                                <div className="text-xs text-gray-500">Match</div>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3">{result.tool.description}</p>

                            {/* Match Reasons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {result.reasons.map((reason, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                                >
                                  {reason}
                                </span>
                              ))}
                            </div>

                            {/* CTA */}
                            <a
                              href={`/tools/${result.tool.slug}`}
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              View Details
                              <ArrowRight className="h-4 w-4" />

                  {results.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">
                        No tools matched your criteria.
                      </p>
                      <button
                        onClick={() => setStep(1)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Try different answers
                      </button>
                    </div>
                  )}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Start Over Button */}
                  <button
                    onClick={() => {
                      setStep(1)
                      setFormData({
                        projectType: '',
                        techStack: [],
                        budget: '',
                        experienceLevel: '',
                        primaryGoal: '',
                      })
                      setResults([])
                    }}
                    className="mt-8 w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
