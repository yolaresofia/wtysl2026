import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const logoSectionItem = defineType({
  name: 'logoSectionItem',
  title: 'Person',
  type: 'object',
  fields: [
    defineField({
      name: 'altText',
      title: 'Alternative Text',
      type: 'string',
      description: 'Alternative text for the logo, used for accessibility and SEO.',
    }),
    defineField({
      name: 'image',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'altText',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title || 'Unnamed logo',
        media: media ?? UserIcon,
      }
    },
  },
})
