import type { Metadata } from "next";
import ProductDetails from "@/components/ProductDetails";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Product #${id}` };
}
// Server Component: unwrap route params before passing the ID across the client boundary.
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetails id={id} />;
}
