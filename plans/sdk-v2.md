> ⚠️ **HISTORICAL / SUPERSEDED** — Dated 2026-07-18. Describes an OAuth-based client-credentials auth flow (`clientId`/`clientSecret`) and a token cache that were removed (see commit `b108005`, "refactor(auth): delivery-token only — drop OAuth path") and type shapes (`IGlobalGetOutput`, `IContenodeGlobal`) that were later changed. Does not mention `manifest.get()` or `collection().schema()`, which are now part of the API surface. Does not reflect the current SDK API. See [CLAUDE.md](../CLAUDE.md) for the current, accurate API reference.

# contenode-js SDK v2 — Collections-First Refactor
> Created: 2026-07-18

## Context

contenode-api is moving to a **collections-only public API**. All content types (blog posts, FAQ, team members, banners, etc.) will be managed as collections or globals. Dedicated routes (`/api/faq/list`, `/api/blog-post/list`, etc.) will be removed after existing consumers migrate.

contenode-js must reflect this — two services replace everything.

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
| `src/types/collection.ts` | `IContenodeCollectionEntry<T>`, `IContenodeGlobal<T>`, `IContenodeMedia`, `IContenodePaginationMeta` |

### Refactor
| File | Change |
|------|--------|
| `src/client.ts` | Strip debug `console.log` × 3; fetch + OAuth token cache move inside `createContenode()` closure — no module-level state |
| `src/config.ts` | Replace global singleton with `createContenode()` factory |
| `src/index.ts` | Export `createContenode()` + types only |

**Token cache:** `_cachedToken` + `_tokenExpiresAt` move from module-level variables into the `createContenode()` closure. Each instance has its own cache. Safe for concurrent requests — instance holds config + cache only, no request-specific state.

Keep:
- `src/types/block.ts` — `Block` type still needed for richtext fields in collection data

---

## New Public API

### Setup
```ts
import { createContenode } from '@contenode/sdk'

const vp = createContenode({
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

### `IContenodeCollectionEntry<T>`
```ts
interface IContenodeCollectionEntry<T = Record<string, unknown>> {
  id: string
  slug: string
  title: string
  data: T
  sort_order: number
  status: 'draft' | 'published'
  published_at: string | null
}
```

### `IContenodeGlobal<T>`
```ts
interface IContenodeGlobal<T = Record<string, unknown>> {
  id: string
  data: T
  updated_at: string
}
```

### `IContenodeMedia`
```ts
interface IContenodeMedia {
  id: string
  name: string
  file_url: string
  thumbnail_url: string
  created_at: string
}
```

### `IContenodePaginationMeta`
```ts
interface IContenodePaginationMeta {
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
  entries: IContenodeCollectionEntry<T>[]
  meta: IContenodePaginationMeta
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
  entry: IContenodeGlobal<T> | null
}
```

---

## File Structure After

```
src/
├── client.ts                        # contenodeFetch — instance method, no singleton
├── config.ts                        # createContenode() factory
├── index.ts                         # exports
├── types/
│   ├── block.ts                     # Block, Mark, InlineContent, TableRow — unchanged
│   ├── collection.ts                # IContenodeCollectionEntry<T>, IContenodeGlobal<T>, IContenodeMedia, IContenodePaginationMeta
│   └── index.ts                     # IContenodeApiResponse
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

### Reference client site
After contenode-api removes dedicated routes, migrate `server/httpClients/contenode/` to use `vp.collection()`.

**Nuxt wiring pattern** — `server/utils/contenode.ts` (auto-imported, no explicit imports needed):
```ts
// server/utils/contenode.ts
let _vp: ReturnType<typeof createContenode> | null = null
export function initContenode(config: ContenodeConfig) { _vp = createContenode(config) }
export function useContenode() {
  if (!_vp) throw new Error('[contenode] not initialized')
  return _vp
}

// server/plugins/contenode.ts
export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  initContenode({ apiUrl: config.contenodeApiUrl, clientId: config.contenodeClientId, clientSecret: config.contenodeClientSecret })
})

// server/api/blog-post/list.get.ts
export default defineEventHandler(async () => {
  return useContenode().collection('blog-posts').list()
})
```

| Old | New |
|-----|-----|
| `blogPostService.getBlogPostList()` | `vp.collection<BlogPostData>('blog-posts').list()` |
| `blogPostService.getBlogPostBySlug(slug)` | `vp.collection<BlogPostData>('blog-posts').find(slug)` |
| `faqService.getFaqList()` | `vp.collection<FaqData>('faq-items').list()` |
| `teamMemberService.getTeamMemberList()` | `vp.collection<TeamMemberData>('team-members').list()` |

Nitro plugin stays the same — `configureContenode()` → `createContenode()` (rename only).

### contenode-nuxt-template (future personal repo)
Built on top of contenode-js v2. No backward compat concern — greenfield.

---

## Out of Scope

- camelCase transform — no, keep snake_case (matches API docs)
- CLI codegen (`npx @contenode/sdk codegen`) — Phase 3, needs `GET /api/schema` BE endpoint
- contenode-nuxt module — future personal template repo

---

## Implementation Order

1. `src/config.ts` → `createContenode()` factory, returns instance
2. `src/client.ts` → strip logs, move fetch to instance method
3. `src/types/collection.ts` → new types
4. `src/modules/CollectionService/` → `list()` + `find()`
5. `src/modules/GlobalService/` → `get()`
6. `src/index.ts` → clean exports
7. Delete `src/modules/BlogPostService/`, `FaqService/`, `TeamMemberService/`, `src/types/model.ts`
8. Build + verify types compile
