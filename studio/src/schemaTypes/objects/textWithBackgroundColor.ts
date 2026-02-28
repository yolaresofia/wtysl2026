import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const textWithBackgroundColor = defineType({
  name: 'textWithBackgroundColor',
  title: 'Text with background color',
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
        ],
        layout: 'radio',
      },
      initialValue: '#FCC554',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'Text with background color',
    },
    prepare({title}) {
      return {
        title: title || 'Text with background color',
        subtitle: 'Text with background color',
      }
    },
  },
})
