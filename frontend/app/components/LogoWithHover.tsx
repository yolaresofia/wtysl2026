'use client'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

type Props = {
  logoUrl: string
  welcomeText?: string | null
}

export default function LogoWithHover({logoUrl, welcomeText}: Props) {
  return (
    <div className="group relative flex items-start">
      <Link href="/documentaries" className="cursor-pointer shrink-0">
        <Image
          src={logoUrl}
          alt="Logo"
          width={100}
          height={100}
          className="h-12 w-auto"
        />
      </Link>
      {welcomeText && (
        <p className="absolute top-0 left-[calc((100vw-4.5rem)/12+2rem)] text-[13px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-none max-w-xs">
          {welcomeText}
        </p>
      )}
    </div>
  )
}
