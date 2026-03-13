# AGENTS.md

## Responsibility

- Own reusable business logic and typed module contracts.
- Serve as the main coherence boundary for the app.

## Rules

- Prefer single-purpose modules with explicit exports.
- Keep fetch logic, parsing logic, mapping logic, and formatting logic separated.
- Favor deterministic pure functions for logic that should be unit tested.
- Treat this module as the default home for logic before adding complexity to UI or scripts.
