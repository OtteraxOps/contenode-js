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
  createContenode: () => createContenode
});
module.exports = __toCommonJS(index_exports);

// src/client.ts
function createContenodeFetch(config) {
  return async function contenodeFetch(path, query) {
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
      throw new Error(`[contenode/js] Request failed: ${response.status} ${response.statusText} \u2014 ${url.toString()} | body: ${body}`);
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
function createContenode(config) {
  const fetch2 = createContenodeFetch(config);
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
  createContenode
});
