import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'galleryItem'})],
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      const count = items?.length ?? 0
      return {
        title: 'Gallery',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
        media: ImagesIcon,
      }
    },
  },
})
