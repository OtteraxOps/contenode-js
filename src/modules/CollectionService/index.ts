import type { IContenodeApiResponse } from '../../types/index.js'
import type { IContenodeCollectionEntry } from '../../types/collection.js'
import type { ICollectionListInput, ICollectionListOutput, ICollectionFindInput, ICollectionSchemaOutput } from './types.js'

type ContenodeFetch = <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>

export function createCollectionService<T = Record<string, unknown>>(slug: string, fetch: ContenodeFetch) {
  return {
    async list(input: ICollectionListInput = {}): Promise<ICollectionListOutput<T>> {
      const response = await fetch<IContenodeApiResponse<ICollectionListOutput<T>>>(
        `/api/collection/${slug}/entries`,
        input as Record<string, string | number | undefined>,
      )

      return response.data
    },

    async find(entrySlug: string, input: ICollectionFindInput = {}): Promise<IContenodeCollectionEntry<T>> {
      const response = await fetch<IContenodeApiResponse<{ entry: IContenodeCollectionEntry<T> } | IContenodeCollectionEntry<T>>>(
        `/api/collection/${slug}/entries/${entrySlug}`,
        input as Record<string, string | number | undefined>,
      )

      // API wraps entry under data.entry; fall back to data directly for older responses
      const data = response.data as any
      return data?.entry ?? data
    },

    async schema(): Promise<ICollectionSchemaOutput> {
      const response = await fetch<IContenodeApiResponse<ICollectionSchemaOutput>>(
        `/api/collection/${slug}/schema`,
      )

      return response.data
    },
  }
}
