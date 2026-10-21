import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import StatusBadge from "./StatusBadge";

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="product-table">
          <caption className="sr-only">Golf product catalog with inventory, prices, stock and status</caption>
          <thead><tr>
            <th scope="col"><span className="sr-only">Thumbnail</span></th>
            <th scope="col">ID</th><th scope="col">Product name</th><th scope="col">Category</th>
            <th scope="col" className="text-right">Price</th><th scope="col" className="text-right">Stock</th>
            <th scope="col">Status</th>
          </tr></thead>
          <tbody>{products.map((product) => (
            <tr key={product.id}>
              <td><Image src={product.thumbnail} width={48} height={48} alt={`${product.name} thumbnail`} /></td>
              <td className="tabular-nums muted">#{String(product.id).padStart(3, "0")}</td>
              <td><span className="product-name">{product.name}</span></td>
              <td className="muted">{product.category}</td>
              <td className="text-right font-medium tabular-nums">{formatPrice(product.price)}</td>
              <td className={`text-right tabular-nums ${product.stock === 0 ? "text-[#8b5127]" : "muted"}`}>{product.stock === 0 ? <span>0<span className="sr-only">, out of stock</span></span> : product.stock}</td>
              <td><StatusBadge status={product.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <ul className="divide-y divide-[#e5e9e1] md:hidden" aria-label="Golf products">
        {products.map((product) => <li key={product.id} className="p-5">
          <div className="flex items-start gap-3">
            <Image src={product.thumbnail} width={48} height={48} alt={`${product.name} thumbnail`} />
            <div className="min-w-0 flex-1">
              <span className="text-xs muted">#{String(product.id).padStart(3, "0")} · {product.category}</span>
              <span className="product-name block mt-1">{product.name}</span>
            </div>
          </div>
          <dl className="my-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="muted text-xs">Price</dt><dd className="mt-1 font-semibold">{formatPrice(product.price)}</dd></div>
            <div><dt className="muted text-xs">Stock</dt><dd className="mt-1">{product.stock === 0 ? "0 · Out of stock" : `${product.stock} units`}</dd></div>
          </dl>
          <div className="flex items-center justify-between gap-3"><StatusBadge status={product.status} /></div>
        </li>)}
      </ul>
    </>
  );
}
