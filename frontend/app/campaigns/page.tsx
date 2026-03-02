import {sanityFetch} from '@/sanity/lib/live'
import {campaignsListingQuery} from '@/sanity/lib/queries'
import { ColListingContent } from '../components/ColListingContent'


export default async function CampaignsPage() {
  const [{data: campaigns}] = await Promise.all([
    sanityFetch({query: campaignsListingQuery}),
  ])

  return (
    <div className="h-screen flex justify-center items-center">
      <ColListingContent items={campaigns} />
    </div>
  )
}
