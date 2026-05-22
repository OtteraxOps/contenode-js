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
  blogPostService: () => blogPostService,
  configureVoltpress: () => configureVoltpress,
  faqService: () => faqService,
  isVoltpressConfigured: () => isVoltpressConfigured,
  teamMemberService: () => teamMemberService
});
module.exports = __toCommonJS(index_exports);

// src/config.ts
var _config = null;
function configureVoltpress(config) {
  _config = config;
}
function getVoltpressConfig() {
  if (!_config) {
    throw new Error(
      "[voltpress/js] Not configured. Call configureVoltpress({ apiUrl, clientId, clientSecret }) before using services."
    );
  }
  return _config;
}
function isVoltpressConfigured() {
  return _config !== null;
}

// src/client.ts
var TOKEN_TTL_MS = 60 * 60 * 1e3;
var _cachedToken = null;
var _tokenExpiresAt = 0;
async function fetchAccessToken() {
  const { apiUrl, clientId, clientSecret } = getVoltpressConfig();
  const response = await fetch(`${apiUrl}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  if (!response.ok) {
    throw new Error(`[voltpress/js] OAuth token request failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log("[voltpress] oauth response keys:", Object.keys(data));
  console.log("[voltpress] access_token length:", data.access_token?.length);
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
async function voltpressFetch(path, query) {
  const { apiUrl } = getVoltpressConfig();
  const token = await getAccessToken();
  console.log("[voltpress] sending token length:", token?.length, "| first 20:", token?.slice(0, 20));
  const url = new URL(`${apiUrl}${path}`);
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
}

// src/modules/FaqService/index.ts
var faqService = {
  async getFaqList(input = {}) {
    const response = await voltpressFetch("/api/faq/list", {
      placement: input.placement,
      faq_category_id: input.faq_category_id,
      page: input.page,
      items_per_page: input.items_per_page
    });
    return response.data.faqs;
  }
};

// src/modules/TeamMemberService/index.ts
var teamMemberService = {
  async getTeamMemberList(input = {}) {
    const response = await voltpressFetch(
      "/api/team-member/list",
      {
        page: input.page,
        items_per_page: input.items_per_page
      }
    );
    return response.data.team_members;
  }
};

// src/modules/BlogPostService/index.ts
var blogPostService = {
  async getBlogPostList(input = {}) {
    const response = await voltpressFetch(
      "/api/blog-post/list",
      {
        blog_category_id: input.blog_category_id,
        blog_tag_id: input.blog_tag_id,
        page: input.page,
        items_per_page: input.items_per_page,
        sort_by: input.sort_by,
        search: input.search
      }
    );
    console.log("[BlogPostService] response.data keys:", Object.keys(response.data));
    console.log("[BlogPostService] response.data sample:", JSON.stringify(response.data).slice(0, 300));
    const data = response.data;
    const blogPosts = data?.blog_posts ?? data?.data ?? data;
    return Array.isArray(blogPosts) ? blogPosts : blogPosts?.data ?? [];
  },
  async getBlogPostBySlug(input) {
    const response = await voltpressFetch(
      `/api/blog-post/${input.slug}`
    );
    return response.data.blog_post;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blogPostService,
  configureVoltpress,
  faqService,
  isVoltpressConfigured,
  teamMemberService
});
