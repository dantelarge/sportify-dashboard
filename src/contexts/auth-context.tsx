'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { buildAuthUrl, refreshAccessToken } from '@/lib/auth/spotify-auth'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
} from '@/lib/auth/token-store'

interface AuthContextValue {
  isAuthenticated: boolean
  accessToken: string | null
  login: () => Promise<void>
  logout: () => void
  refreshIfNeeded: () => Promise<string>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Rehydrate from sessionStorage on mount and refresh if expired
  useEffect(() => {
    async function init() {
      const token = getAccessToken()
      const refreshToken = getRefreshToken()

      if (token && !isTokenExpired()) {
        setAccessToken(token)
      } else if (refreshToken) {
        try {
          const result = await refreshAccessToken(refreshToken)
          setAccessToken(result.access_token)
        } catch {
          clearTokens()
        }
      }
      setIsReady(true)
    }
    init()
  }, [])

  const login = useCallback(async () => {
    const url = await buildAuthUrl()
    window.location.href = url
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setAccessToken(null)
    window.location.href = '/login'
  }, [])

  const refreshIfNeeded = useCallback(async (): Promise<string> => {
    const token = getAccessToken()
    if (token && !isTokenExpired()) return token

    const refreshToken = getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token available')

    const result = await refreshAccessToken(refreshToken)
    setAccessToken(result.access_token)
    return result.access_token
  }, [])

  // Keep accessToken state in sync when refreshIfNeeded is called externally
  const isAuthenticated = !!accessToken

  if (!isReady) return null

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout, refreshIfNeeded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
