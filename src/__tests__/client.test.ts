import { describe, it, expect, vi, beforeEach } from "vitest";
import { PeaklyClient } from "../client.js";

// openapi-fetch passes a Request object as the first (and only) argument to fetch.
// These helpers inspect that Request object.
function lastRequest(spy: ReturnType<typeof vi.spyOn>): Request {
  const call = spy.mock.calls.at(-1);
  if (!call) throw new Error("fetch was not called");
  return call[0] as Request;
}

function mockOk<T>(data: T): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("PeaklyClient — namespace structure", () => {
  let client: PeaklyClient;

  beforeEach(() => {
    client = new PeaklyClient({ apiKey: "test-key" });
  });

  it("exposes four top-level domain namespaces", () => {
    expect(client.sales).toBeDefined();
    expect(client.finance).toBeDefined();
    expect(client.accounting).toBeDefined();
    expect(client.purchases).toBeDefined();
  });

  it("sales has receipts, customers, products sub-namespaces", () => {
    expect(client.sales.receipts).toBeDefined();
    expect(client.sales.customers).toBeDefined();
    expect(client.sales.products).toBeDefined();
  });

  it("finance has deposits, payments, bankAccounts, fundMovements, retentions, transfers, checks", () => {
    expect(client.finance.deposits).toBeDefined();
    expect(client.finance.payments).toBeDefined();
    expect(client.finance.bankAccounts).toBeDefined();
    expect(client.finance.fundMovements).toBeDefined();
    expect(client.finance.retentions).toBeDefined();
    expect(client.finance.transfers).toBeDefined();
    expect(client.finance.checks).toBeDefined();
  });

  it("accounting has entries and accounts sub-namespaces", () => {
    expect(client.accounting.entries).toBeDefined();
    expect(client.accounting.accounts).toBeDefined();
  });

  it("purchases has receipts and suppliers sub-namespaces", () => {
    expect(client.purchases.receipts).toBeDefined();
    expect(client.purchases.suppliers).toBeDefined();
  });

  it("exposes $fetch for raw path access", () => {
    expect(typeof client.$fetch.GET).toBe("function");
    expect(typeof client.$fetch.POST).toBe("function");
  });
});

describe("PeaklyClient — auth headers", () => {
  it("sends X-API-Key on every request", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockOk({ data: [] }));
    const client = new PeaklyClient({ apiKey: "my-secret", baseUrl: "https://api.peakly.ar" });
    await client.sales.receipts.list();
    const req = lastRequest(spy);
    expect(req.headers.get("x-api-key")).toBe("my-secret");
  });

  it("sends X-Organization-Id when organizationId is provided", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockOk({ data: [] }));
    const client = new PeaklyClient({
      apiKey: "key",
      organizationId: "org-123",
      baseUrl: "https://api.peakly.ar",
    });
    await client.sales.receipts.list();
    const req = lastRequest(spy);
    expect(req.headers.get("x-organization-id")).toBe("org-123");
  });
});

describe("sales.receipts", () => {
  let spy: ReturnType<typeof vi.spyOn>;
  let client: PeaklyClient;

  beforeEach(() => {
    spy = vi.spyOn(globalThis, "fetch");
    client = new PeaklyClient({ apiKey: "k", baseUrl: "https://api.peakly.ar" });
  });

  it("list — GET /v1/sales/sales-receipts", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.sales.receipts.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/sales/sales-receipts");
    expect(req.method).toBe("GET");
  });

  it("get — GET /v1/sales/sales-receipts/{id}", async () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    spy.mockResolvedValueOnce(mockOk({ id }));
    await client.sales.receipts.get(id);
    const req = lastRequest(spy);
    expect(req.url).toContain(`/v1/sales/sales-receipts/${id}`);
    expect(req.method).toBe("GET");
  });

  it("create — POST /v1/sales/sales-receipts", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: "new-id" }));
    await client.sales.receipts.create({
      customerId: 1,
      receiptBookId: 2,
      saleConditionId: 3,
    });
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/sales/sales-receipts");
    expect(req.method).toBe("POST");
  });

  it("void — POST /v1/sales/sales-receipts/{id}/void", async () => {
    spy.mockResolvedValueOnce(mockOk({ ok: true }));
    await client.sales.receipts.void("receipt-uuid", { createCreditNote: false });
    const req = lastRequest(spy);
    expect(req.url).toContain("/void");
    expect(req.method).toBe("POST");
  });

  it("sendEmail — POST /v1/sales/sales-receipts/{id}/send-email", async () => {
    spy.mockResolvedValueOnce(mockOk({ ok: true }));
    await client.sales.receipts.sendEmail("receipt-uuid");
    const req = lastRequest(spy);
    expect(req.url).toContain("/send-email");
    expect(req.method).toBe("POST");
  });

  it("sendEmail — accepts optional email and subject overrides", async () => {
    spy.mockResolvedValueOnce(mockOk({ ok: true }));
    await client.sales.receipts.sendEmail("receipt-uuid", {
      email: "billing@example.com",
      subject: "Receipt ready",
    });
    const req = lastRequest(spy);
    expect(req.url).toContain("/send-email");
    expect(req.method).toBe("POST");
    await expect(req.json()).resolves.toEqual({
      email: "billing@example.com",
      subject: "Receipt ready",
    });
  });

  it("duplicate — POST /v1/sales/sales-receipts/{id}/duplicate", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: "new-copy-id" }));
    await client.sales.receipts.duplicate("receipt-uuid");
    const req = lastRequest(spy);
    expect(req.url).toContain("/duplicate");
    expect(req.method).toBe("POST");
  });
});

