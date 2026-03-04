'use client'

import {useEffect, useRef} from 'react'
import {useRouter} from 'next/navigation'
import gsap from 'gsap'
import type {SettingsQueryResult} from '@/sanity.types'

type Props = NonNullable<SettingsQueryResult>

export const HomeHero = ({logo, backgroundVideo, welcomeText}: Props) => {
  const router = useRouter()
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const welcomeRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('wtysl-intro-seen')) {
      router.replace('/documentaries')
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(welcomeRef.current, {autoAlpha: 0})

      gsap.timeline({delay: 0.5})
        .to(topRef.current, {
          yPercent: -100,
          duration: 1.4,
          ease: 'power2.inOut',
        })
        .to(bottomRef.current, {
          yPercent: 100,
          duration: 1.4,
          ease: 'power2.inOut',
        }, '<')
        .to(welcomeRef.current, {
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4')
    })

    return () => ctx.revert()
  }, [router])

  const logoUrl = logo?.asset?.url

  // The mask is applied to a full-viewport inner div inside each clipping wrapper.
  // Both inner divs are identical and absolutely positioned, so the mask renders
  // as if it's one single full-screen element — the clip just reveals each half.
  const innerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    top: '-50vh', // shift up inside bottom wrapper so mask aligns with full viewport
    height: '100vh',
    backgroundColor: '#FCC554',
    ...(logoUrl ? {
      maskImage: `url(${logoUrl}), linear-gradient(black, black)`,
      maskRepeat: 'no-repeat, no-repeat',
      maskPosition: 'center center, center center',
      maskSize: '300px, 100%',
      WebkitMaskComposite: 'xor' as React.CSSProperties['WebkitMaskComposite'],
      maskComposite: 'exclude' as React.CSSProperties['maskComposite'],
    } : {}),
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {backgroundVideo?.url && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundVideo.url}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Top clipping wrapper — shows top half, slides up */}
      <div
        ref={topRef}
        style={{position: 'absolute', inset: 0, bottom: '50%', overflow: 'hidden'}}
      >
        <div style={{...innerStyle, top: 0}} />
      </div>

      {/* Bottom clipping wrapper — shows bottom half, slides down */}
      <div
        ref={bottomRef}
        style={{position: 'absolute', inset: 0, top: '50%', overflow: 'hidden'}}
      >
        <div style={{...innerStyle, top: '-50vh'}} />
      </div>

      <p
        ref={welcomeRef}
        className="absolute inset-0 flex items-center justify-center text-white opacity-0 invisible"
      >
        {welcomeText}
      </p>
    </div>
  )
}
