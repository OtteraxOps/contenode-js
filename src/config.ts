import { createVoltpressFetch } from './client.js'
import { createCollectionService } from './modules/CollectionService/index.js'
import { createGlobalService } from './modules/GlobalService/index.js'
import { createManifestService } from './modules/ManifestService/index.js'

export type VoltpressConfig = { apiUrl: string; deliveryToken: string }

export function createVoltpress(config: VoltpressConfig) {
  const fetch = createVoltpressFetch(config)
  const manifestService = createManifestService(fetch)

  return {
    manifest: manifestService,
    collection<T = Record<string, unknown>>(slug: string) {
      return createCollectionService<T>(slug, fetch)
    },
    global<T = Record<string, unknown>>(slug: string) {
      return createGlobalService<T>(slug, fetch)
    },
  }
}
