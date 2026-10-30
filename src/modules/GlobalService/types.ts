import type { IContenodeGlobal } from '../../types/collection.js'

export interface IGlobalGetInput {
  locale?: string
}

export interface IGlobalGetOutput<T> {
  global: IContenodeGlobal<T> | null
}
