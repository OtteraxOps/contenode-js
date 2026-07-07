import type { Block } from './block.js'

// Raw shapes matching Voltpress PHP Resource classes exactly

export interface IVoltpressModelableFile {
  id: string
  name: string
  thumbnail_url: string
  file_url: string
  created_at: string
}

export interface IVoltpressFaqCategory {
  id: string
  name: string
  slug: string
  sort_order: number
}

export interface IVoltpressFaqItem {
  id: string
  faq_category_id: string | null
  question: string
  answer: string
  sort_order: number
  category?: IVoltpressFaqCategory
}

export interface IVoltpressTeamMember {
  id: string
  name: string
  role_title: string
  bio: string
  meta: Record<string, unknown> | null
  sort_order: number
  image: IVoltpressModelableFile
}

export interface IVoltpressBlogCategory {
  id: string
  name: string
  slug: string
}

export interface IVoltpressBlogTag {
  id: string
  name: string
}

export interface IVoltpressBlogPostAuthor {
  id: string
  name: string
  role_title: string | null
  image: IVoltpressModelableFile | null
}

export interface IVoltpressBlogPostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  reading_time_minutes: number | null
  published_at: string | null
  view_count: number
  is_featured: boolean
  author: IVoltpressBlogPostAuthor | null
  /** First attached category acts as the primary one */
  category: IVoltpressBlogCategory | null
  categories?: IVoltpressBlogCategory[]
  tags?: string[]
}

export interface IVoltpressBlogPostDetail extends IVoltpressBlogPostListItem {
  /** Reserved for a future server-rendered HTML mode; always null today */
  content: string | null
  blocks: Block[] | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
}
