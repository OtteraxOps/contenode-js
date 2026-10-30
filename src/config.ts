import { createContenodeFetch } from './client.js'
import { createCollectionService } from './modules/CollectionService/index.js'
import { createGlobalService } from './modules/GlobalService/index.js'
import { createManifestService } from './modules/ManifestService/index.js'

export type ContenodeConfig = { apiUrl: string; deliveryToken: string }

export function createContenode(config: ContenodeConfig) {
  const fetch = createContenodeFetch(config)
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
