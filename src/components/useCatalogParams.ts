"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";

const changeEvent = "catalog-filters-change";
function subscribe(listener: () => void) {
  window.addEventListener(changeEvent, listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("popstate", listener);
  };
}

// Synchronous notifications keep controlled inputs responsive during rapid typing.
export function useCatalogParams() {
  const routeParams = useSearchParams();
  const query = useSyncExternalStore(subscribe, () => window.location.search.slice(1), () => routeParams.toString());
  return useMemo(() => new URLSearchParams(query), [query]);
}

export function replaceCatalogParams(params: URLSearchParams) {
  window.history.replaceState(null, "", `/products${params.size ? `?${params}` : ""}`);
  window.dispatchEvent(new Event(changeEvent));
}
