import type {Metadata} from 'next'

import ProjectBuilderPage from '@/app/components/ProjectBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getProjectQuery, projectsSlugs} from '@/sanity/lib/queries'
import {GetProjectQueryResult} from '@/sanity.types'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the project.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: projectsSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the project.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: project} = await sanityFetch({
    query: getProjectQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })

  return {
    title: project?.name,
    description: project?.heading,
  } satisfies Metadata
}

export default async function Project(props: Props) {
  const params = await props.params
  const [{data: project}] = await Promise.all([sanityFetch({query: getProjectQuery, params})])

  return (
    <div className="my-12 lg:my-24">
      <ProjectBuilderPage project={project as GetProjectQueryResult} />
    </div>
  )
}
