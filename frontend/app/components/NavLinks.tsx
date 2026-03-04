'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

const links = [
  {href: '/documentaries', label: 'documentaries'},
  {href: '/campaigns', label: 'campaigns'},
  {href: '/animations', label: 'animations'},
  {href: '/about', label: 'about'},
  {href: '/contact', label: 'contact'},
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <div className="flex space-x-2 justify-between max-w-4xl col-span-2">
      {links.map(({href, label}) => (
        <Link
          key={href}
          href={href}
          className={`text-xs uppercase cursor-pointer ${pathname.startsWith(href) ? 'text-white' : 'text-white/40'}`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
