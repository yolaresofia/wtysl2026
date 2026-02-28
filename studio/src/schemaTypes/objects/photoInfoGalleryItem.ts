import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const photoInfoGalleryItem = defineType({
  name: 'photoInfoGalleryItem',
  title: 'Person',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name of the person.',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Job title or role (e.g. "Director of Photography").',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City or country.',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Unnamed person',
        subtitle: subtitle || '',
        media: media ?? UserIcon,
      }
    },
  },
})
