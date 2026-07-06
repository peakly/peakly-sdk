#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";

const [source, output] = process.argv.slice(2);

if (!source || !output) {
  console.error("Usage: node scripts/prepare-openapi.mjs <spec-source> <output-file>");
  process.exit(1);
}

async function loadSpec(specSource) {
  if (/^https?:\/\//.test(specSource)) {
    const response = await fetch(specSource);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${specSource}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  return JSON.parse(await readFile(specSource, "utf8"));
}

const spec = await loadSpec(source);
const schemas = spec.components?.schemas;

if (!schemas || typeof schemas !== "object") {
  throw new Error("OpenAPI spec is missing components.schemas");
}

const receiptStatuses =
  schemas.BulkActionStatusResponseDto?.properties?.receiptStatuses?.additionalProperties;

if (
  receiptStatuses?.$ref === "#/components/schemas/BulkActionReceiptStatusResponseDto" &&
  !schemas.BulkActionReceiptStatusResponseDto
) {
  schemas.BulkActionReceiptStatusResponseDto = {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "done",
        description: "pending | done | skipped | failed",
      },
      error: {
        type: "string",
        nullable: true,
        example: null,
      },
      customerName: {
        type: "string",
        nullable: true,
        example: "Cliente S.A.",
      },
      receiptNumber: {
        type: "string",
        nullable: true,
        example: "00001-00000123",
      },
    },
    required: ["status"],
  };

  console.warn("[generate] Patched missing schema: BulkActionReceiptStatusResponseDto");
}

await writeFile(output, `${JSON.stringify(spec, null, 2)}\n`);
