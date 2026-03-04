import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import { PortableText } from 'next-sanity'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'textWithBackgroundColor'>
}

export default function TextWithBackgroundColor({block}: Props) {
  return (
    <div className="md:h-screen h-[180vh] flex justify-center items-center px-9 text-white text-lg leading-normal" style={{backgroundColor: block.backgroundColor}}>
      <PortableText value={block.about || []} />
    </div>
  )
}
