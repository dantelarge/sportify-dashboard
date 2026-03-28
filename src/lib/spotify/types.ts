export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyArtistSimple {
  id: string
  name: string
  uri: string
  external_urls: { spotify: string }
}

export interface SpotifyArtist extends SpotifyArtistSimple {
  images: SpotifyImage[]
  genres: string[]
  followers: { total: number }
  popularity: number
}

export interface SpotifyAlbumSimple {
  id: string
  name: string
  uri: string
  images: SpotifyImage[]
  artists: SpotifyArtistSimple[]
  release_date: string
  album_type: 'album' | 'single' | 'compilation'
  external_urls: { spotify: string }
}

export interface SpotifyAlbum extends SpotifyAlbumSimple {
  total_tracks: number
  genres: string[]
}

export interface SpotifyTrack {
  id: string
  name: string
  uri: string
  artists: SpotifyArtistSimple[]
  album: SpotifyAlbumSimple
  duration_ms: number
  is_playable?: boolean
  preview_url: string | null
  explicit: boolean
  external_urls: { spotify: string }
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  next: string | null
  previous: string | null
}

export interface SearchResponse {
  tracks?: Paginated<SpotifyTrack>
  artists?: Paginated<SpotifyArtist>
  albums?: Paginated<SpotifyAlbum>
}

export type SearchType = 'track' | 'artist' | 'album'

export interface SpotifyDevice {
  id: string
  name: string
  type: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  volume_percent: number | null
}

export interface PlaybackState {
  is_playing: boolean
  progress_ms: number | null
  item: SpotifyTrack | null
  device: SpotifyDevice
  shuffle_state: boolean
  repeat_state: 'off' | 'context' | 'track'
  context: { uri: string; type: string } | null
}
