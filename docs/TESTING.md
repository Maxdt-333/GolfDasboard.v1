# Testing

## Run

```sh
npm ci
npx playwright install chromium
npm test
```

Tests build and start production on http://127.0.0.1:3100, wait for the API, run and shut down the server. No separate app process is needed. Port 3100 must be available.

```sh
npm run test:report
npm run test:ui
npm test -- --project=desktop-chromium
npm test -- --grep "search, category"
```

## Coverage

The product-search scenario verifies one search input in each view, clearing and repeated queries, and preservation of status and sort. Customer preview also checks an Active product with zero stock and excludes Draft/Archived items.

Eleven scenarios run on desktop and mobile Chromium: 22 executions.

| Scenario | Coverage |
| --- | --- |
| Catalog | Product fields, images, category counts and page overflow |
| Filters | Mixed-case search, category/status combinations, both price sorts and empty/reset behavior |
| Validation | Required fields, numeric formats, first-error focus and preserved invalid input |
| Create/edit | Prefilled values, named feedback, updated details/counts and refresh behavior |
| Management | Archive/restore, confirmed deletion, cancellation and action notices |
| Recovery | Controlled loading, HTTP errors, Retry and unknown IDs |
| Images | Invalid uploads block Save; valid images appear after saving |
| Preview | Active-only collection, hidden controls and history-based edit guard |
| Currency and image preview | Two-decimal price values, in-page enlargement and Close/Escape behavior |
| Navigation feedback | Loading feedback while details/edit route requests are deliberately held |

## Reliability and reports

Each test has a fresh browser context. Assertions retry observable results rather than using arbitrary sleeps. A promise-controlled intercepted request makes loading deterministic. Accessible roles/labels are preferred; stable classes identify metric and image groups. Two workers run without local retries; CI allows one retry.

Failures retain traces and screenshots. The HTML report is available through `npm run test:report`. Reports and generated artifacts are ignored by Git.

## Continuous integration

The workflow installs dependencies and Chromium on Node.js 24, checks TypeScript and ESLint, then runs the suite. It runs on main pushes, pull requests targeting main and manual dispatch. Repository permissions are read-only and reports are retained for seven days. Local success does not establish a successful remote run; inspect the Actions result.

## Scope

These are Chromium desktop/mobile-viewport checks. They do not replace real-device, Safari, Firefox or complete accessibility testing. The normal implementation should pass all 22 executions. A controlled incorrect creation message can demonstrate that the create/edit assertion detects a regression; keep such a fault separate from main.

## Controlled regression demonstration

The `qa-demo/create-message-regression` branch intentionally replaces the product-specific creation confirmation with `Product saved.`. Creation still succeeds, but the create/edit assertion rejects the incorrect feedback.

```sh
git switch qa-demo/create-message-regression
npm test -- --grep "create and edit"
```

Expected result: two failures, one desktop and one mobile. Inspect the assertion, screenshot and trace in the HTML report.

```sh
npm run test:report
git switch main
npm test
```

Main contains the corrected message and should pass all 22 executions. Keep the intentional regression out of main.

