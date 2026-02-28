import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A curated row on a listing page.
 * Used in homePage (documentaries rows) and can be reused for animations listing.
 * Each row has an optional display title and up to 5 referenced items.
 * The background video for each card comes from the document itself — no override needed here.
 */
export const listingSection = defineType({
  name: 'listingSection',
  title: 'Listing Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionType',
      title: 'Content Type',
      type: 'string',
      description: 'Choose whether this section lists Documentaries or Animations.',
      options: {
        list: [
          {title: 'Documentaries', value: 'documentaries'},
          {title: 'Animations', value: 'animations'},
        ],
        layout: 'radio',
      },
      initialValue: 'documentaries',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional display title for this row (e.g. "Most Viewed").',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'Select up to 5 items. The order here controls the order on the site.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'documentary',
              title: 'Documentary',
              type: 'reference',
              to: [{type: 'documentaries'}],
              hidden: ({parent}: {parent?: {_type?: string; documentary?: unknown; animation?: unknown}}) =>
                (parent as {sectionType?: string})?.sectionType === 'animations',
            }),
            defineField({
              name: 'animation',
              title: 'Animation',
              type: 'reference',
              to: [{type: 'animation'}],
              hidden: ({parent}: {parent?: {_type?: string; documentary?: unknown; animation?: unknown}}) =>
                (parent as {sectionType?: string})?.sectionType !== 'animations',
            }),
          ],
          preview: {
            select: {
              docTitle: 'documentary.name',
              docClient: 'documentary.client',
              animTitle: 'animation.name',
              animClient: 'animation.client',
            },
            prepare({docTitle, docClient, animTitle, animClient}) {
              return {
                title: docTitle || animTitle || 'Untitled',
                subtitle: docClient || animClient || '',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(5).error('Maximum 5 items per section.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sectionType: 'sectionType',
    },
    prepare({title, sectionType}) {
      const typeLabel = sectionType === 'animations' ? 'Animations' : 'Documentaries'
      return {
        title: title || 'Untitled Section',
        subtitle: `${typeLabel} Section`,
      }
    },
  },
})
