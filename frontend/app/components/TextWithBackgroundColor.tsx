import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import { PortableText } from 'next-sanity'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'textWithBackgroundColor'>
}

export default function TextWithBackgroundColor({block}: Props) {
  return (
    <div className="md:h-screen py-32 flex justify-center items-center md:px-9 px-5 text-white text-[17px] leading-normal" style={{backgroundColor: block.backgroundColor}}>
      <PortableText value={block.about || []} />
    </div>
  )
}
