import {defineQuery} from 'next-sanity'

// ─────────────────────────────────────────────────────────────
// FRAGMENTS
// Reusable GROQ projections composed into queries below.
// ─────────────────────────────────────────────────────────────

// Resolves a Sanity file asset to a usable URL
const videoFragment = /* groq */ `{
   "url": asset->url
}`

// Resolves a Sanity image asset with hotspot/crop metadata
const imageFragment = /* groq */ `{
  ...,
  asset->
}`

// Portable text with resolved internal links
const blockContentFragment = /* groq */ `[]{
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      ...,
      linkType == "documentaries" => {
        "slug": documentaries->slug.current
      }
    }
  }
}`

// Page builder blocks shared across all content types
const pageBuilderFragment = /* groq */ `[]{
  _type,
  _key,
  _type == "video" => {
    "url": vimeoUrl,
    title,
    "backgroundVideo": ^.backgroundVideo ${videoFragment}
  },
  _type == "projectHero" => {
    backgroundColor,
    title,
    subtitle,
    about,
    infoSectionTitle,
    infoSection {
      title,
      items[]{ title, text }
    }
  },
  _type == "gallery" => {
    backgroundColor,
    items[]{
      _key,
      type,
      "imageUrl": select(type == "photo" => image.asset->url),
      "photoAltText": select(type == "photo" => photoAltText),
      "thumbnailUrl": select(type == "video" => thumbnail.asset->url),
      "videoAltText": select(type == "video" => videoAltText),
      "vimeoUrl": select(type == "video" => vimeoUrl)
    }
  },
  _type == "textWithBackgroundColor" => {
    backgroundColor,
    about ${blockContentFragment}
  },
  _type == "photoInfoGallery" => {
    backgroundColor,
    title,
    items[]{
      _key,
      name,
      role,
      location,
      image ${imageFragment}
    }
  },
  _type == "contactBlock" => {
    backgroundType,
    backgroundVideo ${videoFragment},
    backgroundColor,
    centerText,
    hoverCenterText,
    firstColumn ${blockContentFragment},
    secondColumn ${blockContentFragment},
    thirdColumn ${blockContentFragment}
  },
  _type == "logoSection" => {
    backgroundColor,
    title,
    items[]{
      _key,
      altText,
      image ${imageFragment}
    }
  }
}`

// ─────────────────────────────────────────────────────────────
// SETTINGS
// Used in layout.tsx for global metadata and the opening animation.
// ─────────────────────────────────────────────────────────────

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0] {
    logo ${imageFragment},
    welcomeText,
    backgroundVideo ${videoFragment},
    mobileMenuBackgroundVideo ${videoFragment},
    siteTitle,
    seoDescription,
    ogImage ${imageFragment}
  }
`)

// ─────────────────────────────────────────────────────────────
// CONTACT PAGE
// Singleton document with a page builder.
// ─────────────────────────────────────────────────────────────

export const contactPageQuery = defineQuery(`
  *[_type == "contact" && _id == "contact"][0] {
    _id,
    seoTitle,
    seoDescription,
    ogImage ${imageFragment},
    contactBuilder ${pageBuilderFragment}
  }
`)

export const contactColumnsQuery = defineQuery(`
  *[_type == "contact" && _id == "contact"][0] {
    "contactBlock": contactBuilder[_type == "contactBlock"][0] {
      firstColumn ${blockContentFragment},
      secondColumn ${blockContentFragment},
      thirdColumn ${blockContentFragment}
    }
  }
`)

// ─────────────────────────────────────────────────────────────
// DOCUMENTARIES LISTING PAGE
// All published documentaries. Group by category on the frontend.
// ─────────────────────────────────────────────────────────────

export const documentaryCategoriesQuery = defineQuery(`
  *[_type == "settings"][0].documentaryCategories[] {
    title,
    "value": value.current
  }
`)

export const documentariesListingQuery = defineQuery(`
  *[_type == "documentaries" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    client,
    category,
    backgroundVideo ${videoFragment}
  }
`)

// ─────────────────────────────────────────────────────────────
// DOCUMENTARY DETAIL PAGE
// ─────────────────────────────────────────────────────────────

export const documentaryBySlugQuery = defineQuery(`
  *[_type == "documentaries" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    seoTitle,
    seoDescription,
    ogImage ${imageFragment},
    client,
    backgroundVideo ${videoFragment},
    documentariesBuilder ${pageBuilderFragment}
  }
`)

export const documentarySlugsQuery = defineQuery(`
  *[_type == "documentaries" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ─────────────────────────────────────────────────────────────
// CAMPAIGNS LISTING PAGE
// No client on cards — only name + backgroundVideo.
// ─────────────────────────────────────────────────────────────

export const campaignsListingQuery = defineQuery(`
  *[_type == "campaign"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    backgroundVideo ${videoFragment}
  }
`)

// ─────────────────────────────────────────────────────────────
// CAMPAIGN DETAIL PAGE
// ─────────────────────────────────────────────────────────────

export const campaignBySlugQuery = defineQuery(`
  *[_type == "campaign" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    seoTitle,
    seoDescription,
    ogImage ${imageFragment},
    backgroundVideo ${videoFragment},
    campaignBuilder ${pageBuilderFragment}
  }
`)

export const campaignSlugsQuery = defineQuery(`
  *[_type == "campaign" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ─────────────────────────────────────────────────────────────
// ANIMATIONS LISTING PAGE
// Same structure as documentaries — includes client on cards.
// ─────────────────────────────────────────────────────────────

export const animationCategoriesQuery = defineQuery(`
  *[_type == "settings"][0].animationCategories[] {
    title,
    "value": value.current
  }
`)

export const animationsListingQuery = defineQuery(`
  *[_type == "animation" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    client,
    category,
    backgroundVideo ${videoFragment}
  }
`)

// ─────────────────────────────────────────────────────────────
// ANIMATION DETAIL PAGE
// ─────────────────────────────────────────────────────────────

export const animationBySlugQuery = defineQuery(`
  *[_type == "animation" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    seoTitle,
    seoDescription,
    ogImage ${imageFragment},
    client,
    backgroundVideo ${videoFragment},
    animationBuilder ${pageBuilderFragment}
  }
`)

export const animationSlugsQuery = defineQuery(`
  *[_type == "animation" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ─────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0] {
    _id,
    seoTitle,
    seoDescription,
    ogImage ${imageFragment},
    aboutBuilder ${pageBuilderFragment}
  }
`)

// ─────────────────────────────────────────────────────────────
// SITEMAP
// All routable documents for next-sitemap or generateSitemaps().
// ─────────────────────────────────────────────────────────────

export const sitemapQuery = defineQuery(`
  *[_type in ["documentaries", "animation", "campaign"] && defined(slug.current)] {
    "slug": slug.current,
    _type,
    _updatedAt
  }
`)
