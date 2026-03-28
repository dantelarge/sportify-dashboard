'use client'

import type { SpotifyTrack } from '@/lib/spotify/types'
import { TrackRow } from './track-row'
import { usePlayerContext } from '@/contexts/player-context'

interface TrackListProps {
  tracks: SpotifyTrack[]
}

export function TrackList({ tracks }: TrackListProps) {
  const { playTracks, playerState } = usePlayerContext()
  const currentTrackUri = playerState?.track_window.current_track.uri

  const uris = tracks.map((t) => t.uri)

  return (
    <div className="flex flex-col">
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          isPlaying={track.uri === currentTrackUri && !playerState?.paused}
          onPlay={() => playTracks(uris, index)}
        />
      ))}
    </div>
  )
}
