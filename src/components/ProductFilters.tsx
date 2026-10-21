"use client";

import { useViewMode } from "./ViewModeProvider";
import { STATUSES, type ProductFilters as Filters, type SortOrder, type ProductStatus } from "@/lib/types";

export default function ProductFilters({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  const { customer } = useViewMode();
  return (
    <form role="search" aria-label="Filter products" onSubmit={(event) => event.preventDefault()} className={`${customer ? "customer-filters" : ""} product-filters grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]`}>
      <div>
        <label htmlFor="search">Search products</label>
        <input id="search" type="search" placeholder="Search by product name…" value={filters.search} onChange={(e) => onChange({ ...filters, search: e.target.value })} />
      </div>
      {!customer && <div>
        <label htmlFor="status">Status</label>
        <select id="status" value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value as ProductStatus | "All" })}>
          <option value="All">All statuses</option>
          {STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>}
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
