import Link from 'next/link'
import Image from 'next/image'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {urlForImage} from '@/sanity/lib/utils'
import NavLinks from './NavLinks'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })
  if (!settings) return null
  return (
    <header className="fixed z-50 inset-x-0 top-0 p-9 lg:block hidden">
      <div className="flex items-center">
        <div className="flex-1">{settings.logo?.asset && (
          <Link href="/documentaries" className="cursor-pointer">
          <Image
            src={urlForImage(settings.logo.asset).url()}
            alt="Logo"
            width={100}
            height={100}
            className="h-12 w-auto mr-8"
          />
        </Link>
        )}</div>
        
        <div className="flex-1">
          <NavLinks />
        </div>
        <div className="flex-1"></div>
      </div>
    </header>
  )
}
