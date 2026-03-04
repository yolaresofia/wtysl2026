import {ExtractBlock} from '@/sanity/lib/types'
import {AnyBuilderBlock} from './BlockRenderer'
import VimeoPlayer from './VimeoPlayer'

type Props = {
  block: ExtractBlock<AnyBuilderBlock, 'video'>
}

export default function Video({block: {url, title}}: Props) {
  return (
    <div>
      <VimeoPlayer url={url ?? ''} title={title ?? undefined} />
    </div>
  )
}
