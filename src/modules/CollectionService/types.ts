import type { IContenodeCollectionEntry, IContenodePaginationMeta } from '../../types/collection.js'

export interface ICollectionListInput {
  locale?: string
  page?: number
  items_per_page?: number
  search?: string
  sort_by?: string
  status?: 'draft' | 'published'
  [key: string]: string | number | undefined
}

export interface ICollectionListOutput<T> {
  locale: string | null
  entries: IContenodeCollectionEntry<T>[]
  meta: IContenodePaginationMeta
}

export interface ICollectionFindInput {
  locale?: string
  depth?: 0 | 1
}

export interface ICollectionSchemaOutput {
  schema: {
    slug: string
    name: string
    kind: 'collection'
    fields: Record<string, unknown>[]
  }
}
