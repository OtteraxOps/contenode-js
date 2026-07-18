import type { IVoltpressGlobal } from '../../types/collection.js'

export interface IGlobalGetInput {
  locale?: string
}

export interface IGlobalGetOutput<T> {
  collection: { id: string; name: string; slug: string; fields: unknown[] }
  entry: IVoltpressGlobal<T> | null
}
