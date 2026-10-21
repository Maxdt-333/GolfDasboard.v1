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

## Product API

GET `/api/products` returns 18 products from a local JSON fixture. Each record includes ID, name, category, price, stock, status and a thumbnail. Categories are Clubs, Balls, Apparel, Accessories and Training.

The client API helper validates response structure, allowed categories/statuses, numeric fields and unique IDs. HTTP failures and invalid responses produce useful errors.

Use `/api/products?fail=1` to simulate HTTP 500 or `/api/products?delay=2000` for a delayed response. Delays are bounded to five seconds. No database or credentials are required.

## Implementation

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for implementation details and contributions.
