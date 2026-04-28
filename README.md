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

// List sales receipts
const { data, error } = await client.sales.list({ status: "confirmed" });

// Get a single receipt
const { data: receipt } = await client.sales.get("uuid-here");

// Create a receipt
const { data: created } = await client.sales.create({
  customerId: 1,
  receiptBookId: 1,
  saleConditionId: 1,
  details: [
    { description: "Service", quantity: 1, unitPrice: 1000 },
  ],
});

// List products
const { data: products } = await client.products.list({ q: "widget" });

// List customers
const { data: customers } = await client.customers.list();
```

## Available namespaces

| Namespace | Methods |
|-----------|---------|
| `client.sales` | `list`, `get`, `create`, `update`, `void`, `authorize`, `confirm`, `sendEmail`, `pdf`, `duplicate` |
| `client.customers` | `list`, `get`, `create`, `update`, `delete` |
| `client.products` | `list`, `get`, `create`, `update`, `delete`, `search` |
| `client.finance` | `listPaymentMethods`, `listDeposits`, `createDeposit`, `listFundMovements`, `listBankAccounts`, `listRetentions` |
| `client.purchases` | `list`, `get`, `create` |

For any path not covered by the named namespaces, use the raw fetch client:

```typescript
const { data } = await client.$fetch.GET("/v1/combos/{id}/items", {
  params: { path: { id: 5 } },
});
```

## Regenerating types

Types are generated from `openapi.json` (a committed snapshot of the API spec). To regenerate after an API update:

1. Update `openapi.json` from the `peakly-v2-api` repo:
   ```bash
   cp ../peakly-v2-api/openapi.json ./openapi.json
   # or pull from the live API:
   # bash scripts/generate.sh https://api.peakly.io/openapi.json
   ```
2. Regenerate types:
   ```bash
   bash scripts/generate.sh
   ```
3. Rebuild:
   ```bash
   pnpm build
   ```

## Error handling

All methods return `{ data, error, response }`. Check `error` before using `data`:

```typescript
const { data, error } = await client.sales.list();
if (error) {
  console.error("API error:", error);
} else {
  console.log(data);
}
```

## License

MIT
