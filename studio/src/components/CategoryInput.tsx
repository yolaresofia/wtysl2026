import React, {useEffect, useState} from 'react'
import {StringInputProps, useClient} from 'sanity'

type Cat = {title: string; value: string}

export function DocumentaryCategoryInput(props: StringInputProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [cats, setCats] = useState<Cat[]>([])

  useEffect(() => {
    client
      .fetch<Array<{title: string; value: {current: string}}>>(
        `*[_type == "settings"][0].documentaryCategories[]{ title, value }`,
      )
      .then((data) =>
        setCats((data ?? []).map((c) => ({title: c.title, value: c.value?.current ?? ''}))),
      )
  }, [client])

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      options: {...(props.schemaType.options ?? {}), list: cats, layout: 'radio'},
    },
  })
}

export function AnimationCategoryInput(props: StringInputProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [cats, setCats] = useState<Cat[]>([])

  useEffect(() => {
    client
      .fetch<Array<{title: string; value: {current: string}}>>(
        `*[_type == "settings"][0].animationCategories[]{ title, value }`,
      )
      .then((data) =>
        setCats((data ?? []).map((c) => ({title: c.title, value: c.value?.current ?? ''}))),
      )
  }, [client])

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      options: {...(props.schemaType.options ?? {}), list: cats, layout: 'radio'},
    },
  })
}
