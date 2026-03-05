import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import ProjectBuilder from '@/app/components/PageBuilder'
import {documentaryBySlugQuery, documentarySlugsQuery} from '@/sanity/lib/queries'


type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: documentarySlugsQuery,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: documentary} = await sanityFetch({
    query: documentaryBySlugQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(documentary?.ogImage)

  return {
    title: documentary?.seoTitle,
    description: documentary?.seoDescription,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function DocumentaryPage(props: Props) {
  const params = await props.params
  const [{data: documentary}] = await Promise.all([
    sanityFetch({query: documentaryBySlugQuery, params}),
  ])

  if (!documentary?._id) {
    return notFound()
  }

  return (
    <>
      <ProjectBuilder documentId={documentary._id} documentType="documentaries" builderField="documentariesBuilder" blocks={documentary.documentariesBuilder ?? []} />
    </>
  )
}
