> ⚠️ **HISTORICAL / SUPERSEDED** — Dated 2026-07-18. Describes an OAuth-based client-credentials auth flow (`clientId`/`clientSecret`) and a token cache that were removed (see commit `b108005`, "refactor(auth): delivery-token only — drop OAuth path") and type shapes (`IGlobalGetOutput`, `IVoltpressGlobal`) that were later changed. Does not mention `manifest.get()` or `collection().schema()`, which are now part of the API surface. Does not reflect the current SDK API. See [CLAUDE.md](../CLAUDE.md) for the current, accurate API reference.

# voltpress-js SDK v2 — Collections-First Refactor
> Created: 2026-07-18

## Context

voltpress-api is moving to a **collections-only public API**. All content types (blog posts, FAQ, team members, banners, etc.) will be managed as collections or globals. Dedicated routes (`/api/faq/list`, `/api/blog-post/list`, etc.) will be removed after rivarogroup.com migrates.

voltpress-js must reflect this — two services replace everything.

---

## What Changes

### Remove
| File | Reason |
|------|--------|
| `src/modules/BlogPostService/` | Dedicated route dying — becomes collection |
| `src/modules/FaqService/` | Same |
| `src/modules/TeamMemberService/` | Same |
| `src/types/model.ts` | All hardcoded model types replaced by generics |

### Add
| File | Purpose |
|------|---------|
| `src/modules/CollectionService/` | `list<T>()` + `find<T>()` for array collections |
| `src/modules/GlobalService/` | `get<T>()` for singleton globals |
| `src/types/collection.ts` | `IVoltpressCollectionEntry<T>`, `IVoltpressGlobal<T>`, `IVoltpressMedia`, `IVoltpressPaginationMeta` |

### Refactor
| File | Change |
|------|--------|
| `src/client.ts` | Strip debug `console.log` × 3; fetch + OAuth token cache move inside `createVoltpress()` closure — no module-level state |
| `src/config.ts` | Replace global singleton with `createVoltpress()` factory |
| `src/index.ts` | Export `createVoltpress()` + types only |

**Token cache:** `_cachedToken` + `_tokenExpiresAt` move from module-level variables into the `createVoltpress()` closure. Each instance has its own cache. Safe for concurrent requests — instance holds config + cache only, no request-specific state.

Keep:
- `src/types/block.ts` — `Block` type still needed for richtext fields in collection data

---

## New Public API

### Setup
```ts
import { createVoltpress } from '@voltpress/sdk'

const vp = createVoltpress({
  apiUrl: 'https://api.example.com',
  clientId: 'xxx',
  clientSecret: 'xxx',
})
```

### Collection (array)
```ts
// List
const { entries, meta } = await vp.collection('blog-posts').list({ locale: 'en', page: 1, items_per_page: 10 })

// With custom type
type BlogPostData = { title: string; body: Block[]; cover_image: string | null }
const { entries } = await vp.collection<BlogPostData>('blog-posts').list()

// Find by slug
const entry = await vp.collection<BlogPostData>('blog-posts').find('my-slug', { locale: 'en' })
```

### Global (singleton)
```ts
type HeroData = { headline: string; is_visible: boolean }
const global = await vp.global<HeroData>('homepage-hero').get({ locale: 'en' })
// global.data → typed as HeroData
```

---

## Types

### `IVoltpressCollectionEntry<T>`
```ts
interface IVoltpressCollectionEntry<T = Record<string, unknown>> {
  id: string
  slug: string
  title: string
  data: T
  sort_order: number
  status: 'draft' | 'published'
  published_at: string | null
}
```

### `IVoltpressGlobal<T>`
```ts
interface IVoltpressGlobal<T = Record<string, unknown>> {
  id: string
  data: T
  updated_at: string
}
```

### `IVoltpressMedia`
```ts
interface IVoltpressMedia {
  id: string
  name: string
  file_url: string
  thumbnail_url: string
  created_at: string
}
```

