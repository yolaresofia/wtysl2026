import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapQuery} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {data: documents} = await sanityFetch({query: sitemapQuery})
  const headersList = await headers()
  const domain: string = headersList.get('host') as string

  const result: MetadataRoute.Sitemap = [
    {url: domain, lastModified: new Date(), priority: 1, changeFrequency: 'monthly'},
  ]

  for (const doc of documents ?? []) {
    let path: string | null = null
    switch (doc._type) {
      case 'documentaries':
        path = `/documentaries/${doc.slug}`
        break
      case 'animation':
        path = `/animations/${doc.slug}`
        break
      case 'campaign':
        path = `/campaigns/${doc.slug}`
        break
    }
    if (!path) continue
    result.push({
      url: `${domain}${path}`,
      lastModified: doc._updatedAt || new Date(),
      priority: 0.8,
      changeFrequency: 'monthly',
    })
  }

  return result
}
