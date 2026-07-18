export interface IVoltpressCollectionEntry<T = Record<string, unknown>> {
  id: string
  slug: string
  title: string
  data: T
  sort_order: number
  status: 'draft' | 'published'
  published_at: string | null
}

export interface IVoltpressGlobal<T = Record<string, unknown>> {
  id: string
  data: T
  updated_at: string
}

export interface IVoltpressMedia {
  id: string
  name: string
  file_url: string
  thumbnail_url: string
  created_at: string
}

export interface IVoltpressPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
