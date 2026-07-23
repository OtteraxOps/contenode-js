import type { IVoltpressApiResponse } from '../../types/index.js'
import type { IVoltpressCollectionEntry } from '../../types/collection.js'
import type { ICollectionListInput, ICollectionListOutput, ICollectionFindInput, ICollectionSchemaOutput } from './types.js'

type VoltpressFetch = <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>

export function createCollectionService<T = Record<string, unknown>>(slug: string, fetch: VoltpressFetch) {
  return {
    async list(input: ICollectionListInput = {}): Promise<ICollectionListOutput<T>> {
      const response = await fetch<IVoltpressApiResponse<ICollectionListOutput<T>>>(
        `/api/collection/${slug}/entries`,
        input as Record<string, string | number | undefined>,
      )

      return response.data
    },

    async find(entrySlug: string, input: ICollectionFindInput = {}): Promise<IVoltpressCollectionEntry<T>> {
      const response = await fetch<IVoltpressApiResponse<IVoltpressCollectionEntry<T>>>(
        `/api/collection/${slug}/entries/${entrySlug}`,
        input as Record<string, string | number | undefined>,
      )

      return response.data
    },

    async schema(): Promise<ICollectionSchemaOutput> {
      const response = await fetch<IVoltpressApiResponse<ICollectionSchemaOutput>>(
        `/api/collection/${slug}/schema`,
      )

      return response.data
    },
  }
}
