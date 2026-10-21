# Implementation

## Architecture

Next.js App Router serves the application routes and a JSON-backed GET API. The root layout remains a Server Component. Small client boundaries handle navigation, preview mode, filters, forms and shared product state.

ProductsProvider loads the 18-product fixture through the API client, validates the response shape, aborts stale requests and exposes retryable loading/error states. A reducer owns product mutations and named action notifications. State persists across in-app product navigation and resets on refresh; there is no database or browser storage.

## Filtering and navigation

ProductList derives its filters from URL parameters and computes the displayed products. Both catalog search inputs share that query through a synchronous external-store subscription, so typing, clearing and repeated searches stay synchronized without a server navigation per keystroke. Search is trimmed and case-insensitive; category and status restrictions compose with ascending/descending price sorts. The default sorts by descending product ID. Category metrics describe the whole selected category, independently of search/status results. URL controls are preserved through category navigation and restored on reload. Clear filters retains the category.

## Forms and product actions

Add and edit share a controlled form. Input values stay as strings until validation succeeds, preserving malformed values for correction. Required name/category/status, plain positive USD prices with up to two decimal places, and non-negative safe-integer stock have specific errors. Invalid submission focuses the first error; aria-invalid and aria-describedby associate feedback with the input.

Saving updates the shared inventory and opens details. Cancel discards unsaved changes. IDs increase throughout the session. Archive preserves the record, restore returns it to Draft, and deletion requires a native modal confirmation with Cancel initially focused. Cancel/Escape leave the record untouched. Notifications describe the actual action and product, dismiss after eight seconds and pause during hover/focus.

## Images and preview

JPG, PNG and WebP uploads up to 5 MB are checked for type, size and successful decoding. Saving is blocked while processing or while an upload error remains unresolved. A request counter ignores stale completions. Saved uploads override the local product photo; replacement/removal can be cancelled without changing the saved image.

The 18 fixture products have distinct local photos. Product images use contained sizing with padding. The course panel appears only in customer preview and retains a stable crop during scrolling. Preview shows Active products, including zero-stock items labelled Out of stock, hides management controls, guards editing through history and blocks provider mutations. It is a display preference, not authentication.

## Dependencies and tradeoffs

React context and a reducer keep the small catalog shared without a state-management dependency. Tailwind utilities and CSS provide responsive layouts; Lucide supplies consistent UI icons. The mock API keeps setup reproducible without external credentials. Session-only mutations meet the local-demo scope but would need persistent storage and server-side validation for production. Preview would need real authorization for restricted access.

## Automated verification

Eleven Playwright scenarios run in isolated desktop/mobile Chromium contexts, giving 22 executions. Tests cover product fields, combined filters, validation/focus, create/edit, archive/restore/delete, loading/error recovery, image uploads and preview/history guards. Playwright builds and starts production on port 3100, uses retrying assertions and controls request completion for deterministic loading checks. Failure traces/screenshots and an HTML report aid diagnosis. Two workers run without local retries; CI allows one retry.

The GitHub Actions workflow installs dependencies and Chromium on Node.js 24, checks TypeScript and lint, then runs the suite. It runs on main pushes, pull requests targeting main and manual dispatch, with read-only contents permission and seven-day report retention. Generated reports are ignored by Git.

The separate QA demo branch changes only the creation-message text. The targeted assertion should fail on desktop and mobile there; main retains correct behavior. Chromium viewport checks and scoped accessibility scans do not replace real-device, other-browser or complete accessibility testing.

// TODO: Add desktop and mobile screenshots.

// TODO: Record manual review results and actual time spent.

// TODO: Confirm the GitHub Actions result and configure reviewer access.

## Navigation and image viewing

Product links expose actual router-pending state through useLinkStatus, and details/edit/new route segments have loading boundaries. Prefetched or cached navigation remains immediate; no artificial delay is added. Valid price fields normalize to two decimal places on blur, and edit values initialize with two decimals. Invalid entries remain unchanged for correction.

Product image enlargement uses an in-page native modal dialog, including uploaded data URLs, so viewing an image does not trigger a blocked top-level navigation. Close and Escape restore focus to the trigger. The customer course panel is sticky on desktop, with a viewport-bounded height and stable image framing; the mobile panel remains in normal flow.

## AI-use disclosure

I used OpenAI Codex in ChatGPT Work for coding and documentation assistance, and ChatGPT’s built-in image generation for product and course imagery.

I provided the existing Next.js application framework, API code, and supporting code for product types, form handling, filtering, formatting, and styling. These formed the starting point for the project.

I used AI to help extend and revise that foundation, implement additional product-management behavior, troubleshoot issues, and refine the responsive interface. I also used it to explore UI concepts based on my references and preferences, and to help write clearer technical comments around the existing and updated code.

I used AI to generate product imagery, assist with automated tests and verification, and draft setup and implementation documentation. It also assisted with GitHub setup, organizing and pushing commits, and writing technical commit descriptions.

I selected the golf catalog concept, supplied design references, defined the requirements and expected behavior, ran the application locally, manually tested workflows, and identified issues for correction. My QA experience informed the validation feedback, regression coverage, and controlled defect demonstration.

AI-assisted automated verification and my own manual testing are documented separately.

Affected areas included the dashboard, forms, uploads, notifications and preview components in `src/components/`; supporting data/filtering/validation helpers in `src/lib/`; imagery in `public/images/`; regression tests in `tests/e2e/products.spec.ts`; CI in `.github/workflows/playwright.yml`; and setup documentation.

Automated output checks included TypeScript compilation and production build (`npm run build`), ESLint (`npm run lint`), 22 passing desktop/mobile Playwright executions, and scoped responsive/accessibility checks at 1280, 768 and 375 pixels. The controlled creation-message regression caused two targeted assertion failures; restoring the correct message returned the full suite to green.
