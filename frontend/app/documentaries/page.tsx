import {sanityFetch} from '@/sanity/lib/live'
import {documentariesListingQuery} from '@/sanity/lib/queries'
import { RowsListingContent } from '../components/RowsListingContent'


export default async function DocumentariesPage() {
  const [{data: documentaries}] = await Promise.all([
    sanityFetch({query: documentariesListingQuery}),
  ])
  return (
    <div className="h-screen flex justify-center items-center">
      <RowsListingContent items={documentaries} basePath="documentaries" />
    </div>
  )
}
