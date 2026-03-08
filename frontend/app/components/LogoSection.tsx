import Image from 'next/image'

type LogoSectionItem = {
  _key: string
  altText?: string | null
  image?: {asset?: {url?: string | null} | null} | null
}

type Props = {
  block: {
    backgroundColor?: string | null
    title?: string | null
    items?: LogoSectionItem[] | null
  }
}

export default function LogoSection({block: {backgroundColor, title, items}}: Props) {
  const validItems = items?.filter((item) => item.image?.asset?.url) ?? []

  return (
    <div
      className="w-full px-9 py-20 flex flex-col gap-y-10 md:flex-row md:items-start md:gap-x-10 md:gap-y-0"
      style={{backgroundColor: backgroundColor ?? undefined}}
    >
      <p className="text-[13px] text-white shrink-0 leading-none">{title}</p>
      <div
        className="grid gap-y-8 md:gap-x-18 gap-x-2 flex-1"
        style={{gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))'}}
      >
        {validItems.map((item) => (
          <div key={item._key} className="flex justify-center items-start">
            <Image
              src={item.image!.asset!.url!}
              alt={item.altText ?? ''}
              width={80}
              height={36}
              className="w-auto md:h-9 h-6 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
