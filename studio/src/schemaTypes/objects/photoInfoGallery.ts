import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const photoInfoGallery = defineType({
  name: 'photoInfoGallery',
  title: 'Photo info gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'photoInfoGalleryItem'})],
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
