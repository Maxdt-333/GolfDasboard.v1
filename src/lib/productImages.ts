import type { Category, Product } from "./types";

// Original product photography. Uploaded photos always override catalog defaults.
export const categoryImages: Record<Category, string> = {
  Clubs: "/images/driver.webp", Balls: "/images/balls.webp", Apparel: "/images/golf-polo.webp",
  Accessories: "/images/rangefinder.webp", Training: "/images/training.webp",
};
const catalogImages: Record<number, { category: Category; file: string }> = {
  1: { category: "Clubs", file: "driver" },
  2: { category: "Clubs", file: "putter" },
  3: { category: "Clubs", file: "irons" },
  4: { category: "Clubs", file: "wedge" },
  5: { category: "Balls", file: "balls" },
  6: { category: "Balls", file: "distance-balls" },
  7: { category: "Balls", file: "practice-balls" },
  8: { category: "Apparel", file: "golf-polo" },
  9: { category: "Apparel", file: "golf-trousers" },
  10: { category: "Apparel", file: "rain-jacket" },
  11: { category: "Apparel", file: "golf-cap" },
  12: { category: "Accessories", file: "rangefinder" },
  13: { category: "Accessories", file: "golf-towel" },
  14: { category: "Accessories", file: "scorecard-holder" },
  15: { category: "Accessories", file: "bamboo-tees" },
  16: { category: "Training", file: "alignment-mirror" },
  17: { category: "Training", file: "training" },
  18: { category: "Training", file: "swing-trainer" },
};
export function productImage(product: Product): string {
  if (product.image) return product.image;
  const catalogImage = catalogImages[product.id];
  if (catalogImage?.category === product.category) return `/images/${catalogImage.file}.webp`;
  return categoryImages[product.category];
}
