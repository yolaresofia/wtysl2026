import {sanityFetch} from '@/sanity/lib/live'
import {documentariesListingQuery, documentaryCategoriesQuery} from '@/sanity/lib/queries'
import { RowsListingContent } from '../components/RowsListingContent'

export default async function DocumentariesPage() {
  const [{data: documentaries}, {data: categories}] = await Promise.all([
    sanityFetch({query: documentariesListingQuery}),
    sanityFetch({query: documentaryCategoriesQuery}),
  ])
  return (
    <div className="lg:h-screen lg:flex lg:justify-center lg:items-center">
      <RowsListingContent items={documentaries} categories={categories ?? []} basePath="documentaries" />
    </div>
  )
}
