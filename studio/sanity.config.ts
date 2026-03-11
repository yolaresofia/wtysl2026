/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {vercelDeployPlugin} from './src/plugins/vercelDeploy'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// resolveHref() maps document types to their frontend URLs
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'documentaries':
      return slug ? `/documentaries/${slug}` : '/documentaries'
    case 'campaign':
      return slug ? `/campaigns/${slug}` : '/campaigns'
    case 'animation':
      return slug ? `/animations/${slug}` : '/animations'
    case 'aboutPage':
      return '/about'
    case 'contact':
      return '/contact'
    default:
      return undefined
  }
}

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'WTYSL',

  projectId,
  dataset,

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      allowOrigins: [
        'http://localhost:3000',
        'https://wtysl2026-frontend.vercel.app',
      ],
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/about',
            filter: `_type == "aboutPage" && _id == "aboutPage"`,
          },
          {
            route: '/contact',
            filter: `_type == "contact" && _id == "contact"`,
          },
          {
            route: '/documentaries/:slug',
            filter: `_type == "documentaries" && slug.current == $slug`,
          },
          {
            route: '/campaigns/:slug',
            filter: `_type == "campaign" && slug.current == $slug`,
          },
          {
            route: '/animations/:slug',
            filter: `_type == "animation" && slug.current == $slug`,
          },
        ]),
        locations: {
          aboutPage: defineLocations({
            locations: [{title: 'About', href: '/about'}],
            message: 'This document is used on the About page',
            tone: 'positive',
          }),
          contact: defineLocations({
            locations: [{title: 'Contact', href: '/contact'}],
            message: 'This document is used on the Contact page',
            tone: 'positive',
          }),
          documentaries: defineLocations({
            select: {name: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug
                  ? [{title: doc?.name || 'Untitled', href: resolveHref('documentaries', doc.slug)!}]
                  : []),
                {title: 'Documentaries', href: '/documentaries'},
              ],
            }),
          }),
          campaign: defineLocations({
            select: {name: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug
                  ? [{title: doc?.name || 'Untitled', href: resolveHref('campaign', doc.slug)!}]
                  : []),
                {title: 'Campaigns', href: '/campaigns'},
              ],
            }),
          }),
          animation: defineLocations({
            select: {name: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug
                  ? [{title: doc?.name || 'Untitled', href: resolveHref('animation', doc.slug)!}]
                  : []),
                {title: 'Animations', href: '/animations'},
              ],
            }),
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    vercelDeployPlugin(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
})
