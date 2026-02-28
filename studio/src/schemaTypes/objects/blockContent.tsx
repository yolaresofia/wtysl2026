import {defineArrayMember, defineType, defineField} from 'sanity'
import type {Link} from '../../../sanity.types'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'href',
                options: {
                  list: [
                    {title: 'URL', value: 'href'},
                    {title: 'Email', value: 'email'},
                    {title: 'Documentary', value: 'documentaries'},
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                validation: (Rule) =>
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
                  Rule.custom((value, context) => {
                    const parent = context.parent as Link
                    if (parent?.linkType === 'documentaries' && !value) {
                      return 'Documentaries reference is required when Link Type is Documentaries'
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
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
