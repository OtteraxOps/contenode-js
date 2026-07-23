import type { IVoltpressApiResponse } from '../../types/index.js'
import type { IVoltpressManifest } from './types.js'

type VoltpressFetch = <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>

export function createManifestService(fetch: VoltpressFetch) {
  return {
    async get(): Promise<IVoltpressManifest> {
      const response = await fetch<IVoltpressApiResponse<IVoltpressManifest>>('/api/manifest')
      return response.data
    },
  }
}
