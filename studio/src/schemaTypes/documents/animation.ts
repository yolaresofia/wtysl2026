import {defineField, defineType} from 'sanity'
import {StackCompactIcon} from '@sanity/icons'
import {AnimationCategoryInput} from '../../components/CategoryInput'

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
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {hotspot: true},
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
      components: {
        input: AnimationCategoryInput,
      },
      validation: (Rule) => [
        Rule.required().error('Please select a category.'),
        Rule.custom(async (value, context) => {
          if (!value) return true
          const {document, getClient} = context
          const client = getClient({apiVersion: '2024-01-01'})
          const id = document?._id?.replace(/^drafts\./, '')
          const count = await client.fetch(
            `count(*[_type == "animation" && category == $category && _id != $id && !(_id in path("drafts.**"))])`,
            {category: value, id},
          )
          return count < 5 ? true : 'This category already has 5 animations. Remove one before adding another.'
        }),
      ],
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
      of: [{type: 'video'}, {type: 'projectHero'}, {type: 'gallery'}, {type: 'contactBlock'}],
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
