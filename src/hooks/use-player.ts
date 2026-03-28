'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayerContext } from '@/contexts/player-context'

export function usePlayer() {
  const ctx = usePlayerContext()
  const [localPosition, setLocalPosition] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)

  const playerState = ctx.playerState
  const currentTrackUri = playerState?.track_window.current_track.uri

  // Reset position when track changes
  useEffect(() => {
    setLocalPosition(playerState?.position ?? 0)
  }, [currentTrackUri, playerState?.position])

  // rAF loop to advance seek bar while playing
  useEffect(() => {
    if (!playerState || playerState.paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimestampRef.current = null
      return
    }

    function tick(timestamp: number) {
      if (lastTimestampRef.current !== null) {
        const delta = timestamp - lastTimestampRef.current
        setLocalPosition((prev) => {
          const next = prev + delta
          const duration = playerState?.duration ?? 0
          return duration > 0 ? Math.min(next, duration) : next
        })
      }
      lastTimestampRef.current = timestamp
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimestampRef.current = null
    }
  }, [playerState?.paused, currentTrackUri, playerState])

  return { ...ctx, localPosition }
}
