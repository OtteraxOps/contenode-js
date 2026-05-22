import { getVoltpressConfig } from './config.js'

const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

let _cachedToken: string | null = null
let _tokenExpiresAt: number = 0

interface OAuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

async function fetchAccessToken(): Promise<string> {
  const { apiUrl, clientId, clientSecret } = getVoltpressConfig()

  const response = await fetch(`${apiUrl}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error(`[voltpress/js] OAuth token request failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as OAuthTokenResponse
  console.log('[voltpress] oauth response keys:', Object.keys(data))
  console.log('[voltpress] access_token length:', data.access_token?.length)
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

export async function voltpressFetch<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
  const { apiUrl } = getVoltpressConfig()
  const token = await getAccessToken()
  console.log('[voltpress] sending token length:', token?.length, '| first 20:', token?.slice(0, 20))

  const url = new URL(`${apiUrl}${path}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`[voltpress/js] Request failed: ${response.status} ${response.statusText} — ${url.toString()} | body: ${body}`)
  }

  return response.json() as Promise<T>
}
