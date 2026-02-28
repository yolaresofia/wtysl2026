import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

/**
 * Home Page singleton — controls the curated documentary rows on the homepage.
 * Animations and campaigns listing pages auto-fetch all published documents.
 *
 * Rules:
 * - Maximum 3 sections (rows).
 * - Each row references up to 5 documentaries (enforced in listingSection).
 * - Background video per card is pulled from the documentary document itself.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'sections',
      title: 'Documentary Sections',
      type: 'array',
      description:
        'Each section is a row on the homepage. Maximum 3 rows, each with up to 5 documentaries.',
      of: [{type: 'listingSection'}],
      validation: (Rule) => Rule.max(3).error('Maximum 3 sections allowed on the home page.'),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
