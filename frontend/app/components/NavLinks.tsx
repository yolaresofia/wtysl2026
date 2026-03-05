'use client'
import { Link } from 'next-view-transitions'
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
    <div className="flex gap-3">
      {links.map(({href, label}) => (
        <Link
          key={href}
          href={href}
          className={`text-xs uppercase cursor-pointer hover:text-white transition-colors ${pathname.startsWith(href) ? 'text-white' : 'text-white/40'}`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
