interface PlaybackControlsProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onNext: () => void
  onPrevious: () => void
  disabled?: boolean
}

export function PlaybackControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  disabled = false,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPrevious}
        disabled={disabled}
        aria-label="Previous track"
        className="text-sp-muted hover:text-white transition-colors disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
        </svg>
      </button>

      <button
        onClick={onTogglePlay}
        disabled={disabled}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="w-9 h-9 bg-white rounded-full flex items-center justify-center
                   hover:scale-105 transition-transform disabled:opacity-40"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-sp-bg">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-sp-bg translate-x-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        onClick={onNext}
        disabled={disabled}
        aria-label="Next track"
        className="text-sp-muted hover:text-white transition-colors disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  )
}
