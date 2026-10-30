import type { ContenodeConfig } from './config.js'

export function createContenodeFetch(config: ContenodeConfig) {
  return async function contenodeFetch<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
    const token = (config as { deliveryToken: string }).deliveryToken
    const url = new URL(`${config.apiUrl}${path}`)

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-Delivery-Token': token,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`[contenode/js] Request failed: ${response.status} ${response.statusText} — ${url.toString()} | body: ${body}`)
    }

    return response.json() as Promise<T>
  }
}
