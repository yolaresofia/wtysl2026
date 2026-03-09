'use client'

import {useRef} from 'react'
import {useGSAP} from '@gsap/react'
import Image from 'next/image'
import { Link, useTransitionRouter } from 'next-view-transitions'
import gsap from 'gsap'
import type {SettingsQueryResult} from '@/sanity.types'
import NavLinks from './NavLinks'
import {LogoPaths} from '../constants/logo-paths'

type Props = NonNullable<SettingsQueryResult>

export const HomeHero = ({logo, backgroundVideo, welcomeText}: Props) => {
  const router = useTransitionRouter()
  const topRef = useRef<SVGGElement>(null)
  const bottomRef = useRef<SVGGElement>(null)
  const logoMaskRef = useRef<SVGGElement>(null)
  const welcomeRef = useRef<HTMLParagraphElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.set(logoMaskRef.current, {autoAlpha: 0})
    gsap.set(welcomeRef.current, {autoAlpha: 0})
    gsap.set(headerRef.current, {autoAlpha: 0})

    gsap.timeline({delay: 0.5})
      .to(logoMaskRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '+=0.5')
      .to(topRef.current, {
        yPercent: -100,
        duration: 1.4,
        ease: 'power2.in',
      }, '+=0.4')
      .to(bottomRef.current, {
        yPercent: 100,
        duration: 1.4,
        ease: 'power2.in',
      }, '<')
      .to(welcomeRef.current, {
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '+=0.5')
      .to(headerRef.current, {
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '<')
      .call(() => {
        setTimeout(() => router.push('/documentaries'), 4000)
      })
  }, [router])

  const logoUrl = logo?.asset?.url

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
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* maskUnits="userSpaceOnUse" so coordinates match the viewport */}
          <mask id="wtysl-logo-mask" maskUnits="userSpaceOnUse">
            {/* White = show the colored rect */}
            <rect width="100%" height="100%" fill="white" />
            {/* Logo paths in black = punch holes. Centered via translate. */}
            {/* Logo is 296×313; center offset = 50%vw-148, 50%vh-156.5 */}
            <g ref={logoMaskRef} style={{transform: 'translate(calc(50vw - 148px), calc(50vh - 156.5px))', opacity: 0}}>
              <LogoPaths />
            </g>
          </mask>
        </defs>

        {/* Top half rect — clips to top 50%, slides up via ref on <g> */}
        <g ref={topRef}>
          <rect
            x="0" y="0" width="100%" height="50%"
            fill="#FCC554"
            mask="url(#wtysl-logo-mask)"
          />
        </g>

        {/* Bottom half rect — clips to bottom 50%, slides down via ref on <g> */}
        <g ref={bottomRef}>
          <rect
            x="0" y="50%" width="100%" height="50%"
            fill="#FCC554"
            mask="url(#wtysl-logo-mask)"
          />
        </g>
      </svg>

      <header
        ref={headerRef}
        className="fixed z-50 inset-x-0 top-0 p-9 lg:block hidden opacity-0 invisible"
      >
        <div className="grid grid-cols-3 items-start">
          <div>
            {logoUrl && (
              <Link href="/documentaries">
                <Image src={logoUrl} alt="Logo" width={100} height={100} className="h-12 w-auto" />
              </Link>
            )}
          </div>
          <div className="flex justify-center">
            <NavLinks />
          </div>
          <div />
        </div>
      </header>

      <p
        ref={welcomeRef}
        className="absolute inset-0 flex md:text-5xl text-3xl items-center justify-start text-white px-9 pb-36 opacity-0 invisible leading-tighter"
      >
        {welcomeText}
      </p>
    </div>
  )
}
