"use client";

import { CATEGORIES, STATUSES, type ProductFilters as Filters, type SortOrder, type Category, type ProductStatus } from "@/lib/types";

export default function ProductFilters({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  return (
    <form role="search" aria-label="Filter products" onSubmit={(event) => event.preventDefault()} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div>
        <label htmlFor="search">Search products</label>
        <input id="search" type="search" placeholder="Search by product name…" value={filters.search} onChange={(e) => onChange({ ...filters, search: e.target.value })} />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select id="category" value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value as Category | "All" })}>
          <option value="All">All categories</option>
          {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select id="status" value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value as ProductStatus | "All" })}>
          <option value="All">All statuses</option>
          {STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={filters.sort} onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOrder })}>
          <option value="none">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
    </form>
  );
}
