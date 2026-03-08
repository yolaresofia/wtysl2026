import type {CustomValidator} from 'sanity'

const MB = 1024 * 1024

export const maxVideoSize: CustomValidator = async (value: any, context) => {
  if (!value?.asset?._ref) return true
  const client = context.getClient({apiVersion: '2024-01-01'})
  const size = await client.fetch<number>(`*[_id == $id][0].size`, {id: value.asset._ref})
  if (size > 10 * MB) return `Video must be under 10 MB (uploaded: ${(size / MB).toFixed(1)} MB)`
  return true
}

export const maxImageSize: CustomValidator = async (value: any, context) => {
  if (!value?.asset?._ref) return true
  const client = context.getClient({apiVersion: '2024-01-01'})
  const size = await client.fetch<number>(`*[_id == $id][0].size`, {id: value.asset._ref})
  if (size > 5 * MB) return `Image must be under 5 MB (uploaded: ${(size / MB).toFixed(1)} MB)`
  return true
}
