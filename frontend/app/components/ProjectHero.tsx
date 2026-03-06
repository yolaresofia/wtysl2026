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
      className="min-h-screen text-white px-5 md:px-9 flex flex-col justify-center py-20"
      style={{backgroundColor: backgroundColor}}
    >
      <div className="flex flex-col gap-y-10">
        <h1 className="md:text-5xl text-3xl">{title}</h1>
        <h2 className="md:text-xl text-[17px]">{subtitle}</h2>
        <p className="md:text-lg text-[15px]">{about}</p>
      </div>
      <div className="flex flex-col md:flex-row pt-16 md:pt-50 w-full text-[13px] gap-y-6 md:gap-y-0">
        <p className="md:w-1/12 opacity-30">{infoSectionTitle}</p>
        <div className="flex flex-wrap gap-x-30 gap-y-6 md:w-11/12 md:pl-8">
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
