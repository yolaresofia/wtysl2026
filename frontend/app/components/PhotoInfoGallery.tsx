import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'photoInfoGallery'>
}

export default function PhotoInfoGallery({block}: Props) {
  const {items} = block
  return (
    <div className="flex justify-between xl:flex-row flex-col px-5 md:px-9 py-38 text-white" style={{backgroundColor: block.backgroundColor}}>
      <p className="text-[13px] pb-12 lg:pb-0">{block.title}</p>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 flex-1 gap-10 px-9">
        {items?.map((item) => {
          return (
            <div key={item._key}>
              <div
                className="w-full aspect-4/3 bg-cover bg-center"
                style={{backgroundImage: `url(${item.image?.asset?.url ?? ''})`}}
              />
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
