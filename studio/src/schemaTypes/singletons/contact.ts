import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

/**
 * Contact — single document controlling everything about the contact section.
 *
 * Auto-rendered at the bottom of every page (no per-page editor input needed):
 *   - /contact              → uses backgroundVideo
 *   - /about + detail pages → uses backgroundColor
 *
 * Also holds SEO metadata for the /contact route.
 */
export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'page', title: 'Page'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'The campaign title shown on listing cards and the detail page.',
      validation: (Rule) => Rule.required().error('A title is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Auto-generated from the title. Used in the URL: /campaigns/[slug].',
      validation: (Rule) =>
        Rule.required()
          .custom(async (value, context) => {
            if (!value?.current) return true
            const {document, getClient} = context
            const client = getClient({apiVersion: '2024-01-01'})
            const id = document?._id?.replace(/^drafts\./, '')
            const count = await client.fetch(
              `count(*[_type == "campaign" && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))])`,
              {slug: value.current, id},
            )
            return count === 0 ? true : 'This slug is already used by another campaign.'
          })
          .error('A slug is required.'),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {hotspot: true},
      group: 'seo',
    }),
    defineField({
      name: 'contactBuilder',
      title: 'Page Builder',
      type: 'array',
      group: 'page',
      description: 'Build the detail page by adding and reordering sections below.',
      of: [{type: 'contactBlock'}],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/contact-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact'}
    },
  },
})
