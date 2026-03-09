import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import { settingsQuery, contactColumnsQuery } from '@/sanity/lib/queries'
import { HomeHero } from './components/HomeHero'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: settingsQuery, stega: false})
  return {
    title: data?.siteTitle,
    description: data?.seoDescription,
    openGraph: {
      images: data?.ogImage ? [] : [],
    },
  }
}

export default async function HomePage() {
  const [{data}, {data: contact}] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false}),
    sanityFetch({query: contactColumnsQuery}),
  ])
  if (!data) return null
  const menuVideoUrl = (data.mobileMenuBackgroundVideo as {url?: string | null} | null)?.url ?? null
  return (
    <HomeHero {...data} contactBlock={contact?.contactBlock ?? null} menuVideoUrl={menuVideoUrl} />
  )
}
