import React from 'react'
import {dataAttr} from '@/sanity/lib/utils'
import type {
  DocumentaryBuilderBlock,
  AnimationBuilderBlock,
  CampaignBuilderBlock,
  AboutBuilderBlock,
} from '@/sanity/lib/types'
import Gallery from './Gallery'
import PhotoInfoGallery from './PhotoInfoGallery'
import ProjectHero from './ProjectHero'
import TextWithBackgroundColor from './TextWithBackgroundColor'
import Video from './Video'

export type AnyBuilderBlock =
  | DocumentaryBuilderBlock
  | AnimationBuilderBlock
  | CampaignBuilderBlock
  | AboutBuilderBlock

type BlockProps = {
  index: number
  block: AnyBuilderBlock
  documentId: string
  documentType: string
  builderField: string
}

type BlocksType = {
  [key: string]: React.FC<BlockProps>
}

const Blocks: BlocksType = {
  gallery: Gallery,
  photoInfoGallery: PhotoInfoGallery,
  projectHero: ProjectHero,
  textWithBackgroundColor: TextWithBackgroundColor,
  video: Video
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
          block,
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
