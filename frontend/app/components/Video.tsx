'use client'

import {useState} from 'react'
import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import VimeoPlayer from './VimeoPlayer'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'video'>
}

export default function Video({block: {url, title, backgroundVideo}}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative w-screen h-dvh bg-black overflow-hidden">
      {/* Listing card background video */}
      {backgroundVideo?.url && (
        <video
          src={backgroundVideo.url}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Watch video button — centered, hidden once open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute inset-0 flex items-center justify-center text-white text-sm tracking-wide"
        >
          Watch video
        </button>
      )}

      {/* VimeoPlayer — mounted on click, autoplays immediately */}
      {open && (
        <div className="fixed inset-0 z-55">
          <div className="fixed inset-x-0 top-0 z-60 flex justify-end px-5 py-5 md:px-9 md:py-9 pointer-events-none">
            <button
              className="pointer-events-auto text-[14px] text-white tracking-wide"
              onClick={() => setOpen(false)}
            >
              Close [x]
            </button>
          </div>
          <VimeoPlayer url={url ?? ''} title={title ?? undefined} autoplay onEnded={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
