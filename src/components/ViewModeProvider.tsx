"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link, { type LinkProps } from "next/link";

// A preview preference, not an authorization or authentication boundary.
const ViewModeContext = createContext<{ customer: boolean; toggle: () => void } | null>(null);
export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState(false);
  const router = useRouter();
  function toggle() {
    setCustomer((previous) => !previous);
    router.push("/products", { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return <ViewModeContext.Provider value={{ customer, toggle }}>{children}</ViewModeContext.Provider>;
}
export function useViewMode() {
  const value = useContext(ViewModeContext);
  if (!value) throw new Error("View mode needs ViewModeProvider.");
  return value;
}
export function ViewModeSwitch() {
  const { customer, toggle } = useViewMode();
  return <div className="mode-control"><span className="mode-label">{customer ? "Customer view · Read only" : "Owner workspace"}</span><button type="button" className="mode-toggle" onClick={toggle}>{customer ? "Manage products" : "Customer preview"}<span aria-hidden="true">↗</span></button></div>;
}
// Header links always take the visitor to the top, including query-only changes.
export function TopLink({ children, ...props }: LinkProps & { children: React.ReactNode; className?: string; "aria-label"?: string; "aria-current"?: "page"; onClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return <Link {...props} scroll={false} onNavigate={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{children}</Link>;
}
