"use client";

import { useViewMode } from "./ViewModeProvider";
import { useState } from "react";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "./NavigationLink";
import type { Product } from "@/lib/types";
import { formatPrice, formatStock } from "@/lib/format";
import { productImage } from "@/lib/productImages";
import StatusBadge from "./StatusBadge";
import Icon from "./Icon";
import EmptyState from "./states/EmptyState";

function ProductActions({ product }: { product: Product }) {
  const { customer } = useViewMode();
  return <div className="product-actions"><Link href={`/products/${product.id}`} className="action-link" aria-label={`View ${product.name}`}><Eye size={15} strokeWidth={1.7} aria-hidden="true" /> View</Link>{!customer && <Link href={`/products/${product.id}/edit`} className="edit-link" aria-label={`Edit ${product.name}`}><Icon name="edit" width="14" /> Edit product</Link>}</div>;
}
interface Props { products: Product[]; totalCount: number; hasFilters: boolean; onClear: () => void }

export default function ProductTable({ products, totalCount, hasFilters, onClear }: Props) {
  const { customer } = useViewMode();
  // Display preference is separate from the catalog and filtering state.
  const [view, setView] = useState<"grid" | "table">("grid");
  return <div className="product-display" id="inventory">
    <div className="results-bar"><div className="flex flex-wrap items-center gap-4"><p aria-live="polite" aria-atomic="true">Showing <strong>{products.length}</strong> of {totalCount} products</p>{hasFilters && <button type="button" className="clear-filters" onClick={onClear}>Clear filters</button>}</div>{!customer && <div className="view-switch hidden md:flex" aria-label="Product display"><button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Icon name="grid" width="17" /></button><button type="button" aria-label="Table view" aria-pressed={!customer && view === "table"} onClick={() => setView("table")}><Icon name="list" width="19" /></button></div>}</div>
    {!products.length ? <EmptyState onClear={onClear} /> : <>
      {!customer && view === "table" && <div className="hidden md:block table-panel"><table className="product-table"><caption className="sr-only">Golf product catalog with inventory, prices, and product actions</caption><thead><tr><th scope="col"><span className="sr-only">Thumbnail</span></th><th scope="col">ID</th><th scope="col">Product name</th><th scope="col">Category</th><th scope="col" className="text-right">Price</th><th scope="col" className="text-right">Stock</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><Image src={productImage(product)} unoptimized width={48} height={48} loading="eager" alt={`${product.name} thumbnail`} /></td><td className="muted">#{String(product.id).padStart(3, "0")}</td><td><Link href={`/products/${product.id}`} className="product-name">{product.name}</Link></td><td className="muted">{product.category}</td><td className="text-right font-semibold tabular-nums">{formatPrice(product.price)}</td><td className="text-right tabular-nums">{product.stock}</td><td><StatusBadge status={product.status} /></td><td><ProductActions product={product} /></td></tr>)}</tbody></table></div>}
      <ul className={`product-grid ${!customer && view === "table" ? "table-mode" : ""}`} aria-label="Golf products">{products.map((product) => <li key={product.id} className="product-card"><div className="card-image-wrap"><Link href={`/products/${product.id}`} aria-label={`See ${product.name}`}><Image src={productImage(product)} width={480} height={480} unoptimized loading="eager" alt={`${product.category} equipment image for ${product.name}`} /></Link>{!customer && <span className="card-status"><StatusBadge status={product.status} /></span>}</div><div className="card-body"><p className="product-meta">{product.category.toUpperCase()}{!customer && <span>#{String(product.id).padStart(3, "0")}</span>}</p><Link href={`/products/${product.id}`} className="product-name">{product.name}</Link><div className="price-stock"><p className="product-price">{formatPrice(product.price)}</p><span className={product.stock === 0 ? "out-of-stock" : "stock-text"}>{customer ? (product.stock > 0 ? "In stock" : "Out of stock") : <>{formatStock(product.stock)}{product.stock > 0 ? " in stock" : ""}</>}</span></div><ProductActions product={product} /></div></li>)}</ul>
    </>}
  </div>;
}
