import React from 'react'

import {dataAttr} from '@/sanity/lib/utils'
import {ProjectBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: ProjectBuilderSection
  projectId: string
  projectType: string
}

type BlocksType = {
  [key: string]: React.FC<BlockProps>
}

const Blocks = {
} as BlocksType

/**
 * Used by the <ProjectBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({block, index, projectId, projectType}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: projectId,
          type: projectType,
          path: `projectBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
          projectId: projectId,
          projectType: projectType,
        })}
      </div>
    )
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
