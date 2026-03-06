import {sanityFetch} from '@/sanity/lib/live'
import {campaignsListingQuery} from '@/sanity/lib/queries'
import { ColListingContent } from '../components/ColListingContent'


export default async function CampaignsPage() {
  const [{data: campaigns}] = await Promise.all([
    sanityFetch({query: campaignsListingQuery}),
  ])

  return (
    <div className="lg:h-screen lg:flex lg:justify-center lg:items-center">
      <ColListingContent items={campaigns} />
    </div>
  )
}
