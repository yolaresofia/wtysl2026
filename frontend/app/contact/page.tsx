import {sanityFetch} from '@/sanity/lib/live'
import {contactModuleQuery} from '@/sanity/lib/queries'
import { ContactHero } from './components/ContactHero'

export default async function ContactPage() {
  const {data} = await sanityFetch({query: contactModuleQuery})
  if (!data) return null
  return (
    <div>
      <ContactHero {...data} />
    </div>
  )
}
