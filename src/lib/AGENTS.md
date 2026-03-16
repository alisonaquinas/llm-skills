# AGENTS.md

## Responsibility

- Own reusable business logic and typed module contracts.
- Serve as the main coherence boundary for the app.

## Rules

- Prefer single-purpose modules with explicit exports.
- Keep fetch logic, parsing logic, mapping logic, and formatting logic separated.
- Favor deterministic pure functions for logic that should be unit tested.
- Treat this module as the default home for logic before adding complexity to UI or scripts.
- Every source file must have a file-level JSDoc header stating its responsibilities and dependency rules.
- All exported functions, interfaces, and type members must have JSDoc; use `@param` and `@returns` on functions.
- Keep each namespace barrel (`index.ts`) up to date when public exports change.
