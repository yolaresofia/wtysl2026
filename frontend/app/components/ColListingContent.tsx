'use client'

import Link from 'next/link'
import {useState} from 'react'

type ColListingItem = {
  _id: string
  name: string | null
  backgroundVideo: {url: string | null} | null
  slug: string | null
}

export const ColListingContent = ({items}: {items: ColListingItem[]}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(
    items[0]?.backgroundVideo?.url ?? null,
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
      <div className="relative z-10 w-full flex flex-col-reverse gap-6 text-white pb-20">
        {items.map((item) => {
          return (
            <Link href={item.slug ? `/campaigns/${item.slug}` : '#'} key={item._id}>
              <section
                className="flex w-full text-5xl"
                key={item._id}
                onMouseEnter={() => setActiveVideo(item.backgroundVideo?.url ?? null)}
                onMouseLeave={() => setActiveVideo(items[0]?.backgroundVideo?.url ?? null)}
              >
                <p>{item.name}</p>
              </section>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
