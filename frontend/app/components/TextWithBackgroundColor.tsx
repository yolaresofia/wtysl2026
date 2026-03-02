import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import { PortableText } from 'next-sanity'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'textWithBackgroundColor'>
}

export default function TextWithBackgroundColor({block}: Props) {
  return (
    <div className="h-screen flex justify-center items-center px-4 text-white text-lg" style={{backgroundColor: block.backgroundColor}}>
      <PortableText value={block.about || []} />
    </div>
  )
}
