import {sanityFetch} from '@/sanity/lib/live'
import {animationsListingQuery, animationCategoriesQuery} from '@/sanity/lib/queries'
import { RowsListingContent } from '../components/RowsListingContent'

export default async function AnimationsPage() {
  const [{data: animations}, {data: categories}] = await Promise.all([
    sanityFetch({query: animationsListingQuery}),
    sanityFetch({query: animationCategoriesQuery}),
  ])
  return (
    <div className="h-screen flex justify-center items-center">
      <RowsListingContent items={animations} categories={categories ?? []} basePath="animations" />
    </div>
  )
}
