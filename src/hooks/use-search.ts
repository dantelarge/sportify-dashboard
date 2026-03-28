'use client'

import { useEffect, useState } from 'react'
import { search } from '@/lib/spotify/api'
import type { SearchResponse, SearchType } from '@/lib/spotify/types'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<SearchType>('track')

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      setError(null)
      return
    }

    const timeout = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await search(query.trim(), ['track', 'artist', 'album'], 20)
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setIsLoading(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [query])

  return { query, setQuery, results, isLoading, error, activeTab, setActiveTab }
}
