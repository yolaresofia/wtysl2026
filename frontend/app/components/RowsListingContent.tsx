'use client'

import { Link, useTransitionRouter } from 'next-view-transitions'
import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'
import {useEffect, useRef, useState} from 'react'

type RowsListingItem = {
  _id: string
  name: string | null
  client: string | null
  category: string | null
  backgroundVideo: {url: string | null} | null
  slug: string | null
}

type Category = {
  title: string | null
  value: string | null
}

export const RowsListingContent = ({
  items,
  categories,
  basePath,
}: {
  items: RowsListingItem[]
  categories: Category[]
  basePath: string
}) => {
  const router = useTransitionRouter()
  // Build label lookup from categories prop
  const categoryLabels: Record<string, string> = {}
  categories.forEach((c) => {
    if (c.value && c.title) categoryLabels[c.value] = c.title
  })

  // Group items by category
  const grouped = items.reduce(
    (acc, item) => {
      const key = item.category || ''
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<string, RowsListingItem[]>,
  )

  // Order groups by the categories array from settings.
  // Fall back to insertion order from items if no categories are configured yet.
  const orderedCategories = categories.length > 0
    ? categories.map((c) => c.value ?? '').filter((v) => v && grouped[v])
    : Object.keys(grouped)

  // Mobile slides ordered by category (same order as desktop groups)
  const slides = orderedCategories.flatMap((cat) => grouped[cat] ?? [])

  // First item in display order (used for initial video + category state)
  const firstItem = slides[0] ?? null

  const isExitingRef = useRef(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const activeIdRef = useRef<string | null>(firstItem?._id ?? null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mobileVideoContainerRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileActiveIndexRef = useRef<number>(0)

  const [viewAll, setViewAll] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(firstItem?.category ?? null)
  const exitColsRef = useRef<HTMLElement[]>([])

  // Desktop: init video visibility + entrance animation
  useGSAP(() => {
    if (!containerRef.current) return

    // Videos
    const videos = containerRef.current.querySelectorAll<HTMLVideoElement>('video[data-id]')
    videos.forEach((v) => {
      const isFirst = v.dataset.id === firstItem?._id
      gsap.set(v, {autoAlpha: isFirst ? 1 : 0})
      if (isFirst) v.play().catch(() => {})
    })

    // Capture cols into a stable ref so navigateWithExit can use them
    const cols = Array.from(containerRef.current.querySelectorAll<HTMLElement>('[data-exit-col]'))
    exitColsRef.current = cols

    // Set initial state hidden
    gsap.set(cols, { y: '100%', opacity: 0 })

    const gridCols = 5
    const buttons = cols.filter((el) => el.tagName === 'BUTTON')
    const labels = cols.filter((el) => el.tagName === 'P')

    // Animate category labels first, then buttons col by col — delay gives page time to settle
    gsap.to(labels, {
      y: '0%',
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.2,
    })

    for (let col = 0; col < gridCols; col++) {
      const colButtons = buttons.filter((_, i) => i % gridCols === col)
      gsap.to(colButtons, {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2 + (col + 1) * 0.08,
      })
    }
  }, {dependencies: [items]})

  // Mobile: init first video visible, rest hidden
  useEffect(() => {
    if (!mobileVideoContainerRef.current) return
    const videos = mobileVideoContainerRef.current.querySelectorAll<HTMLVideoElement>('video[data-id]')
    videos.forEach((v, i) => {
      v.style.opacity = i === 0 ? '1' : '0'
      v.style.transition = 'opacity 0.5s ease'
      if (i === 0) v.play().catch(() => {})
    })
    mobileActiveIndexRef.current = 0
  }, [items])

  // Mobile: scroll listener — switch video when snap position changes
  useEffect(() => {
    const scrollEl = mobileScrollRef.current
    if (!scrollEl) return

    const onScroll = () => {
      const slideHeight = scrollEl.clientHeight
      if (!slideHeight) return
      const index = Math.round(scrollEl.scrollTop / slideHeight)
      if (index === mobileActiveIndexRef.current) return
      mobileActiveIndexRef.current = index

      const videos = mobileVideoContainerRef.current?.querySelectorAll<HTMLVideoElement>('video[data-id]')
      if (!videos) return
      videos.forEach((v, i) => {
        if (i === index) {
          v.style.opacity = '1'
          v.play().catch(() => {})
        } else {
          v.style.opacity = '0'
        }
      })

      // Update active category label
      const slideEls = scrollEl.querySelectorAll<HTMLElement>('[data-slide-id]')
      const activeSlide = slideEls[index]
      if (activeSlide?.dataset.category) setActiveCategory(activeSlide.dataset.category)
    }

    scrollEl.addEventListener('scroll', onScroll, {passive: true})
    return () => scrollEl.removeEventListener('scroll', onScroll)
  }, [items])

  const navigateWithExit = (href: string) => {
    if (isExitingRef.current) return
    isExitingRef.current = true
    const cols = Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[data-exit-col]') ?? [])
    if (!cols.length) { router.push(href); return }
    gsap.killTweensOf(cols)
    gsap.set(cols, { y: '0%', opacity: 1 })
    gsap.to(cols, {
      y: '-100%',
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in',
      onComplete: () => { router.push(href) },
    })
  }

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
      <div ref={containerRef} className="hidden lg:flex relative z-10 w-full h-dvh flex-col-reverse justify-center items-center gap-8 text-black px-9 bg-black">
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
          {orderedCategories.map((category) => (
            <section className="flex w-full text-[13px]" key={category}>
              <p className="w-1/12 text-white opacity-0 translate-y-full" data-exit-col>{categoryLabels[category] ?? category}</p>
              <div
                className="grid grid-cols-5 gap-18 w-11/12 pl-8"
                onMouseLeave={() => {
                  if (isExitingRef.current) return
                  if (firstItem) crossfadeTo(firstItem._id)
                  setHoveredId(null)
                }}
              >
                {grouped[category].map((item) => (
                  <button
                    key={item._id}
                    className={`text-left opacity-0 translate-y-full ${hoveredId === item._id ? 'text-white' : 'text-white/60'}`}
                    data-exit-col
                    onMouseEnter={() => {
                      if (isExitingRef.current) return
                      crossfadeTo(item._id)
                      setHoveredId(item._id)
                    }}
                    onClick={() => navigateWithExit(item.slug ? `/${basePath}/${item.slug}` : '#')}
                  >
                    <p className="text-xl">{item.name}</p>
                    <p className="text-[13px]">{item.client}</p>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden relative w-full h-dvh bg-black overflow-hidden">
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
                preload="metadata"
              />
            ) : null,
          )}
        </div>

        <div className="absolute top-0 inset-x-0 z-35 flex items-center justify-between px-5 pt-28 pb-3 pointer-events-none">
          <span className="text-xs uppercase tracking-widest text-white/60">{basePath}</span>
          <button
            className="text-[14px] text-white pointer-events-auto"
            onClick={() => setViewAll((v) => !v)}
          >
            {viewAll ? 'Close [x]' : 'View All'}
          </button>
        </div>

        {!viewAll && activeCategory && (
          <div className="absolute z-35 px-5 pointer-events-none" style={{top: 'calc(7rem + 28px + 12px)'}}>
            <span className="text-[14px] text-white/50">{categoryLabels[activeCategory] ?? activeCategory}</span>
          </div>
        )}

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
              className="flex flex-col h-dvh w-full snap-start justify-center px-5"
            >
              <p className="md:text-3xl text-[22px] text-white">{item.name}</p>
              {item.client && <p className="text-[14px] text-white">{item.client}</p>}
            </Link>
          ))}
        </div>

        {/* View All overlay */}
        {viewAll && (
          <div className="absolute inset-0 z-30 bg-black overflow-y-auto px-5 pb-10" style={{paddingTop: 'calc(7rem + 28px + 14px)'}}>
            <div className="flex flex-col gap-5">
              {orderedCategories.map((category) => (
                <div key={category}>
                  <p className="text-[14px] text-white/40 mb-4">{categoryLabels[category] ?? category}</p>
                  <div className="flex flex-col">
                    {grouped[category].map((item) => (
                      <Link
                        key={item._id}
                        href={item.slug ? `/${basePath}/${item.slug}` : '#'}
                        onClick={() => setViewAll(false)}
                        className="flex justify-between items-baseline"
                      >
                        <p className="text-white text-[17px]">{item.name}</p>
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
