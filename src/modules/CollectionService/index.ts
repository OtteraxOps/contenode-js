import type { IVoltpressApiResponse } from '../../types/index.js'
import type { IVoltpressCollectionEntry } from '../../types/collection.js'
import type { ICollectionListInput, ICollectionListOutput, ICollectionFindInput } from './types.js'

type VoltpressFetch = <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>

export function createCollectionService<T = Record<string, unknown>>(slug: string, fetch: VoltpressFetch) {
  return {
    async list(input: ICollectionListInput = {}): Promise<ICollectionListOutput<T>> {
      const response = await fetch<IVoltpressApiResponse<ICollectionListOutput<T>>>(
        `/api/collection/${slug}/list`,
        input as Record<string, string | number | undefined>,
      )

      return response.data
    },

    async find(entrySlug: string, input: ICollectionFindInput = {}): Promise<IVoltpressCollectionEntry<T>> {
      const response = await fetch<IVoltpressApiResponse<IVoltpressCollectionEntry<T>>>(
        `/api/collection/${slug}/${entrySlug}`,
        input as Record<string, string | number | undefined>,
      )

      return response.data
    },
  }
}
