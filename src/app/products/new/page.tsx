import type { Metadata } from "next";
import ProductFormPage from "@/components/ProductFormPage";

export const metadata: Metadata = { title: "Add product" };
export default function NewProductPage() { return <ProductFormPage mode="add" />; }
