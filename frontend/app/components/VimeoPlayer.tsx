'use client'
import {useEffect, useRef, useState} from 'react'
import Player from '@vimeo/player'

type Props = {
  url: string
  title?: string
}

export default function VimeoPlayer({url, title}: Props) {
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
    const player = new Player(containerRef.current, {
      id: url,
      controls: false,
      title: false,
      byline: false,
      portrait: false,
    })
    playerRef.current = player
    let destroyed = false
    player.on('play', () => { isPlayingRef.current = true; setIsPlaying(true) })
    player.on('pause', () => { isPlayingRef.current = false; setIsPlaying(false) })
    player.on('timeupdate', (data) => setCurrentTime(data.seconds))
    player.getDuration().then((d) => {
      if (!destroyed) setDuration(d)
    })
    return () => {
      destroyed = true
      player.destroy()
      playerRef.current = null
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-screen h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="vimeo-container w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 px-6 py-4 text-white text-sm">
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
          className="relative h-0.5 w-32 cursor-pointer bg-white/30 sm:w-56 md:w-80 lg:w-[50vw]"
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
          className="text-sm text-white/80-offset-4 decoration-white/60 hover:text-white/80 shrink-0"
          onClick={toggleMute}
        >
          {isMuted ? 'Sound OFF' : 'Sound ON'}
        </button>
        <button
          onClick={handleShare}
          className="text-sm text-white/80-offset-4 decoration-white/60 hover:text-white/80"
        >
          {shareState === 'share' ? 'Share' : 'Copied!'}
        </button>
        <button
          className="text-sm text-white/80-offset-4 decoration-white/60 hover:text-white/80 shrink-0"
          onClick={handleFullscreen}
        >
          Fullscreen
        </button>
      </div>
    </div>
  )
}
