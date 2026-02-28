import {CogIcon, DocumentIcon, EnvelopeIcon, HomeIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = [
  'settings',
  'homePage',
  'aboutPage',
  'contactModule',
  'assist.instruction.context',
]

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Home Page Singleton
      S.listItem()
        .title('Home Page')
        .child(S.document().schemaType('homePage').documentId('homePage'))
        .icon(HomeIcon),
      // About Page Singleton
      S.listItem()
        .title('About Page')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage'))
        .icon(DocumentIcon),
      // Contact Singleton (content + SEO for /contact, shared section everywhere)
      S.listItem()
        .title('Contact')
        .child(S.document().schemaType('contactModule').documentId('contactModule'))
        .icon(EnvelopeIcon),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        .map((listItem) => {
          const title = listItem.getTitle() as string
          const words = title.split(' ')
          const pluralized =
            words.length > 1
              ? [...words.slice(0, -1).map((w) => pluralize(w)), words[words.length - 1]].join(' ')
              : pluralize(title)
          return listItem.title(pluralized)
        }),
      S.divider(),
      // Settings Singleton
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
