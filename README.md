# @peakly/sdk

Auto-generated TypeScript SDK for the [Peakly API](https://peakly.io). Full type safety with zero hand-written types — all types are generated from the OpenAPI spec.

## Install

```bash
npm install @peakly/sdk
# or
pnpm add @peakly/sdk
```

Node 18+ required (uses native fetch).

## Quick start

```typescript
import { PeaklyClient } from "@peakly/sdk";

const client = new PeaklyClient({
  apiKey: process.env.PEAKLY_API_KEY!,
  organizationId: process.env.PEAKLY_ORG_ID, // optional
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

Types are generated from `openapi.json` (a committed snapshot from `peakly-v2-api`). To regenerate after an API update:

1. Copy the updated spec:
   ```bash
   cp ../peakly-v2-api/openapi.json ./openapi.json
   # or pull from the live API:
   # bash scripts/generate.sh https://api.peakly.io/openapi.json
   ```
2. Regenerate:
   ```bash
   pnpm generate
   pnpm build
   ```

## Development

```bash
pnpm install
pnpm build      # compile TypeScript
pnpm test       # run vitest suite (30 tests)
pnpm generate   # regenerate src/schema.d.ts from openapi.json
```

## Known gaps

- `PATCH /v1/customers/{id}` and `PATCH /v1/purchase-receipts/{id}` are missing `requestBody` in the spec — their `update()` methods accept `Record<string, unknown>` for now. Fix tracked in [PEA-118](https://github.com/peakly/peakly-sdk).

## License

MIT
