import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Fairway Golf", description: "Golf product inventory" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
