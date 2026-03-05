import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {urlForImage} from '@/sanity/lib/utils'
import NavLinks from './NavLinks'
import LogoWithHover from './LogoWithHover'

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })
  if (!settings) return null
  return (
    <header className="fixed z-50 inset-x-0 top-0 p-9 lg:block hidden">
      <div className="grid grid-cols-3 items-start">
        <div>
          {settings.logo?.asset && (
            <LogoWithHover
              logoUrl={urlForImage(settings.logo.asset).url()}
              welcomeText={settings.welcomeText}
            />
          )}
        </div>
        <div className="flex justify-center">
          <NavLinks />
        </div>
        <div></div>
      </div>
    </header>
  )
}
