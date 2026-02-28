import {defineField, defineType} from 'sanity'
import {StackCompactIcon} from '@sanity/icons'

export const animation = defineType({
  name: 'animation',
  title: 'Animation',
  type: 'document',
  icon: StackCompactIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'page', title: 'Page Builder'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'The title shown on listing cards and the detail page.',
      validation: (Rule) => Rule.required().error('A title is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Auto-generated from the title. Used in the URL: /animations/[slug].',
      validation: (Rule) =>
        Rule.required()
          .custom(async (value, context) => {
            if (!value?.current) return true
            const {document, getClient} = context
            const client = getClient({apiVersion: '2024-01-01'})
            const id = document?._id?.replace(/^drafts\./, '')
            const count = await client.fetch(
              `count(*[_type == "animation" && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))])`,
              {slug: value.current, id},
            )
            return count === 0 ? true : 'This slug is already used by another animation.'
          })
          .error('A slug is required.'),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'content',
      description: 'The client or brand shown on listing cards alongside the title.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      description: 'Determines which section this animation appears in on the listing page.',
      options: {
        // TODO: replace these placeholder values with the real animation categories
        list: [
          {title: 'lorem ipsum', value: 'category-a'},
          {title: 'dolor', value: 'category-b'},
          {title: 'sit', value: 'category-c'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Please select a category.'),
    }),
    defineField({
      name: 'backgroundVideo',
      title: 'Listing Card Video',
      type: 'file',
      group: 'content',
      description: 'Short looping video shown on the listing card. Keep under 10 MB for performance.',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'animationBuilder',
      title: 'Page Builder',
      type: 'array',
      group: 'page',
      description: 'Build the detail page by adding and reordering sections below.',
      of: [{type: 'video'}, {type: 'projectHero'}, {type: 'gallery'}],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/project-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'client',
    },
  },
})
