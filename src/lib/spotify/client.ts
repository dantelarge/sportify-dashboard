import { getAccessToken, getRefreshToken, isTokenExpired } from '@/lib/auth/token-store'
import { refreshAccessToken } from '@/lib/auth/spotify-auth'

const BASE_URL = 'https://api.spotify.com/v1'

export class SpotifyApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'SpotifyApiError'
  }
}

async function getValidToken(): Promise<string> {
  if (!isTokenExpired()) {
    const token = getAccessToken()
    if (token) return token
  }

  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new SpotifyApiError(401, 'Not authenticated')

  const result = await refreshAccessToken(refreshToken)
  return result.access_token
}

export async function spotifyFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  attempt = 0,
): Promise<T> {
  const token = await getValidToken()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (response.status === 429) {
    if (attempt >= 3) throw new SpotifyApiError(429, 'Rate limit exceeded')
    const retryAfter = parseInt(response.headers.get('Retry-After') ?? '1', 10)
    const delay = Math.min(retryAfter * 1000, Math.pow(2, attempt) * 1000)
    await new Promise((resolve) => setTimeout(resolve, delay))
    return spotifyFetch<T>(endpoint, options, attempt + 1)
  }

  if (response.status === 401 && attempt === 0) {
    // Token may have just expired; force a refresh and retry once
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      await refreshAccessToken(refreshToken)
      return spotifyFetch<T>(endpoint, options, 1)
    }
    throw new SpotifyApiError(401, 'Unauthorized')
  }

  if (response.status === 204 || response.status === 202) {
    return undefined as T
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = body?.error?.message ?? `Spotify API error ${response.status}`
    throw new SpotifyApiError(response.status, message)
  }

  return response.json() as Promise<T>
}
