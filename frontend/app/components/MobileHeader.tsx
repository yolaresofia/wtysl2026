'use client'

import Image from 'next/image'
import Link from 'next/link'
import {PortableText} from 'next-sanity'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

const links = [
  {href: '/documentaries', label: 'documentaries'},
  {href: '/campaigns', label: 'campaigns'},
  {href: '/animations', label: 'animations'},
  {href: '/about', label: 'about'},
  {href: '/contact', label: 'contact'},
]

type ContactBlock = {
  firstColumn?: unknown[] | null
  secondColumn?: unknown[] | null
  thirdColumn?: unknown[] | null
} | null

type Props = {
  logoUrl: string
  contactBlock: ContactBlock
  menuVideoUrl?: string | null
}

export default function MobileHeader({logoUrl, contactBlock, menuVideoUrl}: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleLinkClick = () => setOpen(false)

  return (
    <>
      <header className="fixed z-50 inset-x-0 top-0 px-5 py-5 flex items-center justify-between lg:hidden">
        <Link href="/documentaries">
          <Image src={logoUrl} alt="Logo" width={100} height={100} className="h-10 w-auto" />
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-white tracking-wide"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col px-5 pt-40 pb-10 lg:hidden overflow-y-auto">
          {menuVideoUrl && (
            <video
              src={menuVideoUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          <nav className="relative flex flex-col gap-4 mb-12">
            {links.map(({href, label}) => (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={`md:text-2xl text-[22px] capitalize ${pathname.startsWith(href) ? 'text-white' : 'text-white/40'}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {contactBlock && (
            <div className="relative flex flex-col gap-6 text-[13px] text-white/60 mt-auto pr-12">
              {contactBlock.firstColumn && (
                <PortableText value={contactBlock.firstColumn as Parameters<typeof PortableText>[0]['value']} />
              )}
              {contactBlock.secondColumn && (
                <PortableText value={contactBlock.secondColumn as Parameters<typeof PortableText>[0]['value']} />
              )}
              {contactBlock.thirdColumn && (
                <PortableText value={contactBlock.thirdColumn as Parameters<typeof PortableText>[0]['value']} />
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
