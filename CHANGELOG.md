# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Module-local `README.md` and `AGENTS.md` files for `src/app`, `src/components`, `src/lib`, and `scripts`
- PlantUML module diagrams describing page composers, services, parsers, and tooling collaborators
- Vitest unit tests for marketplace aggregation, skill filtering, route parsing, marketplace document generation, and RSS generation helpers
- A dedicated top-level `tests/` tree that keeps unit tests separate from runtime modules while mirroring the source structure
- Static SEO artifacts for GitHub Pages export, including `robots.txt`, `sitemap.xml`, JSON-LD structured data, and a social preview image

### Changed
- GitHub Pages deploy workflow now regenerates `rss.xml` on `main`, release tags, and upstream `repository_dispatch` events
- Migrated first-party build and validation scripts from `.mjs` to TypeScript and run them via `tsx`
- Tightened `tsconfig.json` by disabling `allowJs` now that the repository tooling is TypeScript-based
- Refactored business logic into cohesive `src/lib` namespaces for catalog, commands, GitHub access, marketplace services, routes, and skills
- Thinned page and component files so they compose services instead of owning filtering, command building, and route parsing logic
- Added detailed file headers and API-level doc comments across source files, scripts, and tests, and documented that standard in the repo `AGENTS.md`
- Expanded route metadata with canonical URLs, Open Graph/Twitter cards, crawl directives, and shared SEO helpers backed by `catalog.json`
