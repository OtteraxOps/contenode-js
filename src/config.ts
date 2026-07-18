import { createVoltpressFetch } from './client.js'
import { createCollectionService } from './modules/CollectionService/index.js'
import { createGlobalService } from './modules/GlobalService/index.js'

export interface VoltpressConfig {
  apiUrl: string
  clientId: string
  clientSecret: string
}

export function createVoltpress(config: VoltpressConfig) {
  const fetch = createVoltpressFetch(config)

  return {
    collection<T = Record<string, unknown>>(slug: string) {
      return createCollectionService<T>(slug, fetch)
    },
    global<T = Record<string, unknown>>(slug: string) {
      return createGlobalService<T>(slug, fetch)
    },
  }
}
