// src/client.ts
function createVoltpressFetch(config) {
  return async function voltpressFetch(path, query) {
    const token = config.deliveryToken;
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
        "X-Delivery-Token": token,
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
export {
  createVoltpress
};
