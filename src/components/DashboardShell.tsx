"use client";

import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Box, Leaf, Menu, X } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { CATEGORIES, isCategory } from "@/lib/types";
import { TopLink, useViewMode, ViewModeSwitch } from "./ViewModeProvider";
import CatalogSearch from "./CatalogSearch";

function CategoryNavigation({ onNavigate }: { onNavigate: () => void }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const category = params.get("category");
  const selected = pathname === "/products" && isCategory(category) ? category : "All";
  function categoryHref(category: string) {
    const next = new URLSearchParams(pathname === "/products" ? params.toString() : "");
    if (category === "All") next.delete("category");
    else next.set("category", category);
    return `/products${next.size ? `?${next}` : ""}`;
  }
  return (
    <nav id="workspace-navigation" className="workspace-navigation" aria-label="Product categories">
      <TopLink href={categoryHref("All")} className={`workspace-nav-link ${selected === "All" ? "selected" : ""}`} aria-current={selected === "All" ? "page" : undefined} onClick={onNavigate}>
        <Box size={22} strokeWidth={1.7} aria-hidden="true" /> Products
      </TopLink>
      {CATEGORIES.map((item) => {
        return <TopLink key={item} href={categoryHref(item)} className={`workspace-nav-link ${selected === item ? "selected" : ""}`} aria-current={selected === item ? "page" : undefined} onClick={onNavigate}>
          <CategoryIcon category={item} />{item === "Balls" ? "Golf balls" : item}
        </TopLink>;
      })}
    </nav>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { customer } = useViewMode();
  const pathname = usePathname();
  const recordPage = pathname.startsWith("/products/");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={`workspace-shell${customer ? " customer-workspace" : ""}${recordPage ? " record-workspace" : ""}`}>
      <aside className={`workspace-sidebar${menuOpen ? " menu-open" : ""}`} aria-label="Workspace navigation">
        <div className="workspace-brand-row">
          <TopLink href="/products" className="workspace-brand" aria-label="Fairway home"><Leaf size={29} strokeWidth={1.7} aria-hidden="true" /> FAIRWAY</TopLink>
          <button type="button" className="workspace-menu-button" aria-expanded={menuOpen} aria-controls="workspace-navigation" aria-label={menuOpen ? "Close category menu" : "Open category menu"} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        <Suspense fallback={<div className="navigation-placeholder" aria-label="Loading navigation" />}><CategoryNavigation onNavigate={() => setMenuOpen(false)} /></Suspense>
        <div className="workspace-sidebar-footer"><ViewModeSwitch /></div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-topbar"><CatalogSearch /><span className="workspace-mode"><span aria-hidden="true" />{customer ? "Customer preview · Read only" : "Owner workspace"}</span></header>
        {children}
      </div>
    </div>
  );
}
