import type { Metadata } from "next";
import ProductFormPage from "@/components/ProductFormPage";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit product #${id}` };
}
export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductFormPage mode="edit" id={id} />;
}
