export {}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: typeof Spotify
  }

  namespace Spotify {
    interface PlayerInit {
      name: string
      getOAuthToken: (cb: (token: string) => void) => void
      volume?: number
    }

    class Player {
      constructor(options: PlayerInit)
      connect(): Promise<boolean>
      disconnect(): void
      addListener(event: 'ready', cb: (data: { device_id: string }) => void): void
      addListener(event: 'not_ready', cb: (data: { device_id: string }) => void): void
      addListener(event: 'player_state_changed', cb: (state: WebPlaybackState | null) => void): void
      addListener(event: 'initialization_error', cb: (data: { message: string }) => void): void
      addListener(event: 'authentication_error', cb: (data: { message: string }) => void): void
      addListener(event: 'account_error', cb: (data: { message: string }) => void): void
      addListener(event: string, cb: (...args: unknown[]) => void): void
      removeListener(event: string, cb?: (...args: unknown[]) => void): void
      getCurrentState(): Promise<WebPlaybackState | null>
      setVolume(volume: number): Promise<void>
      pause(): Promise<void>
      resume(): Promise<void>
      togglePlay(): Promise<void>
      seek(positionMs: number): Promise<void>
      previousTrack(): Promise<void>
      nextTrack(): Promise<void>
    }

    interface WebPlaybackState {
      context: { uri: string; metadata: Record<string, unknown> }
      disallows: Record<string, boolean>
      paused: boolean
      position: number
      duration: number
      repeat_mode: 0 | 1 | 2
      shuffle: boolean
      track_window: {
        current_track: WebPlaybackTrack
        previous_tracks: WebPlaybackTrack[]
        next_tracks: WebPlaybackTrack[]
      }
      timestamp: number
    }

    interface WebPlaybackTrack {
      id: string
      uri: string
      name: string
      duration_ms: number
      artists: Array<{ name: string; uri: string }>
      album: {
        name: string
        uri: string
        images: Array<{ url: string; height: number; width: number }>
      }
    }
  }
}
