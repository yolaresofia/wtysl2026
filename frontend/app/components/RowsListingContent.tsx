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

  useEffect(() => {
    if (!containerRef.current) return
    const videos = containerRef.current.querySelectorAll<HTMLVideoElement>('video[data-id]')
    videos.forEach((v) => {
      const isFirst = v.dataset.id === items[0]?._id
      gsap.set(v, {autoAlpha: isFirst ? 1 : 0})
      if (isFirst) v.play().catch(() => {})
    })
  }, [items])

  const crossfadeTo = (id: string) => {
    if (!containerRef.current) return
    if (activeIdRef.current === id) return

    const prev = containerRef.current.querySelector<HTMLVideoElement>(
      `video[data-id="${activeIdRef.current}"]`,
    )
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

  return (
    <div ref={containerRef} className="relative z-10 w-full h-screen flex flex-col-reverse justify-center items-center gap-8 text-black px-9 bg-black">
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
  )
}
