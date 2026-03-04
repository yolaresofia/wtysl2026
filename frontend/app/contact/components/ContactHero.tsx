'use client'

import {useEffect, useRef} from 'react'
import gsap from 'gsap'
import type {ContactModuleQueryResult} from '@/sanity.types'
import {PortableText} from 'next-sanity'

type ContactHeroProps = NonNullable<ContactModuleQueryResult>

export const ContactHero = ({
  centerText,
  hoverCenterText,
  firstColumn,
  secondColumn,
  thirdColumn,
  backgroundColor,
  backgroundVideo,
}: ContactHeroProps) => {
  const centerRef = useRef<HTMLSpanElement>(null)
  const hoverCenterRef = useRef<HTMLSpanElement>(null)
  const parentTargetRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const ctx = gsap.context(() => {
      gsap.set(hoverCenterRef.current, {yPercent: 100, autoAlpha: 0})
      const el = parentTargetRef.current
      if (!el) return
      el.addEventListener('mouseenter', () => {
        gsap.to(centerRef.current, {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(hoverCenterRef.current, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      })
      el.addEventListener('mouseleave', () => {
        gsap.to(centerRef.current, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(hoverCenterRef.current, {
          yPercent: 100,
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      className="w-full h-screen flex flex-col text-white relative overflow-hidden"
      style={{backgroundColor: backgroundVideo?.url ? undefined : (backgroundColor ?? undefined)}}
    >
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
      <h1 className="flex-1 flex md:justify-center items-center md:text-6xl text-[28px] justify-start md:text-center relative z-10">
        <a href="mailto:info@whattookyousolong.org">
          <span
            ref={parentTargetRef}
            className="hover-device:overflow-hidden hover-device:inline-grid py-12 px-2 flex flex-col"
          >
            <span ref={centerRef} className="hover-device:col-start-1 hover-device:row-start-1">
              {centerText}
            </span>
            <span
              ref={hoverCenterRef}
              className="hover-device:col-start-1 hover-device:row-start-1 hover-device:opacity-0 hover-device:invisible"
            >
              {hoverCenterText}
            </span>
          </span>
        </a>
      </h1>

      <div className="flex justify-between flex-col md:flex-row md:space-x-30 self-end p-4 text-[13px] w-screen relative z-10 space-y-6 md:space-y-0">
        <div className="md:w-1/3 text-left">
          <PortableText value={firstColumn || []} />
        </div>

        <div className="md:w-1/3">
          <PortableText value={secondColumn || []} />
        </div>
        <div className="md:w-1/3 md:text-right">
          <PortableText value={thirdColumn || []} />
        </div>
      </div>
    </div>
  )
}
