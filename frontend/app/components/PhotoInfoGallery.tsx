import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import Image from 'next/image'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'photoInfoGallery'>
}

export default function PhotoInfoGallery({block}: Props) {
  const {items} = block
  return (
    <div className="flex justify-between xl:flex-row flex-col px-9 py-38 text-white" style={{backgroundColor: block.backgroundColor}}>
      <p className="text-[13px] pb-12 lg:pb-0">{block.title}</p>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 max-w-7xl gap-10">
        {items?.map((item) => {
          return (
            <div key={item._key}>
              <Image src={item.image?.asset?.url ?? ''} alt={''} width={400} height={300} />
              <p className="text-lg pt-4">{item.name}</p>
              <p className="text-[13px]">{item.role}</p>
              <p className="text-[13px] pt-6">{item.location}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
