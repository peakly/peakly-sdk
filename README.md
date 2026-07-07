# peakly

[![Release](https://github.com/peakly/peakly-sdk/actions/workflows/release.yml/badge.svg)](https://github.com/peakly/peakly-sdk/actions/workflows/release.yml)
[![Sync OpenAPI schema](https://github.com/peakly/peakly-sdk/actions/workflows/sync-schema.yml/badge.svg)](https://github.com/peakly/peakly-sdk/actions/workflows/sync-schema.yml)
[![npm version](https://img.shields.io/npm/v/peakly.svg)](https://www.npmjs.com/package/peakly)
[![npm downloads](https://img.shields.io/npm/dm/peakly.svg)](https://www.npmjs.com/package/peakly)

Official TypeScript SDK for the [Peakly API](https://peakly.io), published as [`peakly`](https://www.npmjs.com/package/peakly). Full type safety with zero hand-written types — all endpoint types are generated from the public OpenAPI spec.

## Install

```bash
npm install peakly
# or
pnpm add peakly
```

Node 18+ required (uses native fetch).

## Quick start

```typescript
import { PeaklyClient } from "peakly";

const client = new PeaklyClient({
  apiKey: process.env.PEAKLY_API_KEY!,
});

// Sales receipts
const { data: receipts } = await client.sales.receipts.list({ status: "confirmed" });
const { data: receipt } = await client.sales.receipts.get("uuid-here");
await client.sales.receipts.void("uuid-here", { createCreditNote: false });

// Customers
const { data: customers } = await client.sales.customers.list();
const { data: customer } = await client.sales.customers.get(42);

// Products
const { data: products } = await client.sales.products.search({ q: "widget" });
await client.sales.products.create({
  description: "Widget A",
  unitOfMeasureId: 1,
});

// Finance
const { data: deposits } = await client.finance.deposits.list();
const { data: checks } = await client.finance.checks.list();

// Accounting
const { data: entries } = await client.accounting.entries.list();
const { data: accounts } = await client.accounting.accounts.list();

// Purchases
const { data: purchaseReceipts } = await client.purchases.receipts.list();
const { data: suppliers } = await client.purchases.suppliers.list();
```

## Authentication

Peakly API keys are scoped to a single organization. The SDK sends only the `X-API-Key` header; no organization id is required or accepted by the client.

## Namespace structure

The client mirrors the Peakly domain model:

```
client
├── sales
│   ├── receipts      list, get, create, update, void, authorize, confirm,
│   │                 sendEmail, pdf, duplicate
│   ├── customers     list, get, create, update, delete
│   └── products      list, get, create, update, delete, search
│
├── finance
│   ├── deposits      list, get, create
│   ├── payments      list, create
│   ├── bankAccounts  list, get
│   ├── fundMovements list, create
│   ├── retentions    list, create
│   ├── transfers     list, create
│   └── checks        list, get, create
│
├── accounting
│   ├── entries       list, get, create
│   └── accounts      list
│
└── purchases
    ├── receipts      list, get, create
    └── suppliers     list, get, create
```

For any path not covered by named namespaces, use the raw fetch client:

```typescript
const { data } = await client.$fetch.GET("/v1/combos/{id}/items", {
  params: { path: { id: 5 } },
});
```

## Error handling

All methods return `{ data, error, response }`. Check `error` before using `data`:

```typescript
const { data, error } = await client.sales.receipts.list();
if (error) {
  console.error("API error:", error);
} else {
  console.log(data);
}
```

## Regenerating types

Types are generated from the live Peakly API spec. To pick up new endpoints or fields after an API update:

```bash
pnpm generate   # fetches https://api.peakly.ar/openapi.json and regenerates src/schema.d.ts
pnpm build
```

For offline development, save the spec locally first and pass it as an argument:

```bash
curl -o openapi.json https://api.peakly.ar/openapi.json
pnpm generate ./openapi.json
```

`openapi.json` is not committed — the canonical source of truth is always the live endpoint `https://api.peakly.ar/openapi.json`. The `sync-schema` CI workflow opens a PR automatically every Monday when the spec changes.

## Development

```bash
pnpm install
pnpm build      # compile TypeScript
pnpm test       # run vitest suite (62 tests)
pnpm generate   # regenerate src/schema.d.ts from live API spec
```

## API spec gaps

- `POST /v1/purchases/purchase-receipts` currently declares an empty request body schema — `purchases.receipts.create()` accepts `Record<string, unknown>` until the API spec exposes the concrete DTO.

## License

MIT
