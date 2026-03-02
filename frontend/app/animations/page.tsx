import {sanityFetch} from '@/sanity/lib/live'
import {animationsListingQuery } from '@/sanity/lib/queries'
import { RowsListingContent } from '../components/RowsListingContent'


export default async function AnimationsPage() {
  const [{data: animations}] = await Promise.all([
    sanityFetch({query: animationsListingQuery}),
  ])
  return (
    <div className="h-screen flex justify-center items-center">
      <RowsListingContent items={animations} basePath="animations" />
    </div>
  )
}
