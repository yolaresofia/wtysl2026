import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import ProjectBuilder from '@/app/components/PageBuilder'
import {animationBySlugQuery, animationSlugsQuery, contactModuleQuery} from '@/sanity/lib/queries'
import { ContactHero } from '@/app/contact/components/ContactHero'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: animationSlugsQuery,
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
  const {data: animation} = await sanityFetch({
    query: animationBySlugQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(animation?.ogImage)

  return {
    title: animation?.seoTitle,
    description: animation?.seoDescription,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function AnimationPage(props: Props) {
  const params = await props.params
  const [{data: animation}, {data: contact}] = await Promise.all([
    sanityFetch({query: animationBySlugQuery, params}), sanityFetch({query: contactModuleQuery}),
  ])
  if (!animation?._id) {
    return notFound()
  }

  return (
    <>
      <ProjectBuilder documentId={animation._id} documentType="animations" builderField="animationBuilder" blocks={animation.animationBuilder ?? []} />
      {contact && <ContactHero {...contact} />}
    </>
  )
}
