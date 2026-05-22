// Config
export { configureVoltpress, isVoltpressConfigured } from './config.js'
export type { VoltpressConfig } from './config.js'

// Types — API envelopes
export type { IVoltpressApiResponse } from './types/index.js'

// Types — block content
export type { Block, Mark, InlineContent, TableRow } from './types/block.js'

// Types — models (raw API shapes)
export type {
  IVoltpressModelableFile,
  IVoltpressFaqCategory,
  IVoltpressFaqItem,
  IVoltpressTeamMember,
  IVoltpressBlogCategory,
  IVoltpressBlogTag,
  IVoltpressBlogPostListItem,
  IVoltpressBlogPostDetail,
} from './types/model.js'

// Services
export { faqService } from './modules/FaqService/index.js'
export type { IGetFaqListInput, IGetFaqListOutput } from './modules/FaqService/types.js'

export { teamMemberService } from './modules/TeamMemberService/index.js'
export type { IGetTeamMemberListInput, IGetTeamMemberListOutput } from './modules/TeamMemberService/types.js'

export { blogPostService } from './modules/BlogPostService/index.js'
export type { IGetBlogPostListInput, IGetBlogPostListOutput, IGetBlogPostBySlugInput, IGetBlogPostBySlugOutput } from './modules/BlogPostService/types.js'
