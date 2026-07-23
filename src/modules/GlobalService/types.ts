import type { IVoltpressGlobal } from '../../types/collection.js'

export interface IGlobalGetInput {
  locale?: string
}

export interface IGlobalGetOutput<T> {
  global: IVoltpressGlobal<T> | null
}
