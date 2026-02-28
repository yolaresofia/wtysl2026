import {defineField, defineType} from 'sanity'

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
