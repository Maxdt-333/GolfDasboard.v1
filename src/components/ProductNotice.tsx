"use client";

import { useEffect, useState } from "react";
import { useProducts } from "./ProductsProvider";

export default function ProductNotice() {
  const { notice, noticeId, dismissNotice } = useProducts();
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!notice || paused) return;
    const timer = window.setTimeout(dismissNotice, 8000);
    return () => window.clearTimeout(timer);
  }, [notice, noticeId, paused, dismissNotice]);
  return <div className="product-notice" hidden={!notice} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <p role="status" aria-live="polite" aria-atomic="true">{notice}</p>
    <button type="button" onClick={dismissNotice} aria-label="Dismiss notification"><span aria-hidden="true">×</span></button>
  </div>;
}
