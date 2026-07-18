export { createVoltpress } from './config.js'
export type { VoltpressConfig } from './config.js'

export type { IVoltpressApiResponse } from './types/index.js'

export type { Block, Mark, InlineContent, TableRow } from './types/block.js'

export type {
  IVoltpressCollectionEntry,
  IVoltpressGlobal,
  IVoltpressMedia,
  IVoltpressPaginationMeta,
} from './types/collection.js'

export type { ICollectionListInput, ICollectionListOutput, ICollectionFindInput } from './modules/CollectionService/types.js'

export type { IGlobalGetInput, IGlobalGetOutput } from './modules/GlobalService/types.js'
