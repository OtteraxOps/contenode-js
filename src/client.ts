import type { VoltpressConfig } from './config.js'

const TOKEN_TTL_MS = 60 * 60 * 1000

interface OAuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export function createVoltpressFetch(config: VoltpressConfig) {
  const isDeliveryAuth = 'deliveryToken' in config

  let _cachedToken: string | null = null
  let _tokenExpiresAt: number = 0

  async function fetchAccessToken(): Promise<string> {
    const response = await fetch(`${config.apiUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: (config as { clientId: string; clientSecret: string }).clientId,
        client_secret: (config as { clientId: string; clientSecret: string }).clientSecret,
      }),
    })

    if (!response.ok) {
      throw new Error(`[voltpress/js] OAuth token request failed: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as OAuthTokenResponse
    return data.access_token
  }

  async function getAccessToken(): Promise<string> {
    if (_cachedToken && Date.now() < _tokenExpiresAt) {
      return _cachedToken
    }

    _cachedToken = await fetchAccessToken()
    _tokenExpiresAt = Date.now() + TOKEN_TTL_MS

    return _cachedToken
  }

  function buildAuthHeaders(token: string): Record<string, string> {
    if (isDeliveryAuth) {
      return { 'X-Delivery-Token': token }
    }
    return { Authorization: `Bearer ${token}` }
  }

  async function resolveToken(): Promise<string> {
    if (isDeliveryAuth) {
      return (config as { deliveryToken: string }).deliveryToken
    }
    return getAccessToken()
  }

  return async function voltpressFetch<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
    const token = await resolveToken()
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
        ...buildAuthHeaders(token),
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`[voltpress/js] Request failed: ${response.status} ${response.statusText} — ${url.toString()} | body: ${body}`)
    }

    return response.json() as Promise<T>
  }
}
