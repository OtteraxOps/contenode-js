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
  slug: string
}

export interface IVoltpressBlogPostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string | null
  view_count: number
  is_featured: boolean
  author: { id: string; name: string; slug: string } | null
  category: IVoltpressBlogCategory | null
  tags: string[]
  image: IVoltpressModelableFile | null
}

export interface IVoltpressBlogPostDetail extends IVoltpressBlogPostListItem {
  content: string | null
  blocks: Block[] | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  related_posts: IVoltpressBlogPostListItem[]
}
