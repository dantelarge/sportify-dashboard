'use client'

import Image from 'next/image'
import type { SpotifyAlbumSimple } from '@/lib/spotify/types'
import { usePlayerContext } from '@/contexts/player-context'

interface AlbumCardProps {
  album: SpotifyAlbumSimple
}

export function AlbumCard({ album }: AlbumCardProps) {
  const { playContext } = usePlayerContext()
  const image = album.images[0]?.url
  const artistNames = album.artists.map((a) => a.name).join(', ')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => playContext(album.uri)}
      onKeyDown={(e) => e.key === 'Enter' && playContext(album.uri)}
      className="flex flex-col gap-3 p-4 bg-sp-surface rounded-lg
                 hover:bg-sp-elevated transition-colors cursor-pointer group"
    >
      <div className="relative w-full aspect-square">
        {image ? (
          <Image
            src={image}
            alt={album.name}
            fill
            className="rounded object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-sp-elevated rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-sp-muted">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-sp-accent rounded-full flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-sp-bg translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <p className="text-white text-sm font-medium truncate">{album.name}</p>
        <p className="text-sp-muted text-xs truncate">{album.release_date.slice(0, 4)} · {artistNames}</p>
      </div>
    </div>
  )
}
