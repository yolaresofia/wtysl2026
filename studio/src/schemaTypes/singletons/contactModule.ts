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
export const contactModule = defineType({
  name: 'contactModule',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'file',
      group: 'content',
      description: 'Shown on the /contact page. All other pages use the background color below.',
      options: {accept: 'video/*'},
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      group: 'content',
      description: 'Shown on /about and all documentary, animation, and campaign detail pages.',
      options: {
        list: [
          {title: 'Yellow — #FCC554', value: '#FCC554'},
          {title: 'Dark Blue — #373B45', value: '#373B45'},
          {title: 'Black — #000000', value: '#000000'},
        ],
        layout: 'radio',
      },
      initialValue: '#000000',
      validation: (Rule) => Rule.required().error('Please select a background color.'),
    }),
    defineField({
      name: 'centerText',
      title: 'Center Text',
      type: 'string',
      group: 'content',
      description: 'Main text shown in the centre (e.g. an email address or tagline).',
      validation: (Rule) => Rule.required().error('Center text is required.'),
    }),
    defineField({
      name: 'hoverCenterText',
      title: 'Hover Center Text',
      type: 'string',
      group: 'content',
      description: 'Text revealed when hovering over the center text.',
      validation: (Rule) => Rule.required().error('Hover text is required.'),
    }),
    defineField({
      name: 'firstColumn',
      title: 'First Column',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'secondColumn',
      title: 'Second Column',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'thirdColumn',
      title: 'Third Column',
      type: 'blockContent',
      group: 'content',
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
      group: 'seo',
      description: 'Displayed on social cards and search engine results.',
      options: {hotspot: true},
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact'}
    },
  },
})
