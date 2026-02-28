'use client'

import {SanityDocument} from 'next-sanity'
import {useOptimistic} from 'next-sanity/hooks'

import BlockRenderer from '@/app/components/BlockRenderer'
import {GetProjectQueryResult} from '@/sanity.types'
import {dataAttr} from '@/sanity/lib/utils'
import {ProjectBuilderSection} from '@/sanity/lib/types'

type ProjectBuilderProjectProps = {
  project: GetProjectQueryResult
}

type ProjectData = {
  _id: string
  _type: string
  projectBuilder?: ProjectBuilderSection[]
}

/**
 * The ProjectBuilder component is used to render the blocks from the `projectBuilder` field in the Project type in your Sanity Studio.
 */

function RenderSections({
  projectBuilderSections,
  project,
}: {
  projectBuilderSections: ProjectBuilderSection[]
  project: GetProjectQueryResult
}) {
  if (!project) {
    return null
  }
  return (
    <div
      data-sanity={dataAttr({
        id: project._id,
        type: project._type,
        path: `projectBuilder`,
      }).toString()}
    >
      {projectBuilderSections.map((block: ProjectBuilderSection, index: number) => (
        <BlockRenderer
          key={block._key}
          index={index}
          block={block}
          projectId={project._id}
          projectType={project._type}
        />
      ))}
    </div>
  )
}

function RenderEmptyState({project}: {project: GetProjectQueryResult}) {
  if (!project) {
    return null
  }

  return (
    <div
      className="container mt-10"
      data-sanity={dataAttr({
        id: project._id,
        type: 'project',
        path: `projectBuilder`,
      }).toString()}
    >
      <div className="prose">
        <h2 className="">This project has no content!</h2>
        <p className="">Open the project in Sanity Studio to add content.</p>
      </div>
    </div>
  )
}

export default function ProjectBuilder({project}: ProjectBuilderProjectProps) {
  const projectBuilderSections = useOptimistic<
    ProjectBuilderSection[] | undefined,
    SanityDocument<ProjectData>
  >(project?.projectBuilder || [], (currentSections, action) => {
    // The action contains updated document data from Sanity
    // when someone makes an edit in the Studio

    // If the edit was to a different document, ignore it
    if (action.id !== project?._id) {
      return currentSections
    }

    // If there are sections in the updated document, use them
    if (action.document.projectBuilder) {
      // Reconcile References. https://www.sanity.io/docs/enabling-drag-and-drop#ffe728eea8c1
      return action.document.projectBuilder.map(
        (section) => currentSections?.find((s) => s._key === section?._key) || section,
      )
    }

    // Otherwise keep the current sections
    return currentSections
  })

  return projectBuilderSections && projectBuilderSections.length > 0 ? (
    <RenderSections projectBuilderSections={projectBuilderSections} project={project} />
  ) : (
    <RenderEmptyState project={project} />
  )
}
