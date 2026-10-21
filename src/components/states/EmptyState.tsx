"use client";

export default function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <section className="py-16 px-5 text-center">
      <span className="state-symbol mx-auto" aria-hidden="true">⌕</span>
      <h2 className="mt-4 text-xl font-semibold">No products match your filters</h2>
      <p className="muted mt-2 mb-6">Try a different search or start with a clean scorecard.</p>
      <button type="button" className="button-secondary" onClick={onClear}>Clear filters</button>
    </section>
  );
}
