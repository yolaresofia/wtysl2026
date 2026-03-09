'use client'

import {useRef, useState} from 'react'
import {useGSAP} from '@gsap/react'
import Image from 'next/image'
import { Link, useTransitionRouter } from 'next-view-transitions'
import {PortableText} from 'next-sanity'
import {usePathname} from 'next/navigation'
import gsap from 'gsap'
import type {SettingsQueryResult, ContactColumnsQueryResult} from '@/sanity.types'
import NavLinks from './NavLinks'
import {LogoPaths} from '../constants/logo-paths'

const mobileNavLinks = [
  {href: '/documentaries', label: 'documentaries'},
  {href: '/campaigns', label: 'campaigns'},
  {href: '/animations', label: 'animations'},
  {href: '/about', label: 'about'},
  {href: '/contact', label: 'contact'},
]

type Props = NonNullable<SettingsQueryResult> & {
  contactBlock: NonNullable<ContactColumnsQueryResult>['contactBlock'] | null
  menuVideoUrl: string | null
}

export const HomeHero = ({logo, backgroundVideo, welcomeText, contactBlock, menuVideoUrl}: Props) => {
  const router = useTransitionRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
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
        className="absolute inset-0 z-40 w-full h-full overflow-visible pointer-events-none"
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

        {/* Top half rect — oversized by 2px on all edges to prevent sub-pixel gaps */}
        <g ref={topRef}>
          <rect
            x="-2" y="-2" width="calc(100% + 4px)" height="calc(50% + 4px)"
            fill="#FCC554"
            mask="url(#wtysl-logo-mask)"
          />
        </g>

        {/* Bottom half rect — oversized by 2px on all edges to prevent sub-pixel gaps */}
        <g ref={bottomRef}>
          <rect
            x="-2" y="calc(50% - 2px)" width="calc(100% + 4px)" height="calc(50% + 4px)"
            fill="#FCC554"
            mask="url(#wtysl-logo-mask)"
          />
        </g>
      </svg>

      <header
        ref={headerRef}
        className="fixed z-50 inset-x-0 top-0 lg:p-9 px-5 py-5 opacity-0 invisible"
      >
        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-3 items-start">
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
        {/* Mobile layout */}
        <div className="lg:hidden flex items-start justify-between">
          <div>
            {logoUrl && (
              <Link href="/documentaries">
                <Image src={logoUrl} alt="Logo" width={100} height={100} className="h-11 w-auto" />
              </Link>
            )}
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-[14px] text-white tracking-wide"
          >
            {menuOpen ? 'Close [x]' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col px-5 pt-40 lg:hidden overflow-y-auto">
          {menuVideoUrl && (
            <video
              src={menuVideoUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          <nav className="relative flex flex-col gap-4 mb-12">
            {mobileNavLinks.map(({href, label}) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-[22px] capitalize ${pathname.startsWith(href) ? 'text-white' : 'text-white/40'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
          {contactBlock && (
            <div className="relative flex flex-col gap-6 text-[14px] text-white/60 mt-auto pb-20">
              {contactBlock.firstColumn && (
                <PortableText value={contactBlock.firstColumn as Parameters<typeof PortableText>[0]['value']} />
              )}
              {contactBlock.secondColumn && (
                <PortableText value={contactBlock.secondColumn as Parameters<typeof PortableText>[0]['value']} />
              )}
              {contactBlock.thirdColumn && (
                <PortableText value={contactBlock.thirdColumn as Parameters<typeof PortableText>[0]['value']} />
              )}
            </div>
          )}
        </div>
      )}

      <p
        ref={welcomeRef}
        className="absolute inset-0 flex md:text-5xl text-3xl items-center justify-start text-white md:px-9 px-5 pb-36 opacity-0 invisible leading-tighter"
      >
        {welcomeText}
      </p>
    </div>
  )
}
