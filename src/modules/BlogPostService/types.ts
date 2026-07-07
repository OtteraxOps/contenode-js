import type { IVoltpressBlogPostListItem, IVoltpressBlogPostDetail } from '../../types/model.js'

export interface IGetBlogPostListInput {
  blog_category_id?: string
  blog_tag_id?: string
  page?: number
  items_per_page?: number
  sort_by?: string
  search?: string
  is_featured?: boolean
}

export type IGetBlogPostListOutput = IVoltpressBlogPostListItem[]

export interface IGetBlogPostBySlugInput {
  slug: string
  related_posts_limit?: number
}

export type IGetBlogPostBySlugOutput = IVoltpressBlogPostDetail
