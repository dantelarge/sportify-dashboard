'use client'

import { usePlayer } from '@/hooks/use-player'
import { TrackInfo } from './track-info'
import { PlaybackControls } from './playback-controls'
import { SeekBar } from './seek-bar'
import { VolumeControl } from './volume-control'
import { usePlayerContext } from '@/contexts/player-context'

export function PlayerBar() {
  const { playerState, togglePlay, nextTrack, previousTrack, seek, setVolume, error, isReady } =
    usePlayerContext()
  const { localPosition } = usePlayer()

  const track = playerState?.track_window.current_track ?? null
  const isPlaying = !!playerState && !playerState.paused
  const duration = playerState?.duration ?? 0

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-sp-surface border-t border-sp-elevated
                    flex items-center px-4 gap-4 z-50">
      {/* Left: track info */}
      <div className="flex-1 min-w-0">
        <TrackInfo track={track} />
      </div>

      {/* Center: controls + seek */}
      <div className="flex flex-col items-center gap-1 flex-1">
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onNext={nextTrack}
          onPrevious={previousTrack}
          disabled={!isReady}
        />
        <SeekBar
          position={localPosition}
          duration={duration}
          onSeek={seek}
        />
      </div>

      {/* Right: volume + status */}
      <div className="flex-1 flex justify-end items-center gap-3">
        {error && (
          <p className="text-red-400 text-xs max-w-xs truncate" title={error}>
            {error}
          </p>
        )}
        <VolumeControl onVolumeChange={setVolume} />
      </div>
    </div>
  )
}
