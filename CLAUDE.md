# @contenode/sdk — SDK Developer Guide

TypeScript SDK for consuming the Contenode headless CMS delivery API.

## Client API

```typescript
import { createContenode } from '@contenode/sdk'

const contenode = createContenode({
  apiUrl: 'https://api.example.com',
  deliveryToken: 'vpk_...',
})
```

### Methods

```typescript
// Manifest — full project schema (collections, globals, locales, form config)
// Call this first when planning any feature — it describes everything available in the project
const manifest = await contenode.manifest.get()
// → IContenodeManifest

// Collection — paginated entries
const list = await contenode.collection<IProductFields>('products').list({ page: 1, locale: 'en' })
// → ICollectionListOutput<IProductFields>

const entry = await contenode.collection<IProductFields>('products').find('my-slug', { depth: 1 })
// → IContenodeCollectionEntry<IProductFields>

const schema = await contenode.collection('products').schema()
// → ICollectionSchemaOutput — field definitions for this collection

// Global — single config object
const settings = await contenode.global<ISiteSettingsFields>('site-settings').get({ locale: 'en' })
// → IGlobalGetOutput<ISiteSettingsFields>
```

## Key Types

| Type | Description |
|---|---|
| `IContenodeManifest` | Full project manifest: locales, collections, globals, form |
| `IContenodeSchemaEntry` | `{ slug, name, fields[] }` — one collection or global |
| `IContenodeCollectionEntry<T>` | Entry: id, slug, title, data: T, published_at |
| `IContenodeGlobal<T>` | Global data spread with updated_at |
| `IContenodeMedia` | `{ id, name, file_url, thumbnail_url }` |
| `ICollectionListOutput<T>` | `{ locale, entries[], meta }` |
| `ICollectionListInput` | page, items_per_page, locale, search, sort_by, status, field filters |
| `Block` | Discriminated union for richtext blocks (paragraph, heading, image, table…) |

All types exported from `@contenode/sdk`.

## Manifest Response Shape

```typescript
{
  locales: [{ locale: 'en', is_default: true }],
  collections: [
    {
      slug: 'products',
      name: 'Products',
      fields: [
        { name: 'price', label: 'Price', type: 'number', required: true, localizable: false },
        { name: 'category', type: 'relation', cardinality: 'one', target_collection: 'categories' },
        { name: 'tags', type: 'select', multiple: true, options: [{ value: 'new', label: 'New' }] },
      ]
    }
  ],
  globals: [{ slug: 'site-settings', name: 'Site Settings', fields: [...] }],
  form: { captcha_provider, turnstile_site_key, contact_form_schema, ... }
}
```

## Field Types

| type | notes |
|---|---|
| text, textarea, color | string |
| number | numeric |
| boolean | bool |
| date | `Y-m-d` |
| datetime | ISO 8601 |
| select | single string or string[] when `multiple: true` |
| media | ULID string stored, resolved to `{ id, url }` by API |
| richtext | `Block[]` array |
| json | arbitrary object |
| relation | `cardinality: 'one'\|'many'`, `target_collection` slug |

Localizable fields: value stored as `{ en: ..., zh: ... }` — API resolves to flat value when `locale` param is provided.

## Module Structure

```
src/
├── index.ts                 — exports createContenode + all types
├── config.ts                — createContenode() factory
├── client.ts                — createContenodeFetch() — injects X-Delivery-Token
├── types/                   — shared types (collection.ts, block.ts, index.ts)
└── modules/
    ├── ManifestService/     — manifest.get()
    ├── CollectionService/   — collection().list(), find(), schema()
    └── GlobalService/       — global().get()
```

Each module: `index.ts` (implementation) + `types.ts` (input/output interfaces).

## Adding a New Endpoint

1. `src/modules/{Name}Service/types.ts` — input/output interfaces
2. `src/modules/{Name}Service/index.ts` — `create{Name}Service(fetch)` factory returning method object
3. Export from `src/index.ts`
4. Wire into `createContenode()` in `src/config.ts`

## What Not to Break

- `X-Delivery-Token` header in `client.ts` — every request requires it
- `IContenodeManifest` shape — consumer repos depend on it for site init and AI agent planning
- `IContenodeCollectionEntry<T>` generic — the `data: T` pattern is used everywhere downstream
- ESM + CJS dual build — `tsup` outputs both; always verify `pnpm build` produces both after changes
