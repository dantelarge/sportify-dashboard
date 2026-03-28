import Image from 'next/image'

interface TrackInfoProps {
  track: Spotify.WebPlaybackTrack | null
}

export function TrackInfo({ track }: TrackInfoProps) {
  if (!track) {
    return (
      <div className="flex items-center gap-3 w-56">
        <div className="w-14 h-14 bg-sp-elevated rounded flex-shrink-0" />
        <div>
          <p className="text-sp-muted text-sm">Not playing</p>
        </div>
      </div>
    )
  }

  const albumArt = track.album.images[0]?.url
  const artistNames = track.artists.map((a) => a.name).join(', ')

  return (
    <div className="flex items-center gap-3 w-56 min-w-0">
      {albumArt ? (
        <Image
          src={albumArt}
          alt={track.album.name}
          width={56}
          height={56}
          className="rounded flex-shrink-0 object-cover"
          unoptimized
        />
      ) : (
        <div className="w-14 h-14 bg-sp-elevated rounded flex-shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-white text-sm font-medium truncate" title={track.name}>
          {track.name}
        </p>
        <p className="text-sp-muted text-xs truncate" title={artistNames}>
          {artistNames}
        </p>
      </div>
    </div>
  )
}
