# Fairway Golf

Golf product inventory built with Next.js, React and TypeScript.

## Setup

Use Node.js 20.9 or later and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm run lint
npm run build
```

## Product API

GET `/api/products` returns 18 products from a local JSON fixture. Each record includes ID, name, category, price, stock, status and a thumbnail. Categories are Clubs, Balls, Apparel, Accessories and Training.

The client API helper validates response structure, allowed categories/statuses, numeric fields and unique IDs. HTTP failures and invalid responses produce useful errors.

Use `/api/products?fail=1` to simulate HTTP 500 or `/api/products?delay=2000` for a delayed response. Delays are bounded to five seconds. No database or credentials are required.

## Implementation

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for implementation details and contributions.
