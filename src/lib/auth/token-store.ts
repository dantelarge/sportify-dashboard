const ACCESS_TOKEN_KEY = 'spotify_access_token'
const REFRESH_TOKEN_KEY = 'spotify_refresh_token'
const EXPIRY_KEY = 'spotify_token_expiry'

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}

export function storeTokens(response: TokenResponse): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access_token)
  if (response.refresh_token) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token)
  }
  // Store expiry with a 60s buffer so we refresh before actual expiry
  const expiry = Date.now() + (response.expires_in - 60) * 1000
  sessionStorage.setItem(EXPIRY_KEY, expiry.toString())
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function isTokenExpired(): boolean {
  const expiry = sessionStorage.getItem(EXPIRY_KEY)
  if (!expiry) return true
  return Date.now() > parseInt(expiry, 10)
}

export function clearTokens(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem(EXPIRY_KEY)
}
