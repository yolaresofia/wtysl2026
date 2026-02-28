import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const projectHero = defineType({
  name: 'projectHero',
  title: 'Project Hero',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Yellow — #FCC554', value: '#FCC554'},
          {title: 'Dark Blue — #373B45', value: '#373B45'},
          {title: 'Black — #000000', value: '#000000'},
          {title: 'Sage — #707E69', value: '#707E69'},
          {title: 'Dark — #18181B', value: '#18181B'},
          {title: 'Sand — #8C7E79', value: '#8C7E79'},
        ],
        layout: 'radio',
      },
      initialValue: '#FCC554',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'text',
    }),
    defineField({
      name: 'infoSection',
      title: 'Info Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [defineArrayMember({type: 'heroInfoItem'})],
          validation: (Rule) => Rule.max(3),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'Project hero',
    },
    prepare({title}) {
      return {
        title: title || 'Project hero',
        subtitle: 'Project hero',
      }
    },
  },
})
