export const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD",
}).format;

export function formatStock(stock: number): string {
  return stock === 0 ? "Out of stock" : String(stock);
}
