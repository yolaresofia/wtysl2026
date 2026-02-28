import {documentaries} from './documents/documentaries'
import {animation} from './documents/animation'
import {campaign} from './documents/campaign'
import {settings} from './singletons/settings'
import {aboutPage} from './singletons/aboutPage'
import {contactModule} from './singletons/contactModule'
import {homePage} from './singletons/homePage'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {listingSection} from './objects/listingSection'
import {video} from './objects/Video'
import {projectHero} from './objects/projectHero'
import {heroInfoItem} from './objects/heroInfoItem'
import {galleryItem} from './objects/galleryItem'
import {gallery} from './objects/gallery'
import {campaignSection} from './objects/campaignSection'
import {textWithBackgroundColor} from './objects/textWithBackgroundColor'
import {photoInfoGallery} from './objects/photoInfoGallery'
import {photoInfoGalleryItem} from './objects/photoInfoGalleryItem'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  aboutPage,
  contactModule,
  homePage,
  // Documents
  documentaries,
  campaign,
  animation,
  // Objects
  blockContent,
  blockContentTextOnly,
  link,
  listingSection,
  video,
  projectHero,
  heroInfoItem,
  galleryItem,
  gallery,
  campaignSection,
  textWithBackgroundColor,
  photoInfoGallery,
  photoInfoGalleryItem,
]
