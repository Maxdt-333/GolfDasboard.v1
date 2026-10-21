import { Suspense } from "react";
import { ProductsProvider } from "@/components/ProductsProvider";
import ProductNotice from "@/components/ProductNotice";
import LoadingState from "@/components/states/LoadingState";

// Server layout persists across product routes; Suspense contains useSearchParams.
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingState />}><ProductsProvider><ProductNotice />{children}</ProductsProvider></Suspense>;
}
