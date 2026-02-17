'use client'

import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'

interface Submission {
  id: string
  name: string
  description: string
  websiteUrl: string
  pricingType: string
  status: string
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING')

  useEffect(() => {
    fetchSubmissions()
  }, [statusFilter])

  const fetchSubmissions = async () => {
    try {
      const url = statusFilter === 'ALL'
        ? '/api/submissions'
        : `/api/submissions?status=${statusFilter}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setSubmissions(data.data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this submission and create the tool?')) return

    try {
      const response = await fetch(`/api/submissions/${id}/approve`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        alert('Submission approved and tool created!')
        fetchSubmissions()
      } else {
        alert(data.error || 'Failed to approve submission')
      }
    } catch (error) {
      console.error('Error approving submission:', error)
      alert('Failed to approve submission')
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason (optional):')
    if (reason === null) return // User cancelled

    try {
      const response = await fetch(`/api/submissions/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || undefined }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Submission rejected')
        fetchSubmissions()
      } else {
        alert(data.error || 'Failed to reject submission')
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      alert('Failed to reject submission')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tool Submissions</h1>
          <p className="mt-2 text-gray-600">
            Review and approve user-submitted AI tools
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        )}

        {/* No Submissions */}
        {!isLoading && submissions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No {statusFilter.toLowerCase()} submissions</p>
          </div>
        )}

        {/* Submissions List */}
        {!isLoading && submissions.length > 0 && (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Tool Name */}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {submission.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-gray-600">{submission.description}</p>

                    {/* Meta Info */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        <strong>URL:</strong>{' '}
                        <a
                          href={submission.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {submission.websiteUrl}
                        </a>
                      </span>
                      <span>
                        <strong>Pricing:</strong> {submission.pricingType}
                      </span>
                      <span>
                        <strong>Submitted by:</strong>{' '}
                        {submission.user.name || submission.user.email || 'Unknown'}
                      </span>
                      <span>
                        <strong>Date:</strong>{' '}
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          submission.status === 'PENDING'
                            ? 'bg-yellow-50 text-yellow-700'
                            : submission.status === 'APPROVED'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {submission.status === 'PENDING' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(submission.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
