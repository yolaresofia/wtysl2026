import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

// studio/src/schemaTypes/objects/contactBlock.tsx
export const contactBlock = defineType({
  name: 'contactBlock',
  title: 'Contact',
  type: 'object', // ← was 'document'
  icon: EnvelopeIcon,
  fields: [
    // backgroundType toggle
    defineField({
      name: 'backgroundType',
      title: 'Background Type',
      type: 'string',
      options: {list: ['video', 'color'], layout: 'radio'},
      initialValue: 'color',
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.backgroundType !== 'video',
    }),
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
      name: 'centerText',
      title: 'Center Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hoverCenterText',
      title: 'Hover Center Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'firstColumn', title: 'First Column', type: 'blockContent'}),
    defineField({name: 'secondColumn', title: 'Second Column', type: 'blockContent'}),
    defineField({name: 'thirdColumn', title: 'Third Column', type: 'blockContent'}),
  ],
})
