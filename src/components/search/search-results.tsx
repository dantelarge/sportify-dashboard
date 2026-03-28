import type { SearchResponse, SearchType } from '@/lib/spotify/types'
import { TrackList } from './track-list'
import { ArtistCard } from './artist-card'
import { AlbumCard } from './album-card'

const TABS: { id: SearchType; label: string }[] = [
  { id: 'track', label: 'Songs' },
  { id: 'artist', label: 'Artists' },
  { id: 'album', label: 'Albums' },
]

interface SearchResultsProps {
  results: SearchResponse
  activeTab: SearchType
  onTabChange: (tab: SearchType) => void
}

export function SearchResults({ results, activeTab, onTabChange }: SearchResultsProps) {
  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-sp-elevated">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px
              ${activeTab === tab.id
                ? 'border-sp-accent text-white'
                : 'border-transparent text-sp-muted hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Songs */}
      {activeTab === 'track' && (
        <div>
          {(results.tracks?.items.length ?? 0) === 0 ? (
            <p className="text-sp-muted text-sm">No songs found</p>
          ) : (
            <TrackList tracks={results.tracks!.items} />
          )}
        </div>
      )}

      {/* Artists */}
      {activeTab === 'artist' && (
        <div>
          {(results.artists?.items.length ?? 0) === 0 ? (
            <p className="text-sp-muted text-sm">No artists found</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.artists!.items.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Albums */}
      {activeTab === 'album' && (
        <div>
          {(results.albums?.items.length ?? 0) === 0 ? (
            <p className="text-sp-muted text-sm">No albums found</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.albums!.items.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
