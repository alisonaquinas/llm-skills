# AGENTS.md

## Responsibility

- Render presentation and small client-side interactions.
- Keep props and output predictable.

## Rules

- Prefer typed props sourced from `src/lib` interfaces.
- Do not embed shared business rules here if they can be reused elsewhere.
- Browser-only behavior should stay minimal and isolated.
