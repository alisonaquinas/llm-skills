# README.md

## Purpose

Unit tests for business logic modules in `src/lib` and `scripts/lib`.
Tests run with [Vitest](https://vitest.dev/) and cover deterministic, framework-free logic only.

## Structure

```text
tests/
  scripts/lib/          # Tests for build-time generation and validation helpers
    marketplace.test.ts # Marketplace JSON construction
    rss.test.ts         # RSS parsing, rendering, and sorting
  src/lib/
    github/             # GitHub-backed data services
      plugin-service.test.ts
      skill-service.test.ts
    marketplace/
      service.test.ts   # Page aggregation helpers
    routes/
      skill-route.test.ts
    skills/
      filter.test.ts    # Client-side skill filtering
    seo.test.ts         # URL and metadata helpers
    theme.test.ts       # Theme preference helpers
```

## Running tests

```bash
npm test
```

## Coverage intent

Tests are organized to mirror the source tree under `src/lib` and `scripts/lib`.
Each test file covers only the module it is co-named with.
Next.js runtime APIs and browser globals are intentionally excluded from test scope;
those interactions are kept thin in the page and component layers to maintain testability.

## Extension guidance

- Place new test files alongside their runtime counterparts in the mirrored subtree.
- Keep test files focused on one source module — avoid cross-module test entanglement.
- Mock only at external I/O boundaries such as `fetch` and `fs` calls; avoid mocking internal helpers.
- Add a file-level JSDoc header to every new test file explaining which module it covers.
