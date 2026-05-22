// Standard Voltpress API envelope — data shape varies per endpoint
export interface IVoltpressApiResponse<T> {
  message: string
  data: T
}
