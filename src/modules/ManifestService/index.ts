import type { IContenodeApiResponse } from '../../types/index.js'
import type { IContenodeManifest } from './types.js'

type ContenodeFetch = <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>

export function createManifestService(fetch: ContenodeFetch) {
  return {
    async get(): Promise<IContenodeManifest> {
      const response = await fetch<IContenodeApiResponse<IContenodeManifest>>('/api/manifest')
      return response.data
    },
  }
}
