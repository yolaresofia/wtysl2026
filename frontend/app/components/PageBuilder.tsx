'use client'

import {SanityDocument} from 'next-sanity'
import {useOptimistic} from 'next-sanity/hooks'

import BlockRenderer, {AnyBuilderBlock} from '@/app/components/BlockRenderer'
import {dataAttr} from '@/sanity/lib/utils'

type BuilderProps = {
  documentId: string
  documentType: string
  builderField: string
  blocks: AnyBuilderBlock[]
}

type BuilderDocument = {
  _id: string
  _type: string
  [key: string]: unknown
}

export default function PageBuilder({documentId, documentType, builderField, blocks}: BuilderProps) {
  const sections = useOptimistic<AnyBuilderBlock[], SanityDocument<BuilderDocument>>(
    blocks,
    (current, action) => {
      if (action.id !== documentId) return current
      const updated = action.document[builderField]
      if (Array.isArray(updated)) {
        return updated.map(
          (section) => current.find((s) => s._key === section?._key) || section,
        ) as AnyBuilderBlock[]
      }
      return current
    },
  )

  if (!sections || sections.length === 0) {
    return (
      <div
        className="container mt-10"
        data-sanity={dataAttr({
          id: documentId,
          type: documentType,
          path: builderField,
        }).toString()}
      >
        <p>No content yet. Open this document in Sanity Studio to add content.</p>
      </div>
    )
  }

  return (
    <div
      data-sanity={dataAttr({
        id: documentId,
        type: documentType,
        path: builderField,
      }).toString()}
    >
      {sections.map((block, index) => (
        <BlockRenderer
          key={block._key}
          index={index}
          block={block}
          documentId={documentId}
          documentType={documentType}
          builderField={builderField}
        />
      ))}
    </div>
  )
}
