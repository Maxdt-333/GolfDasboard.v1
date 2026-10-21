export const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format;

export function formatStock(stock: number): string {
  return stock === 0 ? "Out of stock" : String(stock);
}
