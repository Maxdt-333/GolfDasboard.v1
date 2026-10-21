"use client";

import { Suspense, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./Icon";
import { useCatalogParams, replaceCatalogParams } from "./useCatalogParams";

function SearchInput() {
  const [draft, setDraft] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const params = useCatalogParams();
  const onCatalog = pathname === "/products";
  const query = onCatalog ? params.get("q") ?? "" : draft;
  function updateQuery(value: string) {
    if (!onCatalog) { setDraft(value); return; }
    const next = new URLSearchParams(params.toString());
    if (value) next.set("q", value);
    else next.delete("q");
    replaceCatalogParams(next);
  }
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onCatalog) {
      router.push(`/products${draft.trim() ? `?q=${encodeURIComponent(draft.trim())}` : ""}`, { scroll: false });
      setDraft("");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return <form className="header-search" role="search" aria-label="Search catalog" onSubmit={search}>
    <label htmlFor="catalog-search" className="sr-only">Search the catalog</label>
    <input id="catalog-search" type="search" placeholder="Search by product name…" value={query} onChange={(event) => updateQuery(event.target.value)} />
    <button type="submit" aria-label="Submit catalog search"><Icon name="search" /></button>
  </form>;
}

export default function CatalogSearch() {
  return <Suspense fallback={<div className="header-search" aria-label="Loading search" />}><SearchInput /></Suspense>;
}
