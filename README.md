# Fairway Golf

Golf product inventory built with Next.js, React and TypeScript.

## Setup

Use Node.js 20.9 or later and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/products.

```sh
npm run lint
npm run build
```

## Catalog

The catalog displays all 18 products with ID, name, category, price, stock, status and a thumbnail. Desktop/tablet use a table; mobile uses cards with the same fields.

Search is case-insensitive and combines with category/status filters and both price sorts. Newest first sorts by descending product ID. Category metrics describe the whole selected category, while the result count describes the filtered results. Clear filters resets all controls.

Loading, request-error/retry and empty-result states provide feedback. Open `/products?simulate=error` to check Retry or `/products?simulate=slow` for a delayed initial request. Filtering happens immediately without additional requests or artificial delays.

## Product details and editing

Product names open `/products/[id]`. Edit actions open the prefilled form, and Add product opens a blank form. Unknown IDs show a useful message and a link back to the catalog.

Name, category and status are required. Price must be a positive plain USD amount with up to two decimal places; stock must be a non-negative whole number. Invalid input stays visible with specific feedback, and submission focuses the first invalid field. Zero stock is valid.

Saving updates the shared inventory and opens the saved details. Cancel discards unsaved form changes. Changes persist during in-app navigation and reset on refresh. Confirmation messages identify the product and action, dismiss after eight seconds, pause during hover/focus, and support manual dismissal.

## Images and inventory actions

Forms accept optional JPG, PNG and WebP images up to 5 MB. Invalid types, oversized files and corrupt images produce specific errors and block saving. Save is disabled while processing. Failed replacement can retain the current photo; removal restores category artwork. Cancel discards unsaved image changes.

Archive retains the record; Restore to draft changes its status to Draft. Delete requires a confirmation naming the product, with Cancel initially focused. Cancel/Escape leave the record untouched. Confirmed deletion updates the inventory and returns to the catalog. IDs are not reused during the session. Action messages distinguish create, update, archive, restore and delete.

Uploaded images and all product mutations remain in memory during navigation and reset on refresh.

## Product API

GET `/api/products` returns 18 products from a local JSON fixture. Each record includes ID, name, category, price, stock, status and a thumbnail. Categories are Clubs, Balls, Apparel, Accessories and Training.

The client API helper validates response structure, allowed categories/statuses, numeric fields and unique IDs. HTTP failures and invalid responses produce useful errors.

Use `/api/products?fail=1` to simulate HTTP 500 or `/api/products?delay=2000` for a delayed response. Delays are bounded to five seconds. No database or credentials are required.

## Implementation

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for implementation details and contributions.
