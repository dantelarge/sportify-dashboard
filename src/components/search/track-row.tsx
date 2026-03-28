import Image from 'next/image'
import type { SpotifyTrack } from '@/lib/spotify/types'

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

interface TrackRowProps {
  track: SpotifyTrack
  isPlaying: boolean
  onPlay: () => void
}

export function TrackRow({ track, isPlaying, onPlay }: TrackRowProps) {
  const albumArt = track.album.images.at(-1)?.url // smallest image for list
  const artistNames = track.artists.map((a) => a.name).join(', ')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPlay}
      onKeyDown={(e) => e.key === 'Enter' && onPlay()}
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer group
                  hover:bg-sp-elevated transition-colors
                  ${isPlaying ? 'bg-sp-elevated' : ''}`}
    >
      <div className="relative w-10 h-10 flex-shrink-0">
        {albumArt ? (
          <Image
            src={albumArt}
            alt={track.album.name}
            width={40}
            height={40}
            className="rounded object-cover"
            unoptimized
          />
        ) : (
          <div className="w-10 h-10 bg-sp-surface rounded" />
        )}
        <div className="absolute inset-0 flex items-center justify-center
                        bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${isPlaying ? 'text-sp-accent' : 'text-white'}`}
        >
          {track.name}
        </p>
        <p className="text-xs text-sp-muted truncate">{artistNames}</p>
      </div>

      <p className="text-xs text-sp-muted flex-shrink-0">{formatDuration(track.duration_ms)}</p>
    </div>
  )
}
