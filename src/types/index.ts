// Standard Contenode API envelope — data shape varies per endpoint
export interface IContenodeApiResponse<T> {
  message: string
  data: T
}
