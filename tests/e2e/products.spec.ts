import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

// Each test receives a fresh browser context: mutations cannot leak into another test.
async function expectInventory(page: Page, count = 18) {
  await expect(page.getByText(`Showing ${count} of ${count} products`, { exact: true })).toBeVisible();
}

async function chooseCategory(page: Page, name: string) {
  const menu = page.getByRole("button", { name: "Open category menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("navigation", { name: "Product categories" }).getByRole("link", { name, exact: true }).click();
}

async function fillProduct(page: Page, name: string) {
  await page.getByLabel("Product name", { exact: true }).fill(name);
  await page.getByLabel("Category", { exact: true }).selectOption("Clubs");
  await page.getByLabel("Price (USD)", { exact: true }).fill("59.95");
  await page.getByLabel("Stock", { exact: true }).fill("0");
  await page.getByLabel("Status", { exact: true }).selectOption("Active");
}

test("catalog shows complete products and category-specific counts", async ({ page }) => {
  await page.goto("/products");
  await expectInventory(page);
  const cards = page.getByRole("list", { name: "Golf products" }).getByRole("listitem");
  await expect(cards).toHaveCount(18);
  const driver = cards.filter({ hasText: "Tour Driver" });
  await expect(driver).toContainText("Tour Driver");
  await expect(cards.first()).toContainText("#018");
  await expect(driver).toContainText("#001");
  await expect(driver).toContainText("CLUBS");
  await expect(driver).toContainText("$349.99");
  await expect(driver).toContainText("12 in stock");
  await expect(driver).toContainText("Active");
  await expect(driver.getByRole("img")).toBeVisible();

  await chooseCategory(page, "Clubs");
  await expect(page.getByRole("heading", { name: "Clubs", exact: true })).toBeVisible();
  await expect(page.locator(".clubhouse-metric strong")).toHaveText(["4", "3", "1", "1"]);
  await expectInventory(page, 4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("search, category, status and both price sorts work together in either order", async ({ page }) => {
  await page.goto("/products");
  await expectInventory(page);
  await page.getByLabel("Search products", { exact: true }).pressSequentially("bAlLs");
  await page.getByLabel("Status", { exact: true }).selectOption("Active");
  await page.getByLabel("Sort by", { exact: true }).selectOption("price-desc");
  await chooseCategory(page, "Golf balls");
  await expect(page.getByLabel("Search products", { exact: true })).toHaveValue("bAlLs");
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue("Active");
  await expect(page.locator(".product-price")).toHaveText(["$44.99", "$24.95"]);
  await page.getByLabel("Sort by", { exact: true }).selectOption("price-asc");
  await expect(page.locator(".product-price")).toHaveText(["$24.95", "$44.99"]);
  await page.getByLabel("Search products", { exact: true }).fill("no matching golf product");
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters", exact: true }).first().click();
  await expectInventory(page, 3);
  await expect(page.getByRole("heading", { name: "Golf balls", exact: true })).toBeVisible();
});

test("required and malformed fields block saving and preserve input for correction", async ({ page }) => {
  await page.goto("/products/new");
  await page.getByRole("button", { name: "Create product", exact: true }).click();
  await expect(page.locator("[aria-invalid='true']")).toHaveCount(5);
  await expect(page.getByLabel("Product name", { exact: true })).toBeFocused();
  await fillProduct(page, "Validation check");
  await page.getByLabel("Price (USD)", { exact: true }).fill("letters");
  await page.getByLabel("Stock", { exact: true }).fill("1.5");
  await page.getByRole("button", { name: "Create product", exact: true }).click();
  await expect(page.getByLabel("Price (USD)", { exact: true })).toHaveValue("letters");
  await expect(page.getByLabel("Price (USD)", { exact: true })).toBeFocused();
  await expect(page.locator("#price-error")).toContainText("2 decimal places");
  await expect(page.locator("#stock-error")).toContainText("whole number");
  await expect(page).toHaveURL(/\/products\/new$/);
});

test("create and edit update details, inventory and session counts", async ({ page }) => {
  await page.goto("/products/new");
  await fillProduct(page, "Automation Wedge");
  await page.getByRole("button", { name: "Create product", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Automation Wedge", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("was created");
  await page.getByRole("link", { name: "Edit product", exact: true }).click();
  await expect(page.getByLabel("Product name", { exact: true })).toHaveValue("Automation Wedge");
  await page.getByLabel("Product name", { exact: true }).fill("Updated Automation Wedge");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Updated Automation Wedge", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("was updated");
  await chooseCategory(page, "Clubs");
  await expect(page.locator(".clubhouse-metric strong")).toHaveText(["5", "4", "1", "2"]);
  await expect(page.getByRole("link", { name: "Updated Automation Wedge", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator(".clubhouse-metric strong")).toHaveText(["4", "3", "1", "1"]);
});

test("archive, restore and confirmed deletion announce the actual action", async ({ page }) => {
  await page.goto("/products/1");
  await page.clock.install();
  await page.getByRole("button", { name: "Archive product", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("was archived");
  await page.mouse.move(0, 0);
  await page.clock.fastForward(8100);
  await expect(page.getByRole("status")).not.toBeVisible();
  await page.getByRole("button", { name: "Restore to draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("was restored as Draft");
  await page.getByRole("button", { name: "Delete product", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Delete this product?", exact: true });
  await expect(dialog).toContainText("Tour Driver");
  await expect(dialog.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Tour Driver · 10.5°", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete product", exact: true }).click();
  await dialog.getByRole("button", { name: "Yes, delete product", exact: true }).click();
  await expectInventory(page, 17);
  await expect(page.getByRole("status")).toContainText("was deleted");
});

test("loading, failed requests and unknown IDs have useful recovery states", async ({ page }) => {
  // Control completion with a promise rather than an arbitrary sleep.
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/products?**", async (route) => { await gate; await route.continue(); });
  await page.goto("/products");
  try {
    await expect(page.getByRole("heading", { name: "Getting the catalog ready", exact: true })).toBeVisible();
  } finally {
    release();
  }
  await expectInventory(page);
  await page.unroute("**/api/products?**");
  await page.goto("/products?simulate=error");
  await expect(page.getByRole("alert").filter({ hasText: "Could not load products" })).toBeVisible();
  await page.getByRole("button", { name: /Retry|Try again/i }).click();
  await expectInventory(page);
  await page.goto("/products/9999");
  await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /products/i }).last()).toBeVisible();
});

test("invalid uploads block saving and valid product photos appear after save", async ({ page }) => {
  await page.goto("/products/new");
  await fillProduct(page, "Photo Upload Wedge");
  const upload = page.getByLabel("Upload product image", { exact: true });
  await upload.setInputFiles({ name: "invalid.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") });
  await expect(page.locator("#image-error")).toContainText("Choose a JPG, PNG, or WebP");
  await page.getByRole("button", { name: "Create product", exact: true }).click();
  await expect(page.getByRole("button", { name: "Upload image", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Use collection image", exact: true }).click();
  await upload.setInputFiles(path.join(process.cwd(), "public/images/golf-polo.webp"));
  await expect(page.getByText(/Your own product photo/)).toBeVisible();
  await page.getByRole("button", { name: "Create product", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Photo Upload Wedge", exact: true })).toBeVisible();
  await expect(page.locator(".product-art img")).toHaveAttribute("src", /^data:image\/webp/);
});

test("Customer preview shows Active products and prevents editing through history", async ({ page }) => {
  await page.goto("/products/1/edit");
  await expect(page.getByLabel("Product name", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Customer preview", exact: false }).click();
  await expectInventory(page, 12);
  await expect(page.getByRole("link", { name: "Add product", exact: true })).toHaveCount(0);
  await expect(page.locator("a[href$='/edit']")).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole("heading", { name: "This view is read only", exact: true })).toBeVisible();
  await expect(page.getByLabel("Product name", { exact: true })).toHaveCount(0);
});
