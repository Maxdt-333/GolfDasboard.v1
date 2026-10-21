import type { Metadata } from "next";
import ProductList from "@/components/ProductList";
import { isCategory, isProductStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Products" };
// Header links seed the list controls while the parent catalog provider stays mounted.
export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : "";
  const category = isCategory(params.category) ? params.category : "All";
  const status = isProductStatus(params.status) ? params.status : "All";
  const sort = params.sort === "price-asc" || params.sort === "price-desc" ? params.sort : "none";
  return <ProductList key={JSON.stringify([search, category, status, sort])} initialSearch={search} initialCategory={category} initialStatus={status} initialSort={sort} />;
}
