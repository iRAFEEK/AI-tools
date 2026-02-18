import { useState, useCallback, useEffect } from 'react'

export function useFavorites(toolId: string) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial favorite state
  useEffect(() => {
    // Skip if no toolId provided
    if (!toolId) {
      setIsLoading(false)
      return
    }

    async function checkFavorite() {
      try {
        const res = await fetch(`/api/favorites/check?toolId=${toolId}`)
        const data = await res.json()
        setIsFavorited(data.isFavorited)
      } catch (error) {
        console.error('Error checking favorite:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkFavorite()
  }, [toolId])

  const toggleFavorite = useCallback(async () => {
    // Skip if no toolId
    if (!toolId) return { success: false, error: 'No tool selected' }

    setIsLoading(true)

    try {
      const endpoint = '/api/favorites'
      const method = isFavorited ? 'DELETE' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle unauthorized error
        if (response.status === 401) {
          alert('Please sign in to add favorites')
          return { success: false, error: 'Unauthorized' }
        }
        throw new Error(data.error || 'Failed to update favorite')
      }

      // Toggle local state
      setIsFavorited(!isFavorited)

      return { success: true }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to update favorite. Please try again.')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    } finally {
      setIsLoading(false)
    }
  }, [isFavorited, toolId])

  return {
    isFavorited,
    isLoading,
    toggleFavorite,
  }
}
