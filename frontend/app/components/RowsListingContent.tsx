'use client'

import Link from 'next/link'
import {useState} from 'react'

type RowsListingItem = {
  _id: string
  name: string | null
  client: string | null
  category: string | null
  backgroundVideo: {url: string | null} | null
  slug: string | null
}

export const RowsListingContent = ({items, basePath}: {items: RowsListingItem[], basePath: string}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(
    items[0]?.backgroundVideo?.url ?? null,
  )
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
    <div className="relative z-10 w-full h-screen flex flex-col-reverse justify-center items-center gap-8 text-black px-4">
      {activeVideo && (
        <video
          key={activeVideo}
          className="absolute inset-0 w-full h-full object-cover"
          src={activeVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      <div className="relative z-10 w-full flex flex-col-reverse gap-8 text-white">
        {Object.entries(grouped).map(([category, items]) => (
          <section className="flex w-full text-[13px]" key={category}>
            <p className="w-2/12 opacity-80">{categoryLabels[category] ?? category}</p>
            <div className="grid grid-cols-5 gap-8 w-10/12">
              {items.map((item) => (
                <Link href={item.slug ? `/${basePath}/${item.slug}` : '#'} key={item._id}>
                <div
                  key={item._id}
                  onMouseEnter={() => setActiveVideo(item.backgroundVideo?.url ?? null)}
                  onMouseLeave={() => setActiveVideo(items[0]?.backgroundVideo?.url ?? null)}
                >
                  <p className="text-xl">{item.name}</p>
                  <p className="text-[13px]">{item.client}</p>
                </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
