"use client";

import { useMemo, useState } from "react";
import { useProducts } from "./ProductsProvider";
import { filterProducts } from "@/lib/filterProducts";
import type { ProductFilters as Filters } from "@/lib/types";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import EmptyState from "./states/EmptyState";

const defaultFilters: Filters = { search: "", category: "All", status: "All", sort: "none" };

export default function ProductList() {
  const { products, status, error, retry } = useProducts();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const visibleProducts = useMemo(() => filterProducts(products, filters), [products, filters]);
  const categoryProducts = products.filter((product) => filters.category === "All" || product.category === filters.category);
  const hasFilters = filters.search !== "" || filters.category !== "All" || filters.status !== "All" || filters.sort !== "none";
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error ?? "Could not load products."} onRetry={retry} />;

  return (
    <main className="catalog-workspace">
      <h1 className="sr-only">Products</h1>
      <section className="inventory-overview grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Inventory overview">
        <div className="metric-card"><p>{filters.category === "All" ? "Total products" : filters.category}</p><strong>{categoryProducts.length}</strong></div>
        <div className="metric-card"><p>Active products</p><strong>{categoryProducts.filter((p) => p.status === "Active").length}</strong></div>
        <div className="metric-card"><p>Drafts</p><strong>{categoryProducts.filter((p) => p.status === "Draft").length}</strong></div>
        <div className="metric-card"><p>Out of stock</p><strong>{categoryProducts.filter((p) => p.stock === 0).length}</strong></div>
      </section>
      <section className="catalog-panel" aria-label="Product catalog">
        <div className="p-5 sm:p-6"><ProductFilters filters={filters} onChange={setFilters} /></div>
        <div className="results-bar"><p role="status" aria-live="polite" aria-atomic="true">Showing <strong>{visibleProducts.length}</strong> of {categoryProducts.length} products</p>
          {hasFilters && <button type="button" className="action-link" onClick={() => setFilters(defaultFilters)}>Clear filters</button>}
        </div>
        {visibleProducts.length ? <ProductTable products={visibleProducts} /> : <EmptyState onClear={() => setFilters(defaultFilters)} />}
      </section>
    </main>
  );
}
