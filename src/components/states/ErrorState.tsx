"use client";

export default function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="state-panel" role="alert">
      <span className="state-symbol" aria-hidden="true">!</span>
      <h1 className="text-2xl font-semibold">We couldn’t load the catalog</h1>
      <p className="muted">{message}</p>
      <button type="button" className="button-primary" onClick={onRetry}>Retry</button>
    </section>
  );
}
