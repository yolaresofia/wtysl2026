'use client'

import { Link } from 'next-view-transitions'
import {gsap} from 'gsap'
import {useEffect, useRef, useState} from 'react'

type ColListingItem = {
  _id: string
  name: string | null
  backgroundVideo: {url: string | null} | null
  slug: string | null
}

export const ColListingContent = ({items}: {items: ColListingItem[]}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const activeIdRef = useRef<string | null>(items[0]?._id ?? null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mobileVideoContainerRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileActiveIdRef = useRef<string | null>(items[0]?._id ?? null)

  // Desktop: init videos
  useEffect(() => {
    if (!containerRef.current) return
    const videos = containerRef.current.querySelectorAll<HTMLVideoElement>('video[data-id]')
    videos.forEach((v) => {
      const isFirst = v.dataset.id === items[0]?._id
      gsap.set(v, {autoAlpha: isFirst ? 1 : 0})
      if (isFirst) v.play().catch(() => {})
    })
  }, [items])

  const mobileCrossfadeTo = (id: string) => {
    if (!mobileVideoContainerRef.current) return
    if (mobileActiveIdRef.current === id) return
    const next = mobileVideoContainerRef.current.querySelector<HTMLVideoElement>(`video[data-id="${id}"]`)
    if (!next) return
    next.play().catch(() => {})
    gsap.killTweensOf(next)
    gsap.fromTo(next, {autoAlpha: 0}, {autoAlpha: 1, duration: 0.6, ease: 'power2.inOut'})
    mobileActiveIdRef.current = id
  }

  // Mobile: init videos + IntersectionObserver for snap detection
  useEffect(() => {
    if (!mobileVideoContainerRef.current || !mobileScrollRef.current) return

    const videos = mobileVideoContainerRef.current.querySelectorAll<HTMLVideoElement>('video[data-id]')
    videos.forEach((v) => {
      const isFirst = v.dataset.id === items[0]?._id
      gsap.set(v, {autoAlpha: isFirst ? 1 : 0})
      if (isFirst) v.play().catch(() => {})
    })

    const slides = mobileScrollRef.current.querySelectorAll<HTMLElement>('[data-slide-id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mobileCrossfadeTo((entry.target as HTMLElement).dataset.slideId!)
          }
        })
      },
      {root: mobileScrollRef.current, threshold: 0.5},
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [items])

  const crossfadeTo = (id: string) => {
    if (!containerRef.current) return
    if (activeIdRef.current === id) return
    const prev = containerRef.current.querySelector<HTMLVideoElement>(`video[data-id="${activeIdRef.current}"]`)
    const next = containerRef.current.querySelector<HTMLVideoElement>(`video[data-id="${id}"]`)
    if (!next) return
    next.play().catch(() => {})
    if (prev) {
      gsap.killTweensOf(prev)
      gsap.to(prev, {autoAlpha: 0, duration: 0.4, ease: 'power2.inOut'})
    }
    gsap.killTweensOf(next)
    gsap.to(next, {autoAlpha: 1, duration: 0.4, ease: 'power2.inOut'})
    activeIdRef.current = id
  }

  return (
    <>
      {/* Desktop */}
      <div ref={containerRef} className="hidden lg:flex relative z-10 w-full h-screen flex-col-reverse justify-center items-center gap-8 text-black px-9">
        {items.map((item) =>
          item.backgroundVideo?.url ? (
            <video
              key={item._id}
              data-id={item._id}
              src={item.backgroundVideo.url}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="none"
            />
          ) : null,
        )}

        <div className="relative z-10 w-full flex flex-col-reverse gap-6 text-white pb-20">
          {items.map((item) => (
            <Link href={item.slug ? `/campaigns/${item.slug}` : '#'} key={item._id}>
              <section
                className={`flex w-full md:text-5xl text-3xl ${hoveredId === item._id ? 'text-white' : 'text-white/60'}`}
                onMouseEnter={() => {
                  crossfadeTo(item._id)
                  setHoveredId(item._id)
                }}
                onMouseLeave={() => {
                  const firstId = items[0]?._id
                  if (firstId) crossfadeTo(firstId)
                  setHoveredId(null)
                }}
              >
                <p>{item.name}</p>
              </section>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: shared fixed video + scroll-snap text slides */}
      <div className="lg:hidden relative w-full h-screen bg-black overflow-hidden">
        {/* Video layer */}
        <div ref={mobileVideoContainerRef} className="absolute inset-0">
          {items.map((item) =>
            item.backgroundVideo?.url ? (
              <video
                key={item._id}
                data-id={item._id}
                src={item.backgroundVideo.url}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
              />
            ) : null,
          )}
        </div>

        {/* Scroll-snap slides (text only, transparent) */}
        <div
          ref={mobileScrollRef}
          className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory"
        >
          {items.map((item) => (
            <Link
              key={item._id}
              href={item.slug ? `/campaigns/${item.slug}` : '#'}
              data-slide-id={item._id}
              className="flex h-screen w-full snap-start items-center"
            >
              <p className="text-3xl text-white px-6">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
