# Implementation

## Architecture

Next.js App Router serves `/products` and GET `/api/products`; the root route redirects to the catalog. Product contracts define the five categories, three statuses and required inventory fields. A local 18-product JSON fixture keeps the API reproducible without external services or credentials.

The API client checks HTTP status, JSON shape, individual records and unique IDs before returning typed products. The route handler includes bounded delay and error simulation for recovery checks. TypeScript aliases resolve `@/` to `src/`, and Turbopack uses the application folder as its root.

## Catalog state and filtering

The persistent products layout wraps a client provider in Suspense. The provider loads and validates product data, aborts stale requests and supports Retry. A reducer owns the shared catalog; ProductList keeps one controlled filters object and derives visible results with useMemo.

Search is trimmed and case-insensitive. Category and status restrictions compose with price sorting. Default order uses descending product ID. Category metrics are independent of search/status results; a separate live result count announces the displayed inventory. Clear filters resets the controls.

The table exposes all inventory fields on desktop/tablet, and mobile cards expose the same information. Controls have explicit labels. Loading, failed requests, malformed responses and empty results have useful states. Search/filter interactions do not introduce artificial loading delays.

## Details and forms

Dynamic detail and edit routes await route params and read the shared provider. Both handle unknown IDs with a recovery link. Add/edit forms use controlled string values so blanks and malformed numbers remain available for correction. Validation runs on submission and blur, then updates as touched fields are corrected. Errors connect through aria-invalid and aria-describedby; failed submission focuses the first invalid field in visual order.

Names are trimmed before saving. Category/status values must match the allowed options. Price accepts plain positive USD amounts with at most two decimal places; stock accepts non-negative safe integers. Conversion to numeric values happens only after validation.

Saving dispatches ADD or UPDATE and opens the record details. New IDs increase from the largest fixture ID. The catalog derives updated results and counts from shared state. Cancel returns to the original details or list without mutating data. In-app navigation preserves state; refresh restores the fixture.

Create/update notifications come from actual reducer actions rather than URL flags. Each action increments a notice ID to restart the eight-second dismissal timer, including repeated messages. Hover/focus pauses dismissal; manual dismissal is available. Timer cleanup prevents stale callbacks.

## Images and management actions

ProductImageUpload checks MIME type, a 5 MB size limit and successful browser decoding. A request counter ignores stale upload completions. Image data stays in the controlled form until Save, then Product.image takes precedence over category artwork. Save is blocked during processing and unresolved upload errors. Cancel discards unsaved image changes; removal restores fallback artwork.

Archive and restore update status without replacing other fields or photos. Restore returns to Draft. The reducer derives product-specific action messages from actual mutations. A native modal dialog contains focus and makes the background inert; Cancel is initially focused. Cancel/Escape leave data unchanged. Only confirmation dispatches DELETE and replaces the route with the catalog. nextId remains increasing after deletion.

The hidden file input retains one-pixel sizing so global input styling cannot introduce page overflow. The labelled upload button provides its visible interaction target.

## AI-use disclosure

I provided the existing Next.js application framework, API code, and supporting code for product types, form handling, filtering, formatting, and styling. These formed the starting point for the project.

I used AI to help extend and revise that foundation, implement additional product-management behavior, troubleshoot issues, and refine the responsive interface. I also used it to explore UI concepts based on my references and preferences, and to help write clearer technical comments around the existing and updated code.

I used AI to generate product imagery, assist with automated tests and verification, and draft setup and implementation documentation. It also assisted with GitHub setup, organizing and pushing commits, and writing technical commit descriptions.

I selected the golf catalog concept, supplied design references, defined the requirements and expected behavior, ran the application locally, manually tested workflows, and identified issues for correction. My QA experience informed the validation feedback, regression coverage, and controlled defect demonstration.

AI-assisted automated verification and my own manual testing are documented separately.
