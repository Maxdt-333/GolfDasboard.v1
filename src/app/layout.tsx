import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Fairway Dashboard", description: "Golf product inventory workspace" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><header className="site-header"><Link href="/products" aria-label="Fairway products">FAIRWAY</Link><span>Owner workspace</span></header>{children}</body></html>; }
