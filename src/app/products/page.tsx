import type { Metadata } from "next";
import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import LoadingState from "@/components/states/LoadingState";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <Suspense fallback={<LoadingState />}><ProductList /></Suspense>;
}
