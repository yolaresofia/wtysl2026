import {GetProjectQueryResult} from '@/sanity.types'

export type ProjectBuilderSection = NonNullable<NonNullable<GetProjectQueryResult>['projectBuilder']>[number]
export type ExtractProjectBuilderType<T extends ProjectBuilderSection['_type']> = Extract<
  ProjectBuilderSection,
  {_type: T}
>

// Represents a Link after GROQ dereferencing (project become slug strings)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'project'
  href?: string
  project?: string | null
  openInNewTab?: boolean
}
