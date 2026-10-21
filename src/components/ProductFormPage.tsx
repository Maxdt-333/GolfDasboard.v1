"use client";

// Client boundary: connect form events to catalog updates and client-side navigation.
import { useViewMode } from "./ViewModeProvider";
import { productImage } from "@/lib/productImages";
import Link from "./NavigationLink";
import { useRouter } from "next/navigation";
import { useProducts } from "./ProductsProvider";
import ProductForm from "./ProductForm";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import ProductNotFound from "./states/ProductNotFound";
import type { Product, ProductFormValues } from "@/lib/types";

const emptyValues: ProductFormValues = { name: "", category: "", price: "", stock: "", status: "" };

export default function ProductFormPage({ mode, id }: { mode: "add" | "edit"; id?: string }) {
  const { customer } = useViewMode();
  const { nextId, status, error, retry, getProductById, addProduct, updateProduct } = useProducts();
  const router = useRouter();
  if (customer) return <section className="state-panel"><p className="eyebrow">CUSTOMER PREVIEW</p><h1>This view is read only</h1><p className="muted">Use Manage products in the navigation menu to add or edit products.</p><Link href="/products" className="button-primary">Explore the collection</Link></section>;
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error ?? "Something went wrong."} onRetry={retry} />;
  const product = id ? getProductById(id) : undefined;
  if (mode === "edit" && !product) return <ProductNotFound id={id ?? ""} />;
  const initialValues: ProductFormValues = product ? {
    name: product.name, category: product.category, price: product.price.toFixed(2), stock: String(product.stock), status: product.status,
  } : emptyValues;

  function handleSubmit(values: ProductFormValues, image?: string) {
    // ProductForm has validated required values before this callback.
    if (values.category === "" || values.status === "") return;
    const savedProduct: Product = {
      id: product?.id ?? nextId,
      name: values.name.trim(), category: values.category, price: Number(values.price),
      stock: parseInt(values.stock.trim(), 10), status: values.status,
      image,
      thumbnail: `/thumbnails/${values.category.toLowerCase()}.svg`,
    };
    if (mode === "add") addProduct(savedProduct);
    else updateProduct(savedProduct);
    router.push(`/products/${savedProduct.id}`);
  }
  function handleCancel() {
    if (window.history.length > 1) router.back();
    else router.push("/products");
  }

  return (
    <>
      <Link href="/products" className="back-link">← Back to products</Link>
      <h1 className={mode === "edit" ? "sr-only" : "form-page-title"}>{mode === "add" ? "Add product" : "Edit product"}</h1>
      <div className="editor-layout">
        <ProductForm key={`${mode}-${id ?? "new"}`} initialValues={initialValues} initialImage={product?.image} fallbackImage={product ? productImage({ ...product, image: undefined }) : undefined} submitLabel={mode === "add" ? "Create product" : "Save changes"} onSubmit={handleSubmit} onCancel={handleCancel} />

      </div>
    </>
  );
}
