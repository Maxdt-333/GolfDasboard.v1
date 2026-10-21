"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";

export default function CatalogSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query.trim())}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return <form className="header-search" role="search" aria-label="Search catalog" onSubmit={search}>
    <label htmlFor="catalog-search" className="sr-only">Search the catalog</label>
    <input id="catalog-search" placeholder="Search your catalog…" value={query} onChange={(event) => setQuery(event.target.value)} />
    <button type="submit" aria-label="Submit catalog search"><Icon name="search" /></button>
  </form>;
}
