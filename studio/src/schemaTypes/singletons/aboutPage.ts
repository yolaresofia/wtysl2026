import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Animation schema.  Define and edit the fields for the 'project' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: DocumentIcon,
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
      name: 'aboutBuilder',
      title: 'About builder',
      type: 'array',
      of: [{type: 'video'}, {type: 'projectHero'}, {type: 'gallery'}, {type: 'textWithBackgroundColor'}, {type: 'photoInfoGallery'}],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/studio/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/about-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
})
