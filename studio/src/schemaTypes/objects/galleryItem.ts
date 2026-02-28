import {defineField, defineType} from 'sanity'
import {ImageIcon, VideoIcon} from '@sanity/icons'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Photo', value: 'photo'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'photo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.type === 'video',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'Cover image displayed before the video plays',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.type !== 'video',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'string',
      hidden: ({parent}) => parent?.type !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {type?: string}
          if (parent?.type === 'video' && !value) {
            return 'Vimeo URL is required for video items'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      type: 'type',
      media: 'image',
      thumbnail: 'thumbnail',
    },
    prepare({type, media, thumbnail}) {
      return {
        title: type === 'video' ? 'Video' : 'Photo',
        subtitle: type === 'video' ? 'Vimeo' : 'Image',
        media: type === 'video' ? (thumbnail ?? VideoIcon) : (media ?? ImageIcon),
      }
    },
  },
})
