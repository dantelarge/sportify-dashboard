'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { transferPlayback, playTracks, playContext as playContextApi } from '@/lib/spotify/api'
import { getAccessToken, getRefreshToken, isTokenExpired } from '@/lib/auth/token-store'
import { refreshAccessToken } from '@/lib/auth/spotify-auth'
import { useAuthContext } from './auth-context'

interface PlayerContextValue {
  player: Spotify.Player | null
  deviceId: string | null
  playerState: Spotify.WebPlaybackState | null
  isReady: boolean
  error: string | null
  playTracks: (uris: string[], offsetIndex?: number) => Promise<void>
  playContext: (contextUri: string, offsetIndex?: number) => Promise<void>
  togglePlay: () => Promise<void>
  seek: (ms: number) => Promise<void>
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  setVolume: (fraction: number) => Promise<void>
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext()
  const [player, setPlayer] = useState<Spotify.Player | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [playerState, setPlayerState] = useState<Spotify.WebPlaybackState | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const playerRef = useRef<Spotify.Player | null>(null)
  const deviceIdRef = useRef<string | null>(null)

  const initPlayer = useCallback(() => {
    if (playerRef.current) return // Already initialized

    const instance = new window.Spotify.Player({
      name: 'Sportify Web Player',
      volume: 0.8,
      getOAuthToken: (cb) => {
        if (!isTokenExpired()) {
          const token = getAccessToken()
          if (token) { cb(token); return }
        }
        const refreshToken = getRefreshToken()
        if (refreshToken) {
          refreshAccessToken(refreshToken)
            .then((result) => cb(result.access_token))
            .catch(() => setError('Failed to refresh authentication token'))
        }
      },
    })

    instance.addListener('ready', ({ device_id }) => {
      deviceIdRef.current = device_id
      setDeviceId(device_id)
      setIsReady(true)
      // Transfer playback to this browser device
      transferPlayback(device_id).catch(() => {
        // Non-fatal: user may not have an active session
      })
    })

    instance.addListener('not_ready', () => {
      setDeviceId(null)
      deviceIdRef.current = null
      setIsReady(false)
    })

    instance.addListener('player_state_changed', (state) => {
      setPlayerState(state)
    })

    instance.addListener('initialization_error', ({ message }) => {
      setError(`Player initialization failed: ${message}`)
    })

    instance.addListener('authentication_error', ({ message }) => {
      setError(`Authentication error: ${message}`)
    })

    instance.addListener('account_error', ({ message }) => {
      setError(`Spotify Premium is required to use the web player. ${message}`)
    })

    instance.connect()
    playerRef.current = instance
    setPlayer(instance)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    // SDK may already be loaded (hot reload / fast navigation)
    if (window.Spotify) {
      initPlayer()
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect()
        playerRef.current = null
      }
    }
  }, [isAuthenticated, initPlayer])

  const handlePlayTracks = useCallback(
    async (uris: string[], offsetIndex?: number) => {
      if (!deviceIdRef.current) return
      const urisToPlay = offsetIndex !== undefined ? uris.slice(offsetIndex) : uris
      await playTracks(deviceIdRef.current, urisToPlay)
    },
    [],
  )

  const handlePlayContext = useCallback(
    async (contextUri: string, offsetIndex?: number) => {
      if (!deviceIdRef.current) return
      await playContextApi(deviceIdRef.current, contextUri, offsetIndex)
    },
    [],
  )

  const togglePlay = useCallback(async () => {
    await playerRef.current?.togglePlay()
  }, [])

  const seek = useCallback(async (ms: number) => {
    await playerRef.current?.seek(ms)
  }, [])

  const nextTrack = useCallback(async () => {
    await playerRef.current?.nextTrack()
  }, [])

  const previousTrack = useCallback(async () => {
    await playerRef.current?.previousTrack()
  }, [])

  const handleSetVolume = useCallback(async (fraction: number) => {
    await playerRef.current?.setVolume(fraction)
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        player,
        deviceId,
        playerState,
        isReady,
        error,
        playTracks: handlePlayTracks,
        playContext: handlePlayContext,
        togglePlay,
        seek,
        nextTrack,
        previousTrack,
        setVolume: handleSetVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayerContext(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayerContext must be used within PlayerProvider')
  return ctx
}
