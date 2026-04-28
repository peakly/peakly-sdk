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
  readonly customers: CustomersNamespace;
  readonly products: ProductsNamespace;
  readonly finance: FinanceNamespace;
  readonly purchases: PurchasesNamespace;

  constructor(options: PeaklyClientOptions) {
    const {
      apiKey,
      organizationId,
      baseUrl = "https://api.peakly.io",
    } = options;

    const headers: Record<string, string> = {
      "X-API-Key": apiKey,
    };
    if (organizationId) {
      headers["X-Organization-Id"] = organizationId;
    }

    this.#fetch = createClient<paths>({ baseUrl, headers });

    this.sales = new SalesNamespace(this.#fetch);
    this.customers = new CustomersNamespace(this.#fetch);
    this.products = new ProductsNamespace(this.#fetch);
    this.finance = new FinanceNamespace(this.#fetch);
    this.purchases = new PurchasesNamespace(this.#fetch);
  }

  /** Raw openapi-fetch client for full path/method access. */
  get $fetch(): Fetcher {
    return this.#fetch;
  }
}

// Sales receipts use UUID strings as IDs
class SalesNamespace {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/sales-receipts"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/sales-receipts", { params: { query } });
  }

  get(id: string) {
    return this.f.GET("/v1/sales-receipts/{id}", {
      params: { path: { id } },
    });
  }

  create(
    body: paths["/v1/sales-receipts"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/sales-receipts", { body });
  }

  update(
    id: string,
    body: paths["/v1/sales-receipts/{id}"]["patch"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.PATCH("/v1/sales-receipts/{id}", {
      params: { path: { id } },
      body,
    });
  }

  void(
    id: string,
    body: paths["/v1/sales-receipts/{id}/void"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/sales-receipts/{id}/void", {
      params: { path: { id } },
      body,
    });
  }

  authorize(id: string) {
    return this.f.POST("/v1/sales-receipts/{id}/authorize", {
      params: { path: { id } },
    });
  }

  confirm(id: string) {
    return this.f.POST("/v1/sales-receipts/{id}/confirm", {
      params: { path: { id } },
    });
  }

  sendEmail(id: string) {
    return this.f.POST("/v1/sales-receipts/{id}/send-email", {
      params: { path: { id } },
    });
  }

  pdf(id: string) {
    return this.f.GET("/v1/sales-receipts/{id}/pdf", {
      params: { path: { id } },
    });
  }

  duplicate(id: string) {
    return this.f.POST("/v1/sales-receipts/{id}/duplicate", {
      params: { path: { id } },
    });
  }
}

// Customers and products use numeric IDs
class CustomersNamespace {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/customers"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/customers", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/customers/{id}", {
      params: { path: { id } },
    });
  }

  create(
    body: paths["/v1/customers"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/customers", { body });
  }

  // requestBody is not yet defined in the spec for this endpoint
  update(id: number, body: Record<string, unknown>) {
    return this.f.PATCH("/v1/customers/{id}", {
      params: { path: { id } },
      body: body as never,
    });
  }

  delete(id: number) {
    return this.f.DELETE("/v1/customers/{id}", {
      params: { path: { id } },
    });
  }
}

class ProductsNamespace {
  constructor(private readonly f: Fetcher) {}

  list(query?: paths["/v1/products"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/products", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/products/{id}", {
      params: { path: { id } },
    });
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
    return this.f.DELETE("/v1/products/{id}", {
      params: { path: { id } },
    });
  }

  search(query?: paths["/v1/products/search"]["get"]["parameters"]["query"]) {
    return this.f.GET("/v1/products/search", { params: { query } });
  }
}

class FinanceNamespace {
  constructor(private readonly f: Fetcher) {}

  // Payment methods (receipts/payments)
  listPaymentMethods(
    query?: paths["/v1/finance/payment-methods"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/payment-methods", { params: { query } });
  }

  // Deposits
  listDeposits(
    query?: paths["/v1/finance/deposits"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/deposits", { params: { query } });
  }

  createDeposit(
    body: paths["/v1/finance/deposits"]["post"]["requestBody"]["content"]["application/json"]
  ) {
    return this.f.POST("/v1/finance/deposits", { body });
  }

  // Fund movements
  listFundMovements(
    query?: paths["/v1/finance/fund-movements"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/fund-movements", { params: { query } });
  }

  // Bank accounts
  listBankAccounts(
    query?: paths["/v1/finance/bank-accounts"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/bank-accounts", { params: { query } });
  }

  // Retentions
  listRetentions(
    query?: paths["/v1/finance/retentions"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/finance/retentions", { params: { query } });
  }
}

class PurchasesNamespace {
  constructor(private readonly f: Fetcher) {}

  list(
    query?: paths["/v1/purchase-receipts"]["get"]["parameters"]["query"]
  ) {
    return this.f.GET("/v1/purchase-receipts", { params: { query } });
  }

  get(id: number) {
    return this.f.GET("/v1/purchase-receipts/{id}", {
      params: { path: { id } },
    });
  }

  // requestBody schema is not yet detailed in the spec
  create(body: Record<string, unknown>) {
    return this.f.POST("/v1/purchase-receipts", { body: body as never });
  }
}
