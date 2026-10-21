"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "./ProductsProvider";
import ProductForm from "./ProductForm";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import ProductNotFound from "./states/ProductNotFound";
import type { Product, ProductFormValues } from "@/lib/types";

const emptyValues: ProductFormValues = { name: "", category: "", price: "", stock: "", status: "" };

export default function ProductFormPage({ mode, id }: { mode: "add" | "edit"; id?: string }) {
  const { nextId, status, error, retry, getProductById, addProduct, updateProduct } = useProducts();
  const router = useRouter();
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error ?? "Could not load products."} onRetry={retry} />;
  const product = id ? getProductById(id) : undefined;
  if (mode === "edit" && !product) return <ProductNotFound id={id ?? ""} />;
  const initialValues: ProductFormValues = product ? {
    name: product.name, category: product.category, price: String(product.price), stock: String(product.stock), status: product.status,
  } : emptyValues;

  function handleSubmit(values: ProductFormValues, image?: string) {
    if (values.category === "" || values.status === "") return;
    const savedProduct: Product = {
      id: product?.id ?? nextId,
      name: values.name.trim(), category: values.category, price: Number(values.price),
      stock: Number(values.stock.trim()), status: values.status,
      thumbnail: `/thumbnails/${values.category.toLowerCase()}.svg`, image,
    };
    if (mode === "add") addProduct(savedProduct);
    else updateProduct(savedProduct);
    router.push(`/products/${savedProduct.id}`);
  }

  return <main className="record-workspace">
    <Link href="/products" className="back-link">← Back to products</Link>
    <h1 className={mode === "edit" ? "sr-only" : "form-page-title"}>{mode === "add" ? "Add product" : "Edit product"}</h1>
    <ProductForm key={`${mode}-${id ?? "new"}`} initialValues={initialValues} initialImage={product?.image} fallbackImage={product?.thumbnail} submitLabel={mode === "add" ? "Create product" : "Save changes"} onSubmit={handleSubmit} onCancel={() => router.push(product ? `/products/${product.id}` : "/products")} />
  </main>;
}
