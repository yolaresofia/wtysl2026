import {defineField, defineType} from 'sanity'
import {maxVideoSize} from '../../utils/fileSizeValidation'

export const campaignSection = defineType({
  name: 'campaignSection',
  title: 'Campaign Section',
  type: 'object',
  fields: [
    defineField({
      name: 'campaign',
      title: 'Campaign',
      type: 'reference',
      to: [{type: 'campaign'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'file',
      validation: (Rule) => Rule.custom(maxVideoSize),
    }),
  ],
  preview: {
    select: {
      title: 'campaign.name',
    },
    prepare({title}: {title?: string}) {
      return {
        title: title || 'Untitled Campaign',
        subtitle: 'Campaign',
      }
    },
  },
})
