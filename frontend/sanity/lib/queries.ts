import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

export const getProjectQuery = defineQuery(`
  *[_type == 'project' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "projectBuilder": projectBuilder[]{
      ...,
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const projectsSlugs = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  {"slug": slug.current}
`)
