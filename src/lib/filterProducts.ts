import type { Product, ProductFilters } from "./types";

export function filterProducts(products: Product[], f: ProductFilters): Product[] {
  const query = f.search.trim().toLowerCase();
  const result = products.filter((p) =>
    (query === "" || p.name.toLowerCase().includes(query)) &&
    (f.category === "All" || p.category === f.category) &&
    (f.status === "All" || p.status === f.status)
  );
  if (f.sort === "price-asc") return [...result].sort((a, b) => a.price - b.price);
  if (f.sort === "price-desc") return [...result].sort((a, b) => b.price - a.price);
  return [...result].sort((a, b) => b.id - a.id);
}
