import { voltpressFetch } from '../../client.js'
import type { IVoltpressApiResponse } from '../../types/index.js'
import type { IVoltpressFaqItem } from '../../types/model.js'
import type { IGetFaqListInput, IGetFaqListOutput } from './types.js'

export const faqService = {
  async getFaqList(input: IGetFaqListInput = {}): Promise<IGetFaqListOutput> {
    const response = await voltpressFetch<IVoltpressApiResponse<{ faqs: IVoltpressFaqItem[] }>>('/api/faq/list', {
      placement: input.placement,
      faq_category_id: input.faq_category_id,
      page: input.page,
      items_per_page: input.items_per_page,
    })

    return response.data.faqs
  },
}
