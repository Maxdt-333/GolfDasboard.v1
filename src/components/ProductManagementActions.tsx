"use client";

import { useId, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useProducts } from "./ProductsProvider";
import { useViewMode } from "./ViewModeProvider";

export default function ProductManagementActions({ product }: { product: Product }) {
  const { updateProduct, deleteProduct } = useProducts();
  const { customer } = useViewMode();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  if (customer) return null;

  function confirmDelete() {
    dialog.current?.showModal();
    cancel.current?.focus();
  }
  function removeProduct() {
    if (customer) return;
    deleteProduct(product.id);
    dialog.current?.close();
    router.replace("/products");
  }
  const archived = product.status === "Archived";
  return <section className="management-panel" aria-labelledby="management-heading">
    <div><h2 id="management-heading">Manage this product</h2><p>{archived ? "Archived products stay in your inventory and are hidden from Customer preview." : "Archive to hide it from Customer preview, or delete it from your inventory."}</p></div>
    <div className="management-buttons"><button type="button" className="button-secondary" onClick={() => updateProduct({ ...product, status: archived ? "Draft" : "Archived" })}>{archived ? "Restore to draft" : "Archive product"}</button><button type="button" className="button-danger-outline" onClick={confirmDelete}>Delete product</button></div>
    <dialog ref={dialog} className="confirm-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <span className="delete-symbol" aria-hidden="true">!</span>
      <h2 id={titleId}>Delete this product?</h2>
      <p id={descriptionId}>Are you sure you want to delete <strong>“{product.name}”</strong>? It will be removed from your inventory and Customer preview. This cannot be undone during this session.</p>
      <div className="dialog-buttons"><button ref={cancel} type="button" className="button-secondary" onClick={() => dialog.current?.close()}>Cancel</button><button type="button" className="button-danger" onClick={removeProduct}>Yes, delete product</button></div>
    </dialog>
  </section>;
}
