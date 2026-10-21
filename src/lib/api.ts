import { isCategory, isProductStatus, type Product } from "./types";

export function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "number" && Number.isSafeInteger(p.id) && p.id > 0 &&
    typeof p.name === "string" && p.name.trim().length > 0 &&
    isCategory(p.category) &&
    typeof p.price === "number" && Number.isFinite(p.price) && p.price > 0 &&
    typeof p.stock === "number" && Number.isSafeInteger(p.stock) && p.stock >= 0 &&
    isProductStatus(p.status) &&
    p.thumbnail === `/thumbnails/${String(p.category).toLowerCase()}.svg`
  );
}

interface FetchOptions { delay?: number; fail?: boolean; signal?: AbortSignal }

// The rest of the app does not need to know the API endpoint or response shape.
export async function fetchProducts({ delay, fail, signal }: FetchOptions = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (delay) params.set("delay", String(delay));
  if (fail) params.set("fail", "1");
  const response = await fetch(`/api/products?${params}`, { signal });
  if (!response.ok) throw new Error(`Could not load products (HTTP ${response.status}). Please try again.`);
  let data: unknown;
  try { data = await response.json(); }
  catch { throw new Error("The server returned invalid JSON. Please try again."); }
  if (typeof data !== "object" || data === null || !("products" in data) ||
      !Array.isArray(data.products) || !data.products.every(isProduct)) {
    throw new Error("The server returned invalid product data. Please try again.");
  }
  const products: Product[] = data.products;
  if (new Set(products.map((p) => p.id)).size !== products.length) {
    throw new Error("The server returned duplicate product IDs. Please try again.");
  }
  return products;
}
