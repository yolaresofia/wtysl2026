import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'projectHero'>
}

export default function ProjectHero({
  block: {backgroundColor, title, subtitle, about, infoSection, infoSectionTitle},
}: Props) {
  return (
    <div
      className="h-screen text-white px-9 flex flex-col justify-center"
      style={{backgroundColor: backgroundColor}}
    >
      <div className="flex flex-col gap-y-10">
        <h1 className="text-5xl">{title}</h1>
        <h2 className="text-xl">{subtitle}</h2>
        <p className="text-lg">{about}</p>
      </div>
      <div className="flex pt-50 w-full text-[13px]">
        <p className="w-2/12 opacity-30">{infoSectionTitle}</p>
        <div className="flex space-x-30 w-10/12">
          {infoSection?.items?.map((item) => (
            <div key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
