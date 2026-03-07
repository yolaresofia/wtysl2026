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
      name: 'backgroundVideo',
      title: 'Background Video',
      description: 'Used as the background video for the opening animation on the homepage.',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'mobileMenuBackgroundVideo',
      title: 'Mobile Menu Background Video',
      description: 'Used as the background video for the mobile menu.',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'documentaryCategories',
      title: 'Documentary Categories',
      description: 'Define up to 3 categories for documentaries. Order here determines the order on the listing page.',
      type: 'array',
      of: [
        defineField({
          name: 'category',
          title: 'Category',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Label',
              type: 'string',
              description: 'Displayed on the listing page (e.g. "Most Viewed").',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Slug',
              type: 'slug',
              description: 'Internal identifier used to group projects. Auto-generated from the label.',
              options: {source: 'title'},
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
      validation: (Rule) => Rule.max(3).error('You can only have up to 3 documentary categories.'),
    }),
    defineField({
      name: 'animationCategories',
      title: 'Animation Categories',
      description: 'Define up to 3 categories for animations. Order here determines the order on the listing page.',
      type: 'array',
      of: [
        defineField({
          name: 'category',
          title: 'Category',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Label',
              type: 'string',
              description: 'Displayed on the listing page (e.g. "Most Viewed").',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Slug',
              type: 'slug',
              description: 'Internal identifier used to group projects. Auto-generated from the label.',
              options: {source: 'title'},
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
      validation: (Rule) => Rule.max(3).error('You can only have up to 3 animation categories.'),
    }),
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      description: 'Used in browser tab and search engine results.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      description: 'Used in search engine results. Max 160 characters.',
      type: 'string',
      validation: (rule) => rule.max(160),
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
