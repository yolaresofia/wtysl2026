import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
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
  const {data} = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
    if (!data) return null
  return (
    <HomeHero {...data} />
  )
}
