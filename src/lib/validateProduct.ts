import { CATEGORIES, STATUSES, type ProductFormValues, type FormErrors } from "./types";

// Accept plain USD amounts, never JavaScript numeric syntax such as 1e3 or 0x10.
const moneyPattern = /^(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/;
const negativeMoneyPattern = /^-(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/;

export function validateProduct(v: ProductFormValues): FormErrors {
  const errors: FormErrors = {};
  if (v.name.trim() === "") errors.name = "Enter a product name.";
  if (v.category === "") errors.category = "Choose a category.";
  else if (!CATEGORIES.some((category) => category === v.category)) errors.category = "Choose a valid category from the list.";
  if (v.status === "") errors.status = "Choose a status.";
  else if (!STATUSES.some((status) => status === v.status)) errors.status = "Choose a valid status from the list.";

  const price = v.price.trim();
  if (price === "") errors.price = "Enter a price in US dollars.";
  else if (negativeMoneyPattern.test(price)) errors.price = "Price must be greater than 0.";
  else if (!moneyPattern.test(price)) errors.price = "Use numbers with up to 2 decimal places, such as 19.99. Do not include letters, currency symbols, or commas.";
  else if (!Number.isFinite(Number(price)) || Number(price) > Number.MAX_SAFE_INTEGER / 100) errors.price = "Price is too large. Enter a smaller amount.";
  else if (Number(price) <= 0) errors.price = "Price must be greater than 0.";

  const stock = v.stock.trim();
  if (stock === "") errors.stock = "Enter the stock quantity. Use 0 if none are available.";
  else if (/^-\d+(?:\.\d+)?$/.test(stock)) errors.stock = "Stock cannot be negative. Enter 0 or more.";
  else if (/^\d*\.\d+$/.test(stock)) errors.stock = "Stock must be a whole number, such as 5 instead of 5.5.";
  else if (!/^\d+$/.test(stock)) errors.stock = "Use digits only for stock, such as 12. Do not include letters, commas, or symbols.";
  else if (!Number.isSafeInteger(Number(stock))) errors.stock = "Stock quantity is too large. Enter a smaller whole number.";
  return errors;
}
