"use client";

// Client boundary: details read the live catalog from context, including unsaved-to-server edits.
import { useViewMode } from "./ViewModeProvider";
import Image from "next/image";
import Link from "next/link";
import ProductManagementActions from "./ProductManagementActions";
import { useProducts } from "./ProductsProvider";
import { formatPrice } from "@/lib/format";
import StatusBadge from "./StatusBadge";
import { productImage } from "@/lib/productImages";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import ProductNotFound from "./states/ProductNotFound";

export default function ProductDetails({ id }: { id: string }) {
  const { customer } = useViewMode();
  const { status, error, retry, getProductById } = useProducts();
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error ?? "Something went wrong."} onRetry={retry} />;
  const product = getProductById(id);
  if (!product || (customer && product.status !== "Active")) return <ProductNotFound id={id} />;

  return (
    <>
      <Link href="/products" className="back-link">← Back to products</Link>
      <div className="page-heading mt-6">
        <div><p className="eyebrow">{customer ? product.category : `PRODUCT / #${String(product.id).padStart(3, "0")}`}</p><h1 className="detail-heading">{product.name}</h1><p className="muted mt-3">The details behind the gear.</p></div>
        {!customer && <Link href={`/products/${product.id}/edit`} className="button-primary">Edit product <span aria-hidden="true">↗</span></Link>}
      </div>
      <section className="detail-panel" aria-label="Product details">
        <div className="product-art"><Image src={productImage(product)} width={640} height={640} unoptimized alt={`${product.category} equipment image for ${product.name}`} /><span className="eyebrow mt-6">FAIRWAY / {product.category.toUpperCase()}</span></div>
        <div className="p-6 sm:p-8">
          <dl className="detail-fields">
            {!customer && <div><dt>Product ID</dt><dd>#{product.id}</dd></div>}
            <div><dt>Product name</dt><dd>{product.name}</dd></div>
            <div><dt>Category</dt><dd>{product.category}</dd></div>
            <div><dt>Price</dt><dd className="font-semibold">{formatPrice(product.price)}</dd></div>
            <div><dt>Stock</dt><dd>{customer ? (product.stock > 0 ? "In stock" : "Out of stock") : `${product.stock} units${product.stock === 0 ? " · Out of stock" : ""}`}</dd></div>
            {!customer && <><div><dt>Status</dt><dd><StatusBadge status={product.status} /></dd></div>
            <div><dt>Thumbnail</dt><dd><a href={productImage(product)} target="_blank" rel="noreferrer" className="text-link">View product image</a></dd></div></>}
          </dl>
        </div>
      </section>
      {!customer && <ProductManagementActions product={product} />}
    </>
  );
}
