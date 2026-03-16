# AGENTS.md

## Responsibility

- Define route-level composition and metadata.
- Keep route files focused on orchestration, not domain logic.

## Rules

- Prefer helpers from `src/lib` over inline business decisions.
- Add new pages only when they map to user-facing navigation or static generation boundaries.
- If a page starts owning parsing, mapping, or filtering logic, extract it into `src/lib`.
- Every route file must have a file-level JSDoc header stating its responsibilities and dependency rules.
- SEO metadata (`metadata` exports and `generateMetadata`) must use shared helpers from `src/lib/seo`; do not hard-code URLs or titles inline.
- New public routes must be evaluated for sitemap coverage (`src/app/sitemap.ts`) and structured data.
