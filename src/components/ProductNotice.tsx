"use client";

import { useEffect, useState } from "react";
import { CircleCheck, X } from "lucide-react";
import { useProducts } from "./ProductsProvider";
import { useViewMode } from "./ViewModeProvider";

export default function ProductNotice() {
  const { notice, noticeId, dismissNotice } = useProducts();
  const { customer } = useViewMode();
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!notice || customer || paused) return;
    const timer = window.setTimeout(dismissNotice, 8000);
    return () => window.clearTimeout(timer);
  }, [notice, noticeId, customer, paused, dismissNotice]);
  return <div className="product-notice" hidden={customer || !notice} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <CircleCheck size={20} strokeWidth={1.7} aria-hidden="true" className="notice-check" />
    <p role="status" aria-live="polite" aria-atomic="true">{customer ? "" : notice}</p>
    <button type="button" onClick={dismissNotice} aria-label="Dismiss notification"><X size={18} strokeWidth={1.7} aria-hidden="true" /></button>
  </div>;
}
