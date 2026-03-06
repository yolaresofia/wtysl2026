import {settingsQuery, contactColumnsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {urlForImage} from '@/sanity/lib/utils'
import NavLinks from './NavLinks'
import LogoWithHover from './LogoWithHover'
import MobileHeader from './MobileHeader'

export default async function Header() {
  const [{data: settings}, {data: contact}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: contactColumnsQuery}),
  ])
  if (!settings) return null
  const logoUrl = settings.logo?.asset ? urlForImage(settings.logo.asset).url() : null
  const menuVideoUrl = (settings.mobileMenuBackgroundVideo as {url?: string | null} | null)?.url ?? null
  return (
    <>
      <header className="fixed z-50 inset-x-0 top-0 p-9 lg:block hidden">
        <div className="grid grid-cols-3 items-start">
          <div>
            {logoUrl && (
              <LogoWithHover
                logoUrl={logoUrl}
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
      {logoUrl && (
        <MobileHeader
          logoUrl={logoUrl}
          contactBlock={contact?.contactBlock ?? null}
          menuVideoUrl={menuVideoUrl}
        />
      )}
    </>
  )
}
