# AGENTS.md

## Responsibility

- Render presentation and small client-side interactions.
- Keep props and output predictable.

## Rules

- Prefer typed props sourced from `src/lib` interfaces.
- Do not embed shared business rules here if they can be reused elsewhere.
- Browser-only behavior should stay minimal and isolated; mark client components with `"use client"`.
- Every component file must have a file-level JSDoc header stating its responsibilities and dependency rules.
- Export prop interfaces with JSDoc on each member; do not inline anonymous prop objects.
- Client components that manage external side effects (clipboard, localStorage, DOM events) must document those effects in their file header.
