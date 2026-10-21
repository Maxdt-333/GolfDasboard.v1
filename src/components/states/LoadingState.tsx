export default function LoadingState() {
  return (
    <section className="state-panel" role="status">
      <span className="loading-ring" aria-hidden="true" />
      <h1 className="text-xl font-semibold">Getting the catalog ready</h1>
      <p className="muted">Your next great round starts here.</p>
      <span className="sr-only">Loading products…</span>
    </section>
  );
}
