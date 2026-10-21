import { Backpack, Shirt, Target } from "lucide-react";
import type { Category } from "@/lib/types";

export default function CategoryIcon({ category }: { category: Category }) {
  if (category === "Apparel") return <Shirt size={22} strokeWidth={1.7} aria-hidden="true" />;
  if (category === "Accessories") return <Backpack size={22} strokeWidth={1.7} aria-hidden="true" />;
  if (category === "Training") return <Target size={22} strokeWidth={1.7} aria-hidden="true" />;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {category === "Clubs" ? <><path d="m17 3-6.5 13" /><path d="M10.5 16c-2-.8-4.5.1-6 1.8-1 1.2-.3 2.7 1.3 2.9 2.7.4 5.6-1.2 6.1-3.1L10.5 16Z" /></> : <><circle cx="12" cy="12" r="9" /><path d="m8 8 .3.2M13 6.5l.3.2M17 10l.3.2M7 13l.3.2M12 11l.3.2M11 17l.3.2M16 15l.3.2" /></>}
    </svg>
  );
}
