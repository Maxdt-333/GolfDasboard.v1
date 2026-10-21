import Link from "next/link";

export default function ProductNotFound({ id }: { id: string }) {
  return <section className="state-panel">
    <span className="eyebrow">OFF THE FAIRWAY</span>
    <h1 className="text-2xl font-semibold">Product not found</h1>
    <p className="muted break-words max-w-lg">Product #{id} not found. It may have been removed or the link is incorrect.</p>
    <Link className="button-primary" href="/products">← Back to products</Link>
  </section>;
}
