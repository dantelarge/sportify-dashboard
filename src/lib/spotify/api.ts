import { spotifyFetch } from './client'
import type { PlaybackState, SearchResponse, SearchType, SpotifyTrack } from './types'

export async function search(
  query: string,
  types: SearchType[],
  limit = 20,
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    type: types.join(','),
    limit: limit.toString(),
  })
  return spotifyFetch<SearchResponse>(`/search?${params.toString()}`)
}

export async function getTrack(id: string): Promise<SpotifyTrack> {
  return spotifyFetch<SpotifyTrack>(`/tracks/${id}`)
}

export async function getPlaybackState(): Promise<PlaybackState | null> {
  return spotifyFetch<PlaybackState | null>('/me/player')
}

export async function transferPlayback(deviceId: string): Promise<void> {
  return spotifyFetch<void>('/me/player', {
    method: 'PUT',
    body: JSON.stringify({ device_ids: [deviceId], play: true }),
  })
}

export async function playTracks(deviceId: string, uris: string[]): Promise<void> {
  return spotifyFetch<void>(`/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    body: JSON.stringify({ uris }),
  })
}

export async function playContext(
  deviceId: string,
  contextUri: string,
  offsetIndex?: number,
): Promise<void> {
  const body: Record<string, unknown> = { context_uri: contextUri }
  if (offsetIndex !== undefined) {
    body.offset = { position: offsetIndex }
  }
  return spotifyFetch<void>(`/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function pausePlayback(deviceId: string): Promise<void> {
  return spotifyFetch<void>(`/me/player/pause?device_id=${deviceId}`, { method: 'PUT' })
}

export async function resumePlayback(deviceId: string): Promise<void> {
  return spotifyFetch<void>(`/me/player/play?device_id=${deviceId}`, { method: 'PUT' })
}

export async function skipToNext(deviceId: string): Promise<void> {
  return spotifyFetch<void>(`/me/player/next?device_id=${deviceId}`, { method: 'POST' })
}

export async function skipToPrevious(deviceId: string): Promise<void> {
  return spotifyFetch<void>(`/me/player/previous?device_id=${deviceId}`, { method: 'POST' })
}

export async function seekToPosition(deviceId: string, positionMs: number): Promise<void> {
  const params = new URLSearchParams({
    position_ms: Math.round(positionMs).toString(),
    device_id: deviceId,
  })
  return spotifyFetch<void>(`/me/player/seek?${params.toString()}`, { method: 'PUT' })
}

export async function setVolume(deviceId: string, volumePercent: number): Promise<void> {
  const params = new URLSearchParams({
    volume_percent: Math.round(volumePercent).toString(),
    device_id: deviceId,
  })
  return spotifyFetch<void>(`/me/player/volume?${params.toString()}`, { method: 'PUT' })
}
