# Implementation

## Architecture

Next.js App Router serves the application routes and a JSON-backed GET API. The root layout remains a Server Component. Small client boundaries handle navigation, preview mode, filters, forms and shared product state.

ProductsProvider loads the 18-product fixture through the API client, validates the response shape, aborts stale requests and exposes retryable loading/error states. A reducer owns product mutations and named action notifications. State persists across in-app product navigation and resets on refresh; there is no database or browser storage.

## Filtering and navigation

ProductList stores one controlled filter object and derives the displayed products. Search is trimmed and case-insensitive; category and status restrictions compose with ascending/descending price sorts. The default sorts by descending product ID. Category metrics describe the whole selected category, independently of search/status results. URL controls are preserved through category navigation and restored on reload. Clear filters retains the category.

## Forms and product actions

Add and edit share a controlled form. Input values stay as strings until validation succeeds, preserving malformed values for correction. Required name/category/status, plain positive USD prices with up to two decimal places, and non-negative safe-integer stock have specific errors. Invalid submission focuses the first error; aria-invalid and aria-describedby associate feedback with the input.

Saving updates the shared inventory and opens details. Cancel discards unsaved changes. IDs increase throughout the session. Archive preserves the record, restore returns it to Draft, and deletion requires a native modal confirmation with Cancel initially focused. Cancel/Escape leave the record untouched. Notifications describe the actual action and product, dismiss after eight seconds and pause during hover/focus.

## Images and preview

JPG, PNG and WebP uploads up to 5 MB are checked for type, size and successful decoding. Saving is blocked while processing or while an upload error remains unresolved. A request counter ignores stale completions. Saved uploads override the local product photo; replacement/removal can be cancelled without changing the saved image.

The 18 fixture products have distinct local photos. Product images use contained sizing with padding. The course panel appears only in customer preview and retains a stable crop during scrolling. Preview shows Active products only, hides management controls, guards editing through history and blocks provider mutations. It is a display preference, not authentication.

## Dependencies and tradeoffs

React context and a reducer keep the small catalog shared without a state-management dependency. Tailwind utilities and CSS provide responsive layouts; Lucide supplies consistent UI icons. The mock API keeps setup reproducible without external credentials. Session-only mutations meet the local-demo scope but would need persistent storage and server-side validation for production. Preview would need real authorization for restricted access.

## AI-use disclosure

I provided the existing Next.js application framework, API code, and supporting code for product types, form handling, filtering, formatting, and styling. These formed the starting point for the project.

I used AI to help extend and revise that foundation, implement additional product-management behavior, troubleshoot issues, and refine the responsive interface. I also used it to explore UI concepts based on my references and preferences, and to help write clearer technical comments around the existing and updated code.

I used AI to generate product imagery, assist with automated tests and verification, and draft setup and implementation documentation. It also assisted with GitHub setup, organizing and pushing commits, and writing technical commit descriptions.

I selected the golf catalog concept, supplied design references, defined the requirements and expected behavior, ran the application locally, manually tested workflows, and identified issues for correction. My QA experience informed the validation feedback, regression coverage, and controlled defect demonstration.

AI-assisted automated verification and my own manual testing are documented separately.
