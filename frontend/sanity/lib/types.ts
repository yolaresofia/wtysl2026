import {
  DocumentaryBySlugQueryResult,
  AnimationBySlugQueryResult,
  CampaignBySlugQueryResult,
  AboutPageQueryResult,
} from '@/sanity.types'

// Page builder item types for each content type
export type DocumentaryBuilderBlock = NonNullable<
  NonNullable<DocumentaryBySlugQueryResult>['documentariesBuilder']
>[number]

export type AnimationBuilderBlock = NonNullable<
  NonNullable<AnimationBySlugQueryResult>['animationBuilder']
>[number]

export type CampaignBuilderBlock = NonNullable<
  NonNullable<CampaignBySlugQueryResult>['campaignBuilder']
>[number]

export type AboutBuilderBlock = NonNullable<
  NonNullable<AboutPageQueryResult>['aboutBuilder']
>[number]

// Helper to narrow to a specific block type within a builder
export type ExtractBlock<TBlock, TType extends string> = Extract<TBlock, {_type: TType}>

// Represents a Link after GROQ dereferencing (internal refs resolved to slugs)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'email' | 'documentaries' | 'animation' | 'campaign'
  href?: string
  email?: string
  slug?: string | null
  openInNewTab?: boolean
}