describe("sales.customers", () => {
  let spy: ReturnType<typeof vi.spyOn>;
  let client: PeaklyClient;

  beforeEach(() => {
    spy = vi.spyOn(globalThis, "fetch");
    client = new PeaklyClient({ apiKey: "k", baseUrl: "https://api.peakly.ar" });
  });

  it("list — GET /v1/customers", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.sales.customers.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/customers");
    expect(req.method).toBe("GET");
  });

  it("get — uses numeric id in path", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: 42 }));
    await client.sales.customers.get(42);
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/customers/42");
    expect(req.method).toBe("GET");
  });

  it("create — POST /v1/customers", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: 1 }));
    await client.sales.customers.create({ businessName: "Acme", taxCategoryId: 1, documentTypeId: 1, isActive: true });
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/customers");
    expect(req.method).toBe("POST");
  });
});

describe("sales.products", () => {
  let spy: ReturnType<typeof vi.spyOn>;
  let client: PeaklyClient;

  beforeEach(() => {
    spy = vi.spyOn(globalThis, "fetch");
    client = new PeaklyClient({ apiKey: "k", baseUrl: "https://api.peakly.ar" });
  });

  it("get — uses numeric id in path", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: 7 }));
    await client.sales.products.get(7);
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/products/7");
    expect(req.method).toBe("GET");
  });

  it("search — GET /v1/products/search", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.sales.products.search({ q: "widget" });
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/products/search");
    expect(req.method).toBe("GET");
  });
});

describe("finance", () => {
  let spy: ReturnType<typeof vi.spyOn>;
  let client: PeaklyClient;

  beforeEach(() => {
    spy = vi.spyOn(globalThis, "fetch");
    client = new PeaklyClient({ apiKey: "k", baseUrl: "https://api.peakly.ar" });
  });

  it("deposits.list — GET /v1/finance/deposits", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.finance.deposits.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/finance/deposits");
    expect(req.method).toBe("GET");
  });

  it("bankAccounts.list — GET /v1/finance/bank-accounts", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.finance.bankAccounts.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/finance/bank-accounts");
    expect(req.method).toBe("GET");
  });

  it("checks.get — GET /v1/finance/own-checks/{id}", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: 5 }));
    await client.finance.checks.get(5);
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/finance/own-checks/5");
    expect(req.method).toBe("GET");
  });

  it("retentions.list — GET /v1/finance/retentions", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.finance.retentions.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/finance/retentions");
    expect(req.method).toBe("GET");
  });
});

describe("accounting", () => {
  let spy: ReturnType<typeof vi.spyOn>;
  let client: PeaklyClient;

  beforeEach(() => {
    spy = vi.spyOn(globalThis, "fetch");
    client = new PeaklyClient({ apiKey: "k", baseUrl: "https://api.peakly.ar" });
  });

  it("entries.list — GET /v1/accounting/journal-entries", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.accounting.entries.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/accounting/journal-entries");
    expect(req.method).toBe("GET");
  });

  it("entries.get — GET /v1/accounting/journal-entries/{id}", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: 1 }));
    await client.accounting.entries.get(1);
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/accounting/journal-entries/1");
    expect(req.method).toBe("GET");
  });

  it("accounts.list — GET /v1/accounting/journal-accounts", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.accounting.accounts.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/accounting/journal-accounts");
    expect(req.method).toBe("GET");
  });
});

describe("purchases", () => {
  let spy: ReturnType<typeof vi.spyOn>;
  let client: PeaklyClient;

  beforeEach(() => {
    spy = vi.spyOn(globalThis, "fetch");
    client = new PeaklyClient({ apiKey: "k", baseUrl: "https://api.peakly.ar" });
  });

  it("receipts.list — GET /v1/purchases/purchase-receipts", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.purchases.receipts.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/purchases/purchase-receipts");
    expect(req.method).toBe("GET");
  });

  it("receipts.get — uses numeric id", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: 9 }));
    await client.purchases.receipts.get(9);
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/purchases/purchase-receipts/9");
    expect(req.method).toBe("GET");
  });

  it("suppliers.list — GET /v1/purchases/suppliers", async () => {
    spy.mockResolvedValueOnce(mockOk({ data: [] }));
    await client.purchases.suppliers.list();
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/purchases/suppliers");
    expect(req.method).toBe("GET");
  });

  it("suppliers.get — uses numeric id", async () => {
    spy.mockResolvedValueOnce(mockOk({ id: 3 }));
    await client.purchases.suppliers.get(3);
    const req = lastRequest(spy);
    expect(req.url).toContain("/v1/purchases/suppliers/3");
    expect(req.method).toBe("GET");
  });
});
