import {defineArrayMember, defineField, defineType} from 'sanity'
import {VideoIcon} from '@sanity/icons'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Video title',
      type: 'string',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL id',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'Vimeo URL id',
    },
    prepare({title}) {
      return {
        title: title || 'Vimeo URL id',
        subtitle: 'Vimeo URL id',
      }
    },
  },
})
