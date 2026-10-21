# Fairway Golf Dashboard

A responsive golf inventory dashboard built with Next.js, React, TypeScript and Tailwind CSS.

## Run locally

Use Node.js 20.9 or later and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/products. If that port is occupied, use `npm run dev -- --port 3200` and open http://localhost:3200/products.

## Libraries

| Library | Purpose |
| --- | --- |
| Next.js | App Router, server routes and mock API |
| React | Functional components, context and hooks |
| TypeScript | Product contracts and typed forms/props |
| Tailwind CSS | Responsive utility styling |
| Lucide React | Interface icons |
| Playwright | Desktop/mobile browser regression tests |

## Features

- Eighteen products with ID, name, category, price, stock, status and an individual photo.
- Combined case-insensitive search, category/status filtering and price sorting.
- Category-scoped inventory metrics and responsive grid/table views.
- Details pages, validated add/edit forms and unknown-ID recovery.
- Validated image uploads, archive/restore and confirmed deletion.
- Product-specific action messages with automatic and manual dismissal.
- Active-only, read-only customer preview.
- Loading, request-error/retry and empty-result states with labelled controls.

Data comes from a local JSON fixture through GET `/api/products`. Mutations and uploaded images remain in memory during navigation and reset on refresh. No database, credentials or external image service is required. Customer preview is a display preference rather than authentication.

Sidebar categories preserve search, status and sort. Metrics describe the selected category; the result count describes the filtered products. Clear filters preserves category. Newest first uses descending product ID. URL controls are restored on reload.

With a fresh page load, `/products?simulate=slow` delays the initial request by two seconds, and `/products?simulate=error` demonstrates a failed request. Retry makes a normal request. Search and filters remain immediate.

## Check and test

```sh
npm run lint
npm run build
npx playwright install chromium
npm test
```

Playwright builds the app and starts its own production server on port 3100; leave that port free. Eight scenarios run on desktop and mobile Chromium, giving 16 test executions.

```sh
npm run test:report
npm run test:ui
```

See [testing](docs/TESTING.md) for coverage and reports. GitHub Actions runs TypeScript, lint and browser checks on main pushes and pull requests. Check the Actions tab for remote results.

## Screenshots

// TODO: Add desktop and mobile screenshots.

## Implementation

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for architecture, validation, dependencies, tradeoffs, verification and contributions.
