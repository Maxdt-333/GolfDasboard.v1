"use client";

// Client boundary: controls are state; catalog results and counts are derived.
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "./NavigationLink";
import { useViewMode } from "./ViewModeProvider";
import { useProducts } from "./ProductsProvider";
import { filterProducts } from "@/lib/filterProducts";
import { type Category, type ProductStatus, type ProductFilters as Filters, type SortOrder } from "@/lib/types";
import { ArrowRight, Package, NotebookPen, Plus, CircleCheck, PackageX } from "lucide-react";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";

const defaultFilters: Filters = { search: "", category: "All", status: "All", sort: "none" };
interface Props { initialSearch?: string; initialCategory?: Category | "All"; initialStatus?: ProductStatus | "All"; initialSort?: SortOrder }

export default function ProductList({ initialSearch = "", initialCategory = "All", initialStatus = "All", initialSort = "none" }: Props) {
  const { products, status, error, retry } = useProducts();
  const { customer } = useViewMode();
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters, search: initialSearch, category: initialCategory, status: initialStatus, sort: initialSort });
  // Keep shareable URL controls in sync without a server navigation per keystroke.
  function changeFilters(next: Filters) {
    setFilters(next);
    const params = new URLSearchParams(window.location.search);
    const values = { q: next.search, category: next.category === "All" ? "" : next.category, status: next.status === "All" ? "" : next.status, sort: next.sort === "none" ? "" : next.sort };
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    window.history.replaceState(null, "", `/products${params.size ? `?${params}` : ""}`);
  }
  const collection = useMemo(() => customer ? products.filter((product) => product.status === "Active") : products, [products, customer]);
  const visibleProducts = useMemo(() => filterProducts(collection, customer ? { ...filters, status: "All" } : filters), [collection, filters, customer]);
  const categoryProducts = collection.filter((product) => filters.category === "All" || product.category === filters.category);
  const categoryLabel = filters.category === "All" ? "Products" : filters.category === "Balls" ? "Golf balls" : filters.category;
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error ?? "Something went wrong."} onRetry={retry} />;
  const activeCount = categoryProducts.filter((product) => product.status === "Active").length;
  const draftCount = categoryProducts.filter((product) => product.status === "Draft").length;
  const outOfStockCount = categoryProducts.filter((product) => product.stock === 0).length;
  const hasFilters = filters.search !== "" || (!customer && filters.status !== "All") || filters.sort !== "none";
  return (
    <div className={`clubhouse-layout${customer ? " customer-catalog-layout" : " owner-catalog-layout"}`}>
      {customer && <aside className="clubhouse-story" aria-labelledby="collection-heading">
        <Image src="/images/sage-course-sidebar.webp" alt="Stone bridge over a creek on a sunlit golf course" fill unoptimized priority className="clubhouse-photo" sizes="(max-width: 767px) 100vw, (max-width: 1199px) 28vw, 27vw" />
        <div className="clubhouse-story-content">
          <p className="clubhouse-kicker">FAIRWAY</p>
          <p id="collection-heading" className="clubhouse-story-title">Elevate<br />your <em>game.</em></p>
          <p className="clubhouse-story-description">Premium golf equipment for every part of your game.</p>
          <span className="clubhouse-story-rule" aria-hidden="true" />
          <p className="clubhouse-story-caption">BETTER EQUIPMENT<br />BRIGHTER ROUNDS</p>
        </div>
      </aside>}

      <section className="clubhouse-workspace" id="catalog" aria-labelledby="catalog-heading">
        <div className="clubhouse-heading">
          <div>
            <p className="clubhouse-kicker">{customer ? "THE COLLECTION" : "PRODUCTS"}</p>
            <h1 id="catalog-heading" className={customer ? "" : "sr-only"}>{customer ? (filters.category === "All" ? "The collection" : categoryLabel) : categoryLabel}</h1>
            {customer && <p>The essentials for your next great round.</p>}
          </div>
          {!customer && <Link href="/products/new" className="button-primary"><Plus size={18} strokeWidth={1.7} aria-hidden="true" /> Add product</Link>}
        </div>

        {!customer && (
          <div className="clubhouse-metrics grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4" aria-label="Inventory overview">
            <div className="clubhouse-metric">
              <span className="metric-icon metric-neutral"><Package size={24} strokeWidth={1.6} aria-hidden="true" /></span>
              <div><p>{filters.category === "All" ? "Total products" : categoryLabel}</p><strong>{categoryProducts.length}</strong></div>
            </div>
            <div className="clubhouse-metric">
              <span className="metric-icon metric-green"><CircleCheck size={24} strokeWidth={1.6} aria-hidden="true" /></span>
              <div><p>{filters.category === "All" ? "Active products" : `Active ${categoryLabel.toLowerCase()}`}</p><strong>{activeCount}</strong></div>
            </div>
            <button type="button" className={`clubhouse-metric metric-button${filters.status === "Draft" ? " selected" : ""}`} aria-pressed={filters.status === "Draft"} onClick={() => changeFilters({ ...filters, status: filters.status === "Draft" ? "All" : "Draft" })}>
              <span className="metric-icon metric-sand"><NotebookPen size={24} strokeWidth={1.6} aria-hidden="true" /></span>
              <div><p>Drafts</p><strong>{draftCount}</strong></div>
              <ArrowRight size={15} aria-hidden="true" className="metric-arrow" />
            </button>
            <div className="clubhouse-metric">
              <span className="metric-icon metric-rose"><PackageX size={24} strokeWidth={1.6} aria-hidden="true" /></span>
              <div><p>Out of stock</p><strong>{outOfStockCount}</strong></div>
            </div>
          </div>
        )}

        <div className="clubhouse-controls">
          <div className="filters-panel"><ProductFilters filters={filters} onChange={changeFilters} /></div>
        </div>
        <ProductTable products={visibleProducts} totalCount={categoryProducts.length} hasFilters={hasFilters} onClear={() => changeFilters({ ...defaultFilters, category: filters.category })} />
      </section>
    </div>
  );
}
