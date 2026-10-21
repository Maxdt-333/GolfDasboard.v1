import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };
export default function NotFound() {
  return <section className="state-panel"><p className="eyebrow">404 / OFF THE FAIRWAY</p><h1>Page not found</h1><p className="muted">This page isn’t in the catalog.</p><Link href="/products" className="button-primary">← Back to products</Link></section>;
}
