// src/client.ts
var TOKEN_TTL_MS = 60 * 60 * 1e3;
function createVoltpressFetch(config) {
  let _cachedToken = null;
  let _tokenExpiresAt = 0;
  async function fetchAccessToken() {
    const response = await fetch(`${config.apiUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: config.clientId,
        client_secret: config.clientSecret
      })
    });
    if (!response.ok) {
      throw new Error(`[voltpress/js] OAuth token request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.access_token;
  }
  async function getAccessToken() {
    if (_cachedToken && Date.now() < _tokenExpiresAt) {
      return _cachedToken;
    }
    _cachedToken = await fetchAccessToken();
    _tokenExpiresAt = Date.now() + TOKEN_TTL_MS;
    return _cachedToken;
  }
  return async function voltpressFetch(path, query) {
    const token = await getAccessToken();
    const url = new URL(`${config.apiUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== void 0) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`[voltpress/js] Request failed: ${response.status} ${response.statusText} \u2014 ${url.toString()} | body: ${body}`);
    }
    return response.json();
  };
}

// src/modules/CollectionService/index.ts
function createCollectionService(slug, fetch2) {
  return {
    async list(input = {}) {
      const response = await fetch2(
        `/api/collection/${slug}/list`,
        input
      );
      return response.data;
    },
    async find(entrySlug, input = {}) {
      const response = await fetch2(
        `/api/collection/${slug}/${entrySlug}`,
        input
      );
      return response.data;
    }
  };
}

// src/modules/GlobalService/index.ts
function createGlobalService(slug, fetch2) {
  return {
    async get(input = {}) {
      const response = await fetch2(
        `/api/global/${slug}`,
        input
      );
      return response.data;
    }
  };
}

// src/config.ts
function createVoltpress(config) {
  const fetch2 = createVoltpressFetch(config);
  return {
    collection(slug) {
      return createCollectionService(slug, fetch2);
    },
    global(slug) {
      return createGlobalService(slug, fetch2);
    }
  };
}
export {
  createVoltpress
};
