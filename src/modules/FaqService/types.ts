import type { IVoltpressFaqItem } from '../../types/model.js'

export interface IGetFaqListInput {
  placement?: string
  faq_category_id?: string
  page?: number
  items_per_page?: number
}

export type IGetFaqListOutput = IVoltpressFaqItem[]
