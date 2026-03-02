import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const photoInfoGallery = defineType({
  name: 'photoInfoGallery',
  title: 'Photo info gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Yellow — #FCC554', value: '#FCC554'},
          {title: 'Dark Blue — #373B45', value: '#373B45'},
          {title: 'Black — #000000', value: '#000000'},
          {title: 'Sage — #707E69', value: '#707E69'},
          {title: 'Dark — #18181B', value: '#18181B'},
          {title: 'Sand — #8C7E79', value: '#8C7E79'},
        ],
        layout: 'radio',
      },
      initialValue: '#FCC554',
      validation: (Rule) => Rule.required(),
    }),
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
        title: 'Photo info gallery',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
        media: ImagesIcon,
      }
    },
  },
})
