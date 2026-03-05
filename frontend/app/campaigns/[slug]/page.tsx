import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import ProjectBuilder from '@/app/components/PageBuilder'
import {campaignBySlugQuery, campaignSlugsQuery} from '@/sanity/lib/queries'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: campaignSlugsQuery,
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
  const {data: campaign} = await sanityFetch({
    query: campaignBySlugQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(campaign?.ogImage)

  return {
    title: campaign?.seoTitle,
    description: campaign?.seoDescription,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function CampaignPage(props: Props) {
  const params = await props.params
  const [{data: campaign}] = await Promise.all([
    sanityFetch({query: campaignBySlugQuery, params}),
  ])

  if (!campaign?._id) {
    return notFound()
  }

  return (
    <>
      <ProjectBuilder documentId={campaign._id} documentType="campaigns" builderField="campaignBuilder" blocks={campaign.campaignBuilder ?? []} />
    </>
  )
}
