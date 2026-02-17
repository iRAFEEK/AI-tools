import { useState, useCallback } from 'react'

export function useFavorites(initialFavorited: boolean = false) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const toggleFavorite = useCallback(async (toolId: string) => {
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
        throw new Error(data.error || 'Failed to update favorite')
      }

      // Toggle local state
      setIsFavorited(!isFavorited)

      return { success: true }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    } finally {
      setIsLoading(false)
    }
  }, [isFavorited])

  return {
    isFavorited,
    isLoading,
    toggleFavorite,
  }
}
