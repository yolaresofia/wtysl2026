import {dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {createDataAttribute, CreateDataAttributeProps} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {DereferencedLink} from '@/sanity/lib/types'

const builder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export function resolveOpenGraphImage(
  image?: SanityImageSource | null,
  width = 1200,
  height = 627,
) {
  if (!image) return
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url()
  if (!url) return
  return {url, alt: (image as {alt?: string})?.alt || '', width, height}
}

// Resolve a portable text link annotation to a URL string.
export function linkResolver(link: DereferencedLink | undefined): string | null {
  if (!link) return null

  // Handle pasted bare URLs (no linkType set by the editor)
  if (!link.linkType && link.href) {
    return link.href
  }

  switch (link.linkType) {
    case 'href':
      return link.href || null
    case 'email':
      return link.email ? `mailto:${link.email}` : null
    case 'documentaries':
      return link.slug ? `/documentaries/${link.slug}` : null
    case 'animation':
      return link.slug ? `/animations/${link.slug}` : null
    case 'campaign':
      return link.slug ? `/campaigns/${link.slug}` : null
    default:
      return null
  }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config)
}
