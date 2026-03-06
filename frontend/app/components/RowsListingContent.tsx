'use client'

import { Link } from 'next-view-transitions'
import {gsap} from 'gsap'
import {useEffect, useRef, useState} from 'react'

type RowsListingItem = {
  _id: string
  name: string | null
  client: string | null
  category: string | null
  backgroundVideo: {url: string | null} | null
  slug: string | null
}

export const RowsListingContent = ({
  items,
  basePath,
}: {
  items: RowsListingItem[]
  basePath: string
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const activeIdRef = useRef<string | null>(items[0]?._id ?? null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mobileVideoContainerRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileActiveIdRef = useRef<string | null>(items[0]?._id ?? null)

  const [viewAll, setViewAll] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(items[0]?.category ?? null)

  const categoryLabels: Record<string, string> = {
    'most-viewed': 'Most Viewed',
    'most-recent': 'Most Recent',
    'award-winning': 'Award Winning',
  }

  const grouped = items.reduce(
    (acc, item) => {
      const key = item.category || ''
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<string, RowsListingItem[]>,
  )

  // Ordered list of slides: first slide is the header, then items
  // Each item knows its category
  const slides = items

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

  // Mobile: init videos + IntersectionObserver for snap + category detection
  useEffect(() => {
    if (!mobileVideoContainerRef.current || !mobileScrollRef.current) return

    const videos = mobileVideoContainerRef.current.querySelectorAll<HTMLVideoElement>('video[data-id]')
    videos.forEach((v) => {
      const isFirst = v.dataset.id === items[0]?._id
      gsap.set(v, {autoAlpha: isFirst ? 1 : 0})
      if (isFirst) v.play().catch(() => {})
    })

    const slideEls = mobileScrollRef.current.querySelectorAll<HTMLElement>('[data-slide-id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            mobileCrossfadeTo(el.dataset.slideId!)
            if (el.dataset.category) setActiveCategory(el.dataset.category)
          }
        })
      },
      {root: mobileScrollRef.current, threshold: 0.5},
    )
    slideEls.forEach((slide) => observer.observe(slide))
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
      <div ref={containerRef} className="hidden lg:flex relative z-10 w-full h-screen flex-col-reverse justify-center items-center gap-8 text-black px-9 bg-black">
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
        <div className="relative z-10 w-full flex flex-col-reverse gap-20">
          {Object.entries(grouped).map(([category, groupItems]) => (
            <section className="flex w-full text-[13px]" key={category}>
              <p className="w-1/12 text-white opacity-80">{categoryLabels[category] ?? category}</p>
              <div
                className="grid grid-cols-5 gap-18 w-11/12 pl-8"
                onMouseLeave={() => {
                  const firstId = items[0]?._id
                  if (firstId) crossfadeTo(firstId)
                  setHoveredId(null)
                }}
              >
                {groupItems.map((item) => (
                  <Link
                    href={item.slug ? `/${basePath}/${item.slug}` : '#'}
                    key={item._id}
                    className={hoveredId === item._id ? 'text-white' : 'text-white/60'}
                    onMouseEnter={() => {
                      crossfadeTo(item._id)
                      setHoveredId(item._id)
                    }}
                  >
                    <p className="text-xl">{item.name}</p>
                    <p className="text-[13px]">{item.client}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Mobile */}
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
                preload="none"
              />
            ) : null,
          )}
        </div>

        {/* Fixed header bar */}
        <div className="absolute top-0 inset-x-0 z-35 flex items-center justify-between px-5 pt-28 pb-3 pointer-events-none">
          <span className="text-[11px] uppercase tracking-widest text-white/60">Documentaries</span>
          <button
            className="text-[11px] text-white pointer-events-auto"
            onClick={() => setViewAll((v) => !v)}
          >
            {viewAll ? 'Close' : 'View All'}
          </button>
        </div>

        {/* Fixed category label */}
        {!viewAll && activeCategory && (
          <div className="absolute z-35 px-5 pointer-events-none" style={{top: 'calc(7rem + 28px + 12px)'}}>
            <span className="text-[11px] text-white/50">{categoryLabels[activeCategory] ?? activeCategory}</span>
          </div>
        )}

        {/* Scroll-snap slides */}
        <div
          ref={mobileScrollRef}
          className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory"
        >
          {slides.map((item) => (
            <Link
              key={item._id}
              href={item.slug ? `/${basePath}/${item.slug}` : '#'}
              data-slide-id={item._id}
              data-category={item.category ?? ''}
              className="flex flex-col h-screen w-full snap-start justify-center px-5"
            >
              <p className="text-3xl text-white">{item.name}</p>
              {item.client && <p className="text-[13px] text-white/60">{item.client}</p>}
            </Link>
          ))}
        </div>

        {/* View All overlay */}
        {viewAll && (
          <div className="absolute inset-0 z-30 bg-black overflow-y-auto px-5 pb-10" style={{paddingTop: 'calc(7rem + 28px + 14px)'}}>
            <div className="flex flex-col gap-5">
              {Object.entries(grouped).map(([category, groupItems]) => (
                <div key={category}>
                  <p className="text-[11px] text-white/40 mb-4">{categoryLabels[category] ?? category}</p>
                  <div className="flex flex-col">
                    {groupItems.map((item) => (
                      <Link
                        key={item._id}
                        href={item.slug ? `/${basePath}/${item.slug}` : '#'}
                        onClick={() => setViewAll(false)}
                        className="flex justify-between items-baseline"
                      >
                        <p className="text-white text-[15px]">{item.name}</p>
                        <p className="text-white/40 text-[11px]">{item.client}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
