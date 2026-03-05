import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import ProjectBuilder from '@/app/components/PageBuilder'
import {contactPageQuery} from '@/sanity/lib/queries'

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const {data} = await sanityFetch({query: contactPageQuery, stega: false})
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(data?.ogImage)
  return {
    title: data?.seoTitle,
    description: data?.seoDescription,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function ContactPage() {
  const {data} = await sanityFetch({query: contactPageQuery})

  if (!data?._id) return notFound()

  return (
    <ProjectBuilder
      documentId={data._id}
      documentType="contact"
      builderField="contactBuilder"
      blocks={data.contactBuilder ?? []}
    />
  )
}
