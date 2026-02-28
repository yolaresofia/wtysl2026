import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import type {Link} from '../../../sanity.types'

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'url',
      options: {
        list: [
          {title: 'URL', value: 'href'},
          {title: 'Email', value: 'email'},
          {title: 'Documentary', value: 'documentaries'},
          {title: 'Animation', value: 'animation'},
          {title: 'Campaign', value: 'campaign'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'href',
      validation: (Rule) =>
        // Custom validation to ensure URL is provided if the link type is 'href'
        Rule.custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'href' && !value) {
            return 'URL is required when Link Type is URL'
          }
          return true
        }),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'email',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string}
          if (parent?.linkType === 'email' && !value) {
            return 'Email is required when Link Type is Email'
          }
          return true
        }),
    }),
    defineField({
      name: 'documentaries',
      title: 'Documentaries',
      type: 'reference',
      to: [{type: 'documentaries'}],
      hidden: ({parent}) => parent?.linkType !== 'documentaries',
      validation: (Rule) =>
        // Custom validation to ensure project reference is provided if the link type is 'documentaries'
        Rule.custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'documentaries' && !value) {
            return 'Documentaries reference is required when Link Type is Documentaries'
          }
          return true
        }),
    }),
     defineField({
      name: 'animation',
      title: 'Animation',
      type: 'reference',
      to: [{type: 'animation'}],
      hidden: ({parent}) => parent?.linkType !== 'animation',
      validation: (Rule) =>
        // Custom validation to ensure project reference is provided if the link type is 'project'
        Rule.custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'animation' && !value) {
            return 'Animation reference is required when Link Type is Project'
          }
          return true
        }),
    }),
     defineField({
      name: 'campaign',
      title: 'Campaign',
      type: 'reference',
      to: [{type: 'campaign'}],
      hidden: ({parent}) => parent?.linkType !== 'campaign',
      validation: (Rule) =>
        // Custom validation to ensure project reference is provided if the link type is 'project'
        Rule.custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'campaign' && !value) {
            return 'Campaign reference is required when Link Type is Project'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