### `IVoltpressPaginationMeta`
```ts
interface IVoltpressPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
```

---

## CollectionService Input/Output

```ts
interface ICollectionListInput {
  locale?: string
  page?: number
  items_per_page?: number
  search?: string
  sort_by?: string
  status?: 'draft' | 'published'
  [key: string]: string | number | undefined  // field[x]=value filters
}

interface ICollectionListOutput<T> {
  locale: string | null
  entries: IVoltpressCollectionEntry<T>[]
  meta: IVoltpressPaginationMeta
}

interface ICollectionFindInput {
  locale?: string
  depth?: 0 | 1  // relation field depth; default 1
}
```

---

## GlobalService Input/Output

```ts
interface IGlobalGetInput {
  locale?: string
}

interface IGlobalGetOutput<T> {
  collection: { id: string; name: string; slug: string; fields: unknown[] }
  entry: IVoltpressGlobal<T> | null
}
```

---

## File Structure After

```
src/
├── client.ts                        # voltpressFetch — instance method, no singleton
├── config.ts                        # createVoltpress() factory
├── index.ts                         # exports
├── types/
│   ├── block.ts                     # Block, Mark, InlineContent, TableRow — unchanged
│   ├── collection.ts                # IVoltpressCollectionEntry<T>, IVoltpressGlobal<T>, IVoltpressMedia, IVoltpressPaginationMeta
│   └── index.ts                     # IVoltpressApiResponse
└── modules/
    ├── CollectionService/
    │   ├── index.ts
    │   └── types.ts
    └── GlobalService/
        ├── index.ts
        └── types.ts
```

---

## Migration Impact

### rivarogroup.com
After voltpress-api removes dedicated routes, migrate `server/httpClients/voltpress/` to use `vp.collection()`.

**Nuxt wiring pattern** — `server/utils/voltpress.ts` (auto-imported, no explicit imports needed):
```ts
// server/utils/voltpress.ts
let _vp: ReturnType<typeof createVoltpress> | null = null
export function initVoltpress(config: VoltpressConfig) { _vp = createVoltpress(config) }
export function useVoltpress() {
  if (!_vp) throw new Error('[voltpress] not initialized')
  return _vp
}

// server/plugins/voltpress.ts
export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  initVoltpress({ apiUrl: config.voltpressApiUrl, clientId: config.voltpressClientId, clientSecret: config.voltpressClientSecret })
})

// server/api/blog-post/list.get.ts
export default defineEventHandler(async () => {
  return useVoltpress().collection('blog-posts').list()
})
```

| Old | New |
|-----|-----|
| `blogPostService.getBlogPostList()` | `vp.collection<BlogPostData>('blog-posts').list()` |
| `blogPostService.getBlogPostBySlug(slug)` | `vp.collection<BlogPostData>('blog-posts').find(slug)` |
| `faqService.getFaqList()` | `vp.collection<FaqData>('faq-items').list()` |
| `teamMemberService.getTeamMemberList()` | `vp.collection<TeamMemberData>('team-members').list()` |

Nitro plugin stays the same — `configureVoltpress()` → `createVoltpress()` (rename only).

### voltpress-nuxt-template (future personal repo)
Built on top of voltpress-js v2. No backward compat concern — greenfield.

---

## Out of Scope

- camelCase transform — no, keep snake_case (matches API docs)
- CLI codegen (`npx @voltpress/sdk codegen`) — Phase 3, needs `GET /api/schema` BE endpoint
- voltpress-nuxt module — future personal template repo

---

## Implementation Order

1. `src/config.ts` → `createVoltpress()` factory, returns instance
2. `src/client.ts` → strip logs, move fetch to instance method
3. `src/types/collection.ts` → new types
4. `src/modules/CollectionService/` → `list()` + `find()`
5. `src/modules/GlobalService/` → `get()`
6. `src/index.ts` → clean exports
7. Delete `src/modules/BlogPostService/`, `FaqService/`, `TeamMemberService/`, `src/types/model.ts`
8. Build + verify types compile
