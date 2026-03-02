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
  backgroundColor
}: ContactHeroProps) => {
  const centerRef = useRef<HTMLSpanElement>(null)
  const hoverCenterRef = useRef<HTMLSpanElement>(null)
  const parentTargetRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
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
    <div className="w-full h-screen flex flex-col text-white" style={{backgroundColor: backgroundColor}}>
      <h1 className="flex-1 flex justify-center items-center text-6xl text-center">
        <a href="mailto:info@whattookyousolong.org">
          <span ref={parentTargetRef} className="overflow-hidden inline-grid py-12 px-2">
            <span ref={centerRef} className="col-start-1 row-start-1">
              {centerText}
            </span>
            <span ref={hoverCenterRef} className="col-start-1 row-start-1 opacity-0 invisible">
              {hoverCenterText}
            </span>
          </span>
        </a>
      </h1>

      <div className="flex justify-between space-x-30 self-end p-4 text-[13px] w-screen">
        <div className="w-1/3 text-left">
          <PortableText value={firstColumn || []} />
        </div>

        <div className="w-1/3">
          <PortableText value={secondColumn || []} />
        </div>
        <div className="w-1/3 text-right">
          <PortableText value={thirdColumn || []} />
        </div>
      </div>
    </div>
  )
}
