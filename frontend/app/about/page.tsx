import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import ProjectBuilder from '@/app/components/PageBuilder'
import {aboutPageQuery} from '@/sanity/lib/queries'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: about} = await sanityFetch({
    query: aboutPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(about?.ogImage)

  return {
    title: about?.seoTitle,
    description: about?.seoDescription,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function AboutPage() {
  const [{data: about}] = await Promise.all([
    sanityFetch({query: aboutPageQuery}),
  ])

  if (!about?._id) {
    return notFound()
  }

  return (
    <>
      <ProjectBuilder documentId={about._id} documentType="about" builderField="aboutBuilder" blocks={about.aboutBuilder ?? []} />
    </>
  )
}
