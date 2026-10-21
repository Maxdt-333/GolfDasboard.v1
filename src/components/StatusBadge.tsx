import type { ProductStatus } from "@/lib/types";

const colors: Record<ProductStatus, string> = {
  Active: "bg-[#e9f2e6] text-[#305d34]",
  Draft: "bg-[#faf0d8] text-[#785618]",
  Archived: "bg-[#eef0ef] text-[#525d58]",
};
export default function StatusBadge({ status }: { status: ProductStatus }) {
  return <span className={`status-badge ${colors[status]}`}><span aria-hidden="true">●</span>{status}</span>;
}
