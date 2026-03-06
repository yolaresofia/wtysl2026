'use client'
import {useEffect, useRef, useState} from 'react'
import Player from '@vimeo/player'

type Props = {
  url: string
  title?: string
  autoplay?: boolean
}

export default function VimeoPlayer({url, title, autoplay}: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shareState, setShareState] = useState<'share' | 'copied'>('share')
  const isPlayingRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setShareState('copied')
    setTimeout(() => setShareState('share'), 2000)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${m}:${secs.toString().padStart(2, '0')}`
  }
  const togglePlay = () => {
    if (!playerRef.current) return
    if (isPlayingRef.current) {
      playerRef.current.pause()
    } else {
      playerRef.current.play()
    }
  }

  const toggleMute = () => {
    if (!playerRef.current) return
    playerRef.current.setMuted(!isMuted)
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    if (!wrapperRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      wrapperRef.current.requestFullscreen()
    }
  }

  useEffect(() => {
    if (!containerRef.current) return
    // If there's already an iframe (strict mode re-mount), remove it first
    const existing = containerRef.current.querySelector('iframe')
    if (existing) existing.remove()
    const player = new Player(containerRef.current, {
      id: url,
      controls: false,
      title: false,
      byline: false,
      portrait: false,
      autoplay: autoplay ?? false,
    })
    playerRef.current = player
    let destroyed = false
    player.on('play', () => { isPlayingRef.current = true; setIsPlaying(true) })
    player.on('pause', () => { isPlayingRef.current = false; setIsPlaying(false) })
    player.on('timeupdate', (data) => setCurrentTime(data.seconds))
    player.getDuration().then((d) => {
      if (!destroyed) setDuration(d)
    }).catch(() => {})
    return () => {
      destroyed = true
      player.off('play')
      player.off('pause')
      player.off('timeupdate')
      player.destroy().catch(() => {})
      playerRef.current = null
    }
  }, [url, autoplay])

  return (
    <div ref={wrapperRef} className="relative w-screen h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="vimeo-container w-full h-full" />
      <div className="absolute inset-0 md:hidden" onClick={togglePlay} />
      {/* Desktop controls */}
      <div className="absolute bottom-0 left-0 right-0 hidden md:flex items-center gap-4 px-6 py-4 text-white text-sm">
        {title && <span className="mr-auto font-semibold">{title}</span>}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="grid h-10 w-10 place-items-center"
        >
          {isPlaying ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <span className="tabular-nums shrink-0">{formatTime(currentTime)}</span>
        <div
          className="relative h-0.5 w-32 cursor-pointer bg-white/30 lg:w-[50vw]"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const ratio = (e.clientX - rect.left) / rect.width
            playerRef.current?.setCurrentTime(ratio * duration)
            setCurrentTime(ratio * duration)
          }}
        >
          <div
            className="absolute inset-y-0 left-0 h-full bg-white/80"
            style={{width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`}}
          />
        </div>
        <span className="tabular-nums shrink-0">-{formatTime(duration - currentTime)}</span>

        <button
          className="text-sm text-white/80 hover:text-white shrink-0"
          onClick={toggleMute}
        >
          {isMuted ? 'Sound OFF' : 'Sound ON'}
        </button>
        <button
          onClick={handleShare}
          className="text-sm text-white/80 hover:text-white"
        >
          {shareState === 'share' ? 'Share' : 'Copied!'}
        </button>
        <button
          className="text-sm text-white/80 hover:text-white shrink-0"
          onClick={handleFullscreen}
        >
          Fullscreen
        </button>
      </div>

      {/* Mobile controls */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col md:hidden px-5 pb-8 text-white text-sm gap-3">
        {/* Row 1: title — sound — close */}
        <div className="flex items-center justify-between gap-4">
          {title && <span className="text-[13px] font-semibold truncate">{title}</span>}
          <div className="flex items-center gap-4 ml-auto shrink-0">
            <button className="text-[13px] text-white/80" onClick={toggleMute}>
              {isMuted ? 'Sound OFF' : 'Sound ON'}
            </button>
            <button className="text-[13px] text-white/80" onClick={() => window.history.back()}>
              Close
            </button>
          </div>
        </div>

        {/* Row 2: full-width progress bar */}
        <div
          className="relative h-0.5 w-full cursor-pointer bg-white/30"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const ratio = (e.clientX - rect.left) / rect.width
            playerRef.current?.setCurrentTime(ratio * duration)
            setCurrentTime(ratio * duration)
          }}
        >
          <div
            className="absolute inset-y-0 left-0 h-full bg-white/80"
            style={{width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`}}
          />
        </div>

        {/* Row 3: fullscreen right */}
        <div className="flex justify-end">
          <button className="text-[13px] text-white/80" onClick={handleFullscreen}>
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  )
}
