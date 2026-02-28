import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'welcomeText',
      title: 'Welcome Text',
      type: 'string',
    }),
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      description: 'Used in browser tab and search engine results.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO.',
          type: 'string',
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
