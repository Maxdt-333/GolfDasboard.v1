export const CATEGORIES = ["Clubs", "Balls", "Apparel", "Accessories", "Training"] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATUSES = ["Active", "Draft", "Archived"] as const;
export type ProductStatus = (typeof STATUSES)[number];

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  status: ProductStatus;
  thumbnail: string;
  image?: string; // An uploaded data URL, held in memory with this product.
}

// Inputs produce strings; convert numbers only after validation succeeds.
export interface ProductFormValues {
  name: string;
  category: Category | "";
  price: string;
  stock: string;
  status: ProductStatus | "";
}

export type FormErrors = Partial<Record<keyof ProductFormValues, string>>;
export type SortOrder = "none" | "price-asc" | "price-desc";
export interface ProductFilters {
  search: string;
  category: Category | "All";
  status: ProductStatus | "All";
  sort: SortOrder;
}
export interface ProductsResponse { products: Product[] }

export type ProductInput = Omit<Product, "id">;
export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && CATEGORIES.some((category) => category === value);
}
export function isProductStatus(value: unknown): value is ProductStatus {
  return typeof value === "string" && STATUSES.some((status) => status === value);
}
