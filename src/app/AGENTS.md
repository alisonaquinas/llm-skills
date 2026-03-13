# AGENTS.md

## Responsibility

- Define route-level composition and metadata.
- Keep route files focused on orchestration, not domain logic.

## Rules

- Prefer helpers from `src/lib` over inline business decisions.
- Add new pages only when they map to user-facing navigation or static generation boundaries.
- If a page starts owning parsing, mapping, or filtering logic, extract it into `src/lib`.
