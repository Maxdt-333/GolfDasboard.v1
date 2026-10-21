# Implementation

## Architecture

Next.js App Router serves `/products` and GET `/api/products`; the root route redirects to the catalog. Product contracts define the five categories, three statuses and required inventory fields. A local 18-product JSON fixture keeps the API reproducible without external services or credentials.

The API client checks HTTP status, JSON shape, individual records and unique IDs before returning typed products. The route handler includes bounded delay and error simulation for recovery checks. TypeScript aliases resolve `@/` to `src/`, and Turbopack uses the application folder as its root.

## Catalog state and filtering

The persistent products layout wraps a client provider in Suspense. The provider loads and validates product data, aborts stale requests and supports Retry. A reducer owns the shared catalog; ProductList keeps one controlled filters object and derives visible results with useMemo.

Search is trimmed and case-insensitive. Category and status restrictions compose with price sorting. Default order uses descending product ID. Category metrics are independent of search/status results; a separate live result count announces the displayed inventory. Clear filters resets the controls.

The table exposes all inventory fields on desktop/tablet, and mobile cards expose the same information. Controls have explicit labels. Loading, failed requests, malformed responses and empty results have useful states. Search/filter interactions do not introduce artificial loading delays.

## AI-use disclosure

I provided the existing Next.js application framework, API code, and supporting code for product types, form handling, filtering, formatting, and styling. These formed the starting point for the project.

I used AI to help extend and revise that foundation, implement additional product-management behavior, troubleshoot issues, and refine the responsive interface. I also used it to explore UI concepts based on my references and preferences, and to help write clearer technical comments around the existing and updated code.

I used AI to generate product imagery, assist with automated tests and verification, and draft setup and implementation documentation. It also assisted with GitHub setup, organizing and pushing commits, and writing technical commit descriptions.

I selected the golf catalog concept, supplied design references, defined the requirements and expected behavior, ran the application locally, manually tested workflows, and identified issues for correction. My QA experience informed the validation feedback, regression coverage, and controlled defect demonstration.

AI-assisted automated verification and my own manual testing are documented separately.
