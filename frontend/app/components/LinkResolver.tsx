type Link = {
  linkType?: string | null
  href?: string | null
  email?: string | null
  openInNewTab?: boolean | null
}

type Props = {
  link: Link | null | undefined
  children: React.ReactNode
  className?: string
}

export default function LinkResolver({link, children, className}: Props) {
  if (!link?.linkType) return <>{children}</>

  if (link.linkType === 'email' && link.email) {
    return (
      <a href={`mailto:${link.email}`} className={className}>
        {children}
      </a>
    )
  }

  if (link.linkType === 'href' && link.href) {
    return (
      <a
        href={link.href}
        className={className}
        {...(link.openInNewTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      >
        {children}
      </a>
    )
  }

  return <>{children}</>
}
