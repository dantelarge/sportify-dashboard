'use client'

import { useRef, useState } from 'react'

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

interface SeekBarProps {
  position: number
  duration: number
  onSeek: (ms: number) => void
}

export function SeekBar({ position, duration, onSeek }: SeekBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragValue, setDragValue] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayPosition = isDragging ? dragValue : position
  const progress = duration > 0 ? (displayPosition / duration) * 100 : 0

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <span className="text-sp-muted text-xs w-10 text-right flex-shrink-0">
        {formatTime(displayPosition)}
      </span>

      <div className="relative flex-1 group">
        <input
          ref={inputRef}
          type="range"
          min={0}
          max={duration || 100}
          value={displayPosition}
          step={1000}
          onMouseDown={() => {
            setIsDragging(true)
            setDragValue(displayPosition)
          }}
          onChange={(e) => setDragValue(Number(e.target.value))}
          onMouseUp={(e) => {
            const value = Number((e.target as HTMLInputElement).value)
            setIsDragging(false)
            onSeek(value)
          }}
          onTouchEnd={(e) => {
            const value = Number((e.target as HTMLInputElement).value)
            setIsDragging(false)
            onSeek(value)
          }}
          className="w-full h-1 rounded-full cursor-pointer accent-sp-accent"
          style={{
            background: `linear-gradient(to right, #75AADB ${progress}%, #535353 ${progress}%)`,
          }}
          aria-label={`Seek: ${formatTime(displayPosition)}`}
        />
      </div>

      <span className="text-sp-muted text-xs w-10 flex-shrink-0">
        {formatTime(duration)}
      </span>
    </div>
  )
}
