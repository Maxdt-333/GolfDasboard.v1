import { LoaderCircle } from "lucide-react";

export default function RouteLoading({ title }: { title: string }) {
  return <section className="state-panel route-loading" role="status" aria-live="polite">
    <LoaderCircle size={30} className="route-loading-icon" aria-hidden="true" />
    <h1>{title}</h1>
    <p>Opening the page…</p>
  </section>;
}
