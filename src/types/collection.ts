export interface IContenodeCollectionEntry<T = Record<string, unknown>> {
  id: string
  slug: string
  title: string
  data: T
  sort_order: number
  status: 'draft' | 'published'
  published_at: string | null
}

export type IContenodeGlobal<T = Record<string, unknown>> = T & {
  updated_at: string
}

export interface IContenodeMedia {
  id: string
  name: string
  file_url: string
  thumbnail_url: string
  created_at: string
}

export interface IContenodePaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
