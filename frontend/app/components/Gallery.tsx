'use client'
import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import VimeoPlayer from './VimeoPlayer'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'gallery'>
}

export default function Gallery({block: {items, backgroundColor}}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedItem = selectedIndex !== null ? (items?.[selectedIndex] ?? null) : null
  const itemCount = items?.length ?? 0

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIndex((i) => {
      if (i === null || !items) return null
      let next = (i - 1 + itemCount) % itemCount
      while (items[next].type === 'video') {
        next = (next - 1 + itemCount) % itemCount
      }
      return next
    })
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIndex((i) => {
      if (i === null || !items) return null
      let next = (i + 1) % itemCount
      while (items[next].type === 'video') {
        next = (next + 1) % itemCount
      }
      return next
    })
  }

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedItem])

  return (
    <div>
      <div className="grid grid-cols-4">
        {items?.map((item, index) => {
          if (item.type === 'photo') {
            return (
              <div key={item._key} onClick={() => setSelectedIndex(index)}>
                <Image
                  src={item.imageUrl ?? ''}
                  alt={item.photoAltText ?? ''}
                  width={400}
                  height={300}
                />
              </div>
            )
          }
          if (item.type === 'video') {
            return (
              <div key={item._key} onClick={() => setSelectedIndex(index)}>
                <Image
                  src={item.thumbnailUrl ?? ''}
                  alt={item.videoAltText ?? ''}
                  width={400}
                  height={300}
                />
              </div>
            )
          }
          return null
        })}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50" onClick={() => setSelectedIndex(null)}>
          {selectedItem.type === 'video' && selectedItem.vimeoUrl ? (
            <div className="w-screen h-screen" onClick={(e) => e.stopPropagation()}>
              <VimeoPlayer url={selectedItem.vimeoUrl} />
            </div>
          ) : (
            <div
              className="w-screen h-screen flex items-center justify-center"
              style={{backgroundColor: backgroundColor ?? undefined}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-[75vw] h-[75vh]">
                <Image
                  src={selectedItem.imageUrl ?? ''}
                  alt={selectedItem.photoAltText ?? ''}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <button
            className="absolute top-4 right-4 text-white z-50 text-[14px]"
            onClick={() => setSelectedIndex(null)}
          >
            Close [x]
          </button>
          {selectedItem.type !== 'video' && (
            <div>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50"
                onClick={handlePrev}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="20"
                  viewBox="0 0 23 20"
                  fill="none"
                >
                  <path
                    d="M11.1822 0.135661C11.391 -0.0450631 11.7295 -0.0450631 11.9383 0.135661C12.1471 0.316385 12.1471 0.609396 11.9383 0.79012L11.5602 0.462891L11.1822 0.135661ZM0.756094 9.8147L0.378045 10.1419L-3.05791e-06 9.8147L0.378045 9.48747L0.756094 9.8147ZM11.5602 0.462891L11.9383 0.79012L1.13414 10.1419L0.756094 9.8147L0.378045 9.48747L11.1822 0.135661L11.5602 0.462891ZM0.756094 9.8147L1.13414 9.48747L11.9383 18.8393L11.5602 19.1665L11.1822 19.4937L0.378045 10.1419L0.756094 9.8147Z"
                    fill="white"
                  />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50"
                onClick={handleNext}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="20"
                  viewBox="0 0 23 20"
                  fill="none"
                >
                  <path
                    d="M11.1822 19.358C10.9734 19.5387 10.6349 19.5387 10.4261 19.358C10.2173 19.1773 10.2173 18.8843 10.4261 18.7035L10.8041 19.0308L11.1822 19.358ZM21.6083 9.67895L21.9863 9.35172L22.3644 9.67895L21.9863 10.0062L21.6083 9.67895ZM10.8041 19.0308L10.4261 18.7035L21.2302 9.35172L21.6083 9.67895L21.9863 10.0062L11.1822 19.358L10.8041 19.0308ZM21.6083 9.67895L21.2302 10.0062L10.4261 0.654371L10.8041 0.327142L11.1822 -8.79661e-05L21.9863 9.35172L21.6083 9.67895Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
