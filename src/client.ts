import createClient, { type Client } from "openapi-fetch";
import type { paths } from "./schema.js";

export interface PeaklyClientOptions {
  apiKey: string;
  organizationId?: string;
  baseUrl?: string;
}

type Fetcher = Client<paths>;

export class PeaklyClient {
  readonly #fetch: Fetcher;

  readonly sales: SalesNamespace;
  readonly finance: FinanceNamespace;
  readonly accounting: AccountingNamespace;
  readonly purchases: PurchasesNamespace;

  constructor(options: PeaklyClientOptions) {
    const {
      apiKey,
      organizationId,
      baseUrl = "https://api.peakly.ar",
    } = options;

    const headers: Record<string, string> = {
      "X-API-Key": apiKey,
    };
    if (organizationId) {
      headers["X-Organization-Id"] = organizationId;
    }

    this.#fetch = createClient<paths>({ baseUrl, headers });

    this.sales = new SalesNamespace(this.#fetch);
    this.finance = new FinanceNamespace(this.#fetch);
    this.accounting = new AccountingNamespace(this.#fetch);
    this.purchases = new PurchasesNamespace(this.#fetch);
  }

  /** Raw openapi-fetch client for full path/method access. */
  get $fetch(): Fetcher {
    return this.#fetch;
  }
}

// ─── Sales ───────────────────────────────────────────────────────────────────

class SalesNamespace {
  readonly receipts: SalesReceiptsResource;
  readonly customers: CustomersResource;
  readonly products: ProductsResource;

  constructor(f: Fetcher) {
    this.receipts = new SalesReceiptsResource(f);
    this.customers = new CustomersResource(f);
    this.products = new ProductsResource(f);
  }
}

class SalesReceiptsResource {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/sales/sales-receipts"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/sales/sales-receipts", { params: { query } });
  }

  get(id: string) {
    return this.f.GET("/v1/sales/sales-receipts/{id}", { params: { path: { id } } });
  }

  create(
    body: paths["/v1/sales/sales-receipts"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/sales/sales-receipts", { body });
  }

  update(
    id: string,
    body: paths["/v1/sales/sales-receipts/{id}"]["patch"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.PATCH("/v1/sales/sales-receipts/{id}", {
      params: { path: { id } },
      body,
    });
  }

  void(
    id: string,
    body: paths["/v1/sales/sales-receipts/{id}/void"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/sales/sales-receipts/{id}/void", {
      params: { path: { id } },
      body,
    });
  }

  authorize(id: string) {
    return this.f.POST("/v1/sales/sales-receipts/{id}/authorize", {
      params: { path: { id } },
    });
  }

  confirm(id: string) {
    return this.f.POST("/v1/sales/sales-receipts/{id}/confirm", {
      params: { path: { id } },
    });
  }

  sendEmail(id: string) {
    return this.f.POST("/v1/sales/sales-receipts/{id}/send-email", {
      params: { path: { id } },
    });
  }

  pdf(id: string) {
    return this.f.GET("/v1/sales/sales-receipts/{id}/pdf", {
      params: { path: { id } },
    });
  }

  duplicate(id: string) {
    return this.f.POST("/v1/sales/sales-receipts/{id}/duplicate", {
      params: { path: { id } },
    });
  }
}

class CustomersResource {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/customers"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/customers", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/customers/{id}", { params: { path: { id } } });
  }

  create(
    body: paths["/v1/customers"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/customers", { body });
  }

  update(
    id: number,
    body: paths["/v1/customers/{id}"]["patch"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.PATCH("/v1/customers/{id}", {
      params: { path: { id } },
      body,
    });
  }

  delete(id: number) {
    return this.f.DELETE("/v1/customers/{id}", { params: { path: { id } } });
  }
}

class ProductsResource {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/products"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/products", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/products/{id}", { params: { path: { id } } });
  }

  create(
    body: paths["/v1/products"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/products", { body });
  }

  update(
    id: number,
    body: paths["/v1/products/{id}"]["patch"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.PATCH("/v1/products/{id}", {
      params: { path: { id } },
      body,
    });
  }

  delete(id: number) {
    return this.f.DELETE("/v1/products/{id}", { params: { path: { id } } });
  }

  search(query?: paths["/v1/products/search"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/products/search", { params: { query } });
  }
}

// ─── Finance ─────────────────────────────────────────────────────────────────

class FinanceNamespace {
  readonly deposits: DepositsResource;
  readonly payments: PaymentMethodsResource;
  readonly bankAccounts: BankAccountsResource;
  readonly fundMovements: FundMovementsResource;
  readonly retentions: RetentionsResource;
  readonly transfers: TransfersResource;
  readonly checks: OwnChecksResource;

  constructor(f: Fetcher) {
    this.deposits = new DepositsResource(f);
    this.payments = new PaymentMethodsResource(f);
    this.bankAccounts = new BankAccountsResource(f);
    this.fundMovements = new FundMovementsResource(f);
    this.retentions = new RetentionsResource(f);
    this.transfers = new TransfersResource(f);
    this.checks = new OwnChecksResource(f);
  }
}

class DepositsResource {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/finance/deposits"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/finance/deposits", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/finance/deposits/{id}", {
      params: { path: { id } },
    });
  }

  create(
    body: paths["/v1/finance/deposits"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/finance/deposits", { body });
  }
}

class PaymentMethodsResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/finance/payment-methods"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/payment-methods", { params: { query } });
  }

  create(
    body: paths["/v1/finance/payment-methods"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/finance/payment-methods", { body });
  }
}

class BankAccountsResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/finance/bank-accounts"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/bank-accounts", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/finance/bank-accounts/{id}", {
      params: { path: { id } },
    });
  }
}

class FundMovementsResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/finance/fund-movements"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/fund-movements", { params: { query } });
  }

  create(
    body: paths["/v1/finance/fund-movements"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/finance/fund-movements", { body });
  }
}

class RetentionsResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/finance/retentions"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/retentions", { params: { query } });
  }

  create(
    body: paths["/v1/finance/retentions"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/finance/retentions", { body });
  }
}

class TransfersResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/finance/transfers"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/transfers", { params: { query } });
  }

  create(
    body: paths["/v1/finance/transfers"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/finance/transfers", { body });
  }
}

class OwnChecksResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/finance/own-checks"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/own-checks", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/finance/own-checks/{id}", {
      params: { path: { id } },
    });
  }

  create(
    body: paths["/v1/finance/own-checks"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/finance/own-checks", { body });
  }
}

// ─── Accounting ───────────────────────────────────────────────────────────────

class AccountingNamespace {
  readonly entries: JournalEntriesResource;
  readonly accounts: JournalAccountsResource;

  constructor(f: Fetcher) {
    this.entries = new JournalEntriesResource(f);
    this.accounts = new JournalAccountsResource(f);
  }
}

class JournalEntriesResource {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/accounting/journal-entries"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/accounting/journal-entries", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/accounting/journal-entries/{id}", {
      params: { path: { id } },
    });
  }

  create(
    body: paths["/v1/accounting/journal-entries"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/accounting/journal-entries", { body });
  }
}

class JournalAccountsResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/accounting/journal-accounts"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/accounting/journal-accounts", { params: { query } });
  }
}

// ─── Purchases ────────────────────────────────────────────────────────────────

class PurchasesNamespace {
  readonly receipts: PurchaseReceiptsResource;
  readonly suppliers: SuppliersResource;

  constructor(f: Fetcher) {
    this.receipts = new PurchaseReceiptsResource(f);
    this.suppliers = new SuppliersResource(f);
  }
}

class PurchaseReceiptsResource {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/purchases/purchase-receipts"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/purchases/purchase-receipts", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/purchases/purchase-receipts/{id}", {
      params: { path: { id } },
    });
  }

  // requestBody schema not yet detailed in the spec; tracked in PEA-125
  create(body: Record<string, unknown>) {
    return this.f.POST("/v1/purchases/purchase-receipts", { body: body as never });
  }
}

class SuppliersResource {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/purchases/suppliers"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/purchases/suppliers", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/purchases/suppliers/{id}", { params: { path: { id } } });
  }

  create(
    body: paths["/v1/purchases/suppliers"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/purchases/suppliers", { body });
  }
}
