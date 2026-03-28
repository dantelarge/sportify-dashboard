import Image from 'next/image'
import type { SpotifyArtist } from '@/lib/spotify/types'

interface ArtistCardProps {
  artist: SpotifyArtist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const image = artist.images[0]?.url

  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-3 p-4 bg-sp-surface rounded-lg
                 hover:bg-sp-elevated transition-colors cursor-pointer"
    >
      {image ? (
        <Image
          src={image}
          alt={artist.name}
          width={120}
          height={120}
          className="rounded-full object-cover w-24 h-24"
          unoptimized
        />
      ) : (
        <div className="w-24 h-24 bg-sp-elevated rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-sp-muted">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
      <div className="text-center">
        <p className="text-white text-sm font-medium truncate max-w-[120px]">{artist.name}</p>
        <p className="text-sp-muted text-xs">Artist</p>
      </div>
    </a>
  )
}
