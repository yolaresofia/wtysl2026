import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import Image from 'next/image'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'gallery'>
}

export default function Gallery({block: {items}}: Props) {
  return (
  <div className="grid grid-cols-4">
      {items?.map((item) => {
        if (item.type === 'photo') {
          return (
            <div key={item._key}>
              <Image src={item.imageUrl ?? ''} alt={item.photoAltText ?? ''} width={400} height={300} />
            </div>
          )
        }
        if (item.type === 'video') {
          return (
            <div key={item._key}>
              <Image src={item.thumbnailUrl ?? ''} alt={item.videoAltText ?? ''} width={400} height={300} />
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

