import type { IContenodeApiResponse } from '../../types/index.js'
import type { IGlobalGetInput, IGlobalGetOutput } from './types.js'

type ContenodeFetch = <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>

export function createGlobalService<T = Record<string, unknown>>(slug: string, fetch: ContenodeFetch) {
  return {
    async get(input: IGlobalGetInput = {}): Promise<IGlobalGetOutput<T>> {
      const response = await fetch<IContenodeApiResponse<IGlobalGetOutput<T>>>(
        `/api/global/${slug}`,
        input as Record<string, string | number | undefined>,
      )

      return response.data
    },
  }
}
