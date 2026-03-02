import Link from 'next/link'
import Image from 'next/image'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {urlForImage} from '@/sanity/lib/utils'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })
  if (!settings) return null
  return (
    <header className="fixed z-50 inset-x-0 top-0 p-4">
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
          <div className="flex space-x-2 justify-between max-w-4xl col-span-2 text-white">
            <Link href="/documentaries" className="text-xs uppercase cursor-pointer">
              documentaries
            </Link>
            <Link href="/campaigns" className="text-xs uppercase cursor-pointer">
              campaigns
            </Link>
            <Link href="/animations" className="text-xs uppercase cursor-pointer">
              animations
            </Link>
            <Link href="/about" className="text-xs uppercase cursor-pointer">
              about
            </Link>
            <Link href="/contact" className="text-xs uppercase">
              contact
            </Link>
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
    </header>
  )
}
