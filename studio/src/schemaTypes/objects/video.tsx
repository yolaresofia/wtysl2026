import {defineArrayMember, defineField, defineType} from 'sanity'
import {VideoIcon} from '@sanity/icons'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'Vimeo URL',
    },
    prepare({title}) {
      return {
        title: title || 'Vimeo URL',
        subtitle: 'Vimeo URL',
      }
    },
  },
})
