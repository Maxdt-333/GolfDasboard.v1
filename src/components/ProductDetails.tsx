"use client";

// Client boundary: details read the live catalog from context, including unsaved-to-server edits.
import ProductManagementActions from "./ProductManagementActions";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "./ProductsProvider";
import { formatPrice } from "@/lib/format";
import StatusBadge from "./StatusBadge";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import ProductNotFound from "./states/ProductNotFound";

export default function ProductDetails({ id }: { id: string }) {
  const { status, error, retry, getProductById } = useProducts();
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error ?? "Something went wrong."} onRetry={retry} />;
  const product = getProductById(id);
  if (!product) return <ProductNotFound id={id} />;

  return (
    <main className="record-workspace">
      <Link href="/products" className="back-link">← Back to products</Link>
      <div className="page-heading mt-6">
        <div><p className="eyebrow">PRODUCT / #{String(product.id).padStart(3, "0")}</p><h1 className="detail-heading">{product.name}</h1></div>
        <Link href={`/products/${product.id}/edit`} className="button-primary">Edit product <span aria-hidden="true">↗</span></Link>
      </div>
      <section className="detail-panel" aria-label="Product details">
        <div className="product-art"><Image src={product.image || product.thumbnail} unoptimized width={220} height={220} alt={`${product.name} thumbnail`} /><span className="eyebrow mt-6">FAIRWAY / {product.category.toUpperCase()}</span></div>
        <div className="p-6 sm:p-8">
          <dl className="detail-fields">
            <div><dt>Product ID</dt><dd>#{product.id}</dd></div>
            <div><dt>Product name</dt><dd>{product.name}</dd></div>
            <div><dt>Category</dt><dd>{product.category}</dd></div>
            <div><dt>Price</dt><dd className="font-semibold">{formatPrice(product.price)}</dd></div>
            <div><dt>Stock</dt><dd>{product.stock} units{product.stock === 0 ? " · Out of stock" : ""}</dd></div>
            <div><dt>Status</dt><dd><StatusBadge status={product.status} /></dd></div>
            <div><dt>Thumbnail</dt><dd><a href={product.image || product.thumbnail} target="_blank" rel="noreferrer" className="action-link">View product image</a></dd></div>
          </dl>
        </div>
      </section>
      <ProductManagementActions product={product} />
    </main>
  );
}
