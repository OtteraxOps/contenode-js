"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createVoltpress: () => createVoltpress
});
module.exports = __toCommonJS(index_exports);

// src/client.ts
var TOKEN_TTL_MS = 60 * 60 * 1e3;
function createVoltpressFetch(config) {
  const isDeliveryAuth = "deliveryToken" in config;
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
  function buildAuthHeaders(token) {
    if (isDeliveryAuth) {
      return { "X-Delivery-Token": token };
    }
    return { Authorization: `Bearer ${token}` };
  }
  async function resolveToken() {
    if (isDeliveryAuth) {
      return config.deliveryToken;
    }
    return getAccessToken();
  }
  return async function voltpressFetch(path, query) {
    const token = await resolveToken();
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
        ...buildAuthHeaders(token),
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
        `/api/collection/${slug}/entries`,
        input
      );
      return response.data;
    },
    async find(entrySlug, input = {}) {
      const response = await fetch2(
        `/api/collection/${slug}/entries/${entrySlug}`,
        input
      );
      const data = response.data;
      return data?.entry ?? data;
    },
    async schema() {
      const response = await fetch2(
        `/api/collection/${slug}/schema`
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

// src/modules/ManifestService/index.ts
function createManifestService(fetch2) {
  return {
    async get() {
      const response = await fetch2("/api/manifest");
      return response.data;
    }
  };
}

// src/config.ts
function createVoltpress(config) {
  const fetch2 = createVoltpressFetch(config);
  const manifestService = createManifestService(fetch2);
  return {
    manifest: manifestService,
    collection(slug) {
      return createCollectionService(slug, fetch2);
    },
    global(slug) {
      return createGlobalService(slug, fetch2);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createVoltpress
});
