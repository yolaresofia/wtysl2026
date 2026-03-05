import React from 'react'
import {dataAttr} from '@/sanity/lib/utils'
import type {
  DocumentaryBuilderBlock,
  AnimationBuilderBlock,
  CampaignBuilderBlock,
  AboutBuilderBlock,
  ContactBuilderBlock,
} from '@/sanity/lib/types'
import Gallery from './Gallery'
import PhotoInfoGallery from './PhotoInfoGallery'
import ProjectHero from './ProjectHero'
import TextWithBackgroundColor from './TextWithBackgroundColor'
import Video from './Video'
import {ContactHero} from './ContactHero'

export type AnyBuilderBlock =
| DocumentaryBuilderBlock
| AnimationBuilderBlock
| CampaignBuilderBlock
| AboutBuilderBlock
| ContactBuilderBlock

type BlockProps = {
  index: number
  block: AnyBuilderBlock
  documentId: string
  documentType: string
  builderField: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Blocks: Record<string, React.FC<any>> = {
  gallery: Gallery,
  photoInfoGallery: PhotoInfoGallery,
  projectHero: ProjectHero,
  textWithBackgroundColor: TextWithBackgroundColor,
  video: Video,
  contactBlock: ContactHero,
}

export default function BlockRenderer({block, index, documentId, documentType, builderField}: BlockProps) {
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: documentId,
          type: documentType,
          path: `${builderField}[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block as never,
          index,
          documentId,
          documentType,
          builderField,
        })}
      </div>
    )
  }
  return React.createElement(
    () => (
      <div className="w-full text-center text-gray-500 p-20">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been built yet
      </div>
    ),
    {key: block._key},
  )
}
