'use client'

import { SearchBar } from '@/components/search/search-bar'
import { SearchResults } from '@/components/search/search-results'
import { useSearch } from '@/hooks/use-search'

export default function DashboardPage() {
  const { query, setQuery, results, isLoading, error, activeTab, setActiveTab } = useSearch()

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-6">Search</h1>
        <SearchBar query={query} onChange={setQuery} />
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-sp-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && results && (
        <SearchResults
          results={results}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {!isLoading && !results && !query && (
        <div className="text-center py-20">
          <p className="text-sp-muted text-lg">Search for songs, artists, or albums</p>
        </div>
      )}
    </div>
  )
}
