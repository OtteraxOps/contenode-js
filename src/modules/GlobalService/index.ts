import type { IVoltpressApiResponse } from '../../types/index.js'
import type { IGlobalGetInput, IGlobalGetOutput } from './types.js'

type VoltpressFetch = <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>

export function createGlobalService<T = Record<string, unknown>>(slug: string, fetch: VoltpressFetch) {
  return {
    async get(input: IGlobalGetInput = {}): Promise<IGlobalGetOutput<T>> {
      const response = await fetch<IVoltpressApiResponse<IGlobalGetOutput<T>>>(
        `/api/global/${slug}`,
        input as Record<string, string | number | undefined>,
      )

      return response.data
    },
  }
}
