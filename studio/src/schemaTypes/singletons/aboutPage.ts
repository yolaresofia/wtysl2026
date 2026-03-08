import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {maxVideoSize, maxImageSize} from '../../utils/fileSizeValidation'

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
      validation: (Rule) => Rule.custom(maxImageSize),
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Looping background video',
      type: 'file',
      description:
        'Short looping video shown before vimeo video. Keep under 10 MB for performance.',
      options: {
        accept: 'video/*',
      },
      validation: (Rule) => Rule.custom(maxVideoSize),
    }),
    defineField({
      name: 'aboutBuilder',
      title: 'About builder',
      type: 'array',
      of: [
        {type: 'video'},
        {type: 'textWithBackgroundColor'},
        {type: 'photoInfoGallery'},
        {type: 'contactBlock'},
        {type: 'logoSection'},
      ],
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
