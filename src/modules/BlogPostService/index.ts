import { voltpressFetch } from '../../client.js'
import type { IVoltpressApiResponse } from '../../types/index.js'
import type { IVoltpressBlogPostListItem, IVoltpressBlogPostDetail } from '../../types/model.js'
import type { IGetBlogPostListInput, IGetBlogPostListOutput, IGetBlogPostBySlugInput, IGetBlogPostBySlugOutput } from './types.js'

export const blogPostService = {
  async getBlogPostList(input: IGetBlogPostListInput = {}): Promise<IGetBlogPostListOutput> {
    const response = await voltpressFetch<IVoltpressApiResponse<{ blog_posts: IVoltpressBlogPostListItem[] }>>(
      '/api/blog-post/list',
      {
        blog_category_id: input.blog_category_id,
        blog_tag_id: input.blog_tag_id,
        page: input.page,
        items_per_page: input.items_per_page,
        sort_by: input.sort_by,
        search: input.search,
        is_featured: input.is_featured !== undefined ? Number(input.is_featured) : undefined,
      },
    )

    return response.data.blog_posts ?? []
  },

  async getBlogPostBySlug(input: IGetBlogPostBySlugInput): Promise<IGetBlogPostBySlugOutput> {
    const response = await voltpressFetch<IVoltpressApiResponse<{ blog_post: IVoltpressBlogPostDetail }>>(
      `/api/blog-post/${input.slug}`,
      {
        related_posts_limit: input.related_posts_limit,
      },
    )

    return response.data.blog_post
  },
}
