# AGENTS.md

## Responsibility

- Verify the deterministic behavior of business logic in `src/lib` and `scripts/lib`.
- Keep tests independent of Next.js runtime APIs and browser globals.

## Rules

- Mirror the source tree: tests for `src/lib/foo/bar.ts` live at `tests/src/lib/foo/bar.test.ts`.
- Mock only external I/O boundaries (`fetch`, `fs` calls) — do not mock internal helpers.
- Each test file covers exactly one source module; cross-module tests belong in integration tests if needed.
- Add a file-level JSDoc header to every test file that names the module under test and lists coverage intent.
- Keep test descriptions specific enough that a failing test name identifies the broken behavior without reading the body.
- Do not import from `src/app` or `src/components`; those layers are excluded from unit test scope by design.
