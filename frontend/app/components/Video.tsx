import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'video'>
}

export default function Video({block: {url}}: Props) {
  return (
    <div>
      <iframe
        className="w-screen h-screen"
        src={url ?? ''}
        allow="autoplay; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  )
}
