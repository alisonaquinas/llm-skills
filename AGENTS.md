# AGENTS.md

This file describes how AI coding agents should work with this repository.

## What this repo is

A static Next.js 15 marketplace that lists and documents LLM skill packages
sourced from upstream GitHub repositories and publishes static ecosystem artifacts,
including a combined release RSS feed.

- [`alisonaquinas/llm-shared-skills`](https://github.com/alisonaquinas/llm-shared-skills) - general-purpose skills (bash, git, docker, aws, ...)
- [`alisonaquinas/llm-ci-dev`](https://github.com/alisonaquinas/llm-ci-dev) - CI/CD skills (GitHub Actions, GitLab CI, Jenkins, Kubernetes, ...)
- [`alisonaquinas/llm-skills`](https://github.com/alisonaquinas/llm-skills) - marketplace app and published static artifacts

Skill and release data is fetched from the GitHub API at build time and exported as
static files. The site is published to GitHub Pages at
`https://alisonaquinas.github.io/llm-skills/`.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Data | GitHub REST API v3 (build-time fetch) |
| Deployment | GitHub Pages via `peaceiris/actions-gh-pages` |
| Tests | Vitest for business-logic unit tests |

## Project layout

```text
src/
  app/                 # Thin page composition and routing
  components/          # Presentation components only
  lib/                 # Business/domain logic and shared contracts
scripts/               # Tooling entrypoints + tooling business logic
tests/                 # Unit tests organized separately from runtime modules
.github/workflows/
  deploy.yml           # CI: build -> out/ -> gh-pages branch
```

## Design principles

- Favor SOLID-aligned structure without forcing class-heavy code where functions and typed modules are clearer.
- Enforce DRY by centralizing shared fetch logic, route parsing, command building, filtering, and generation helpers.
- Prefer cohesive module boundaries over broad utility dumping; new logic should usually live in the narrowest sensible module.
- Build UI changes mobile-first so the base layout works cleanly at phone widths before layering larger breakpoint refinements.
- Minimize coupling by keeping `src/app` and `src/components` dependent on typed contracts and services from `src/lib`.
- Keep business logic deterministic and testable outside Next.js runtime and browser-only APIs.
- Keep module-local `README.md` and `AGENTS.md` files current when public structure or dependency direction changes.

## Documentation expectations

- Every TypeScript source file and test file should begin with a detailed file header that explains the module's purpose, responsibilities, and boundary rules.
- Add doc comments to exported and non-trivial internal functions, scripts, interfaces, type members, props, constants, and stateful values when they carry business intent.
- Prefer comments that explain role, contract, and collaboration boundaries instead of narrating obvious syntax.
- Update documentation comments whenever behavior, public contracts, or module responsibilities change.
- Treat documentation depth as part of the repo's maintainability standard, not as optional polish.

## SEO expectations

- catalog.json owns canonical site identity, marketplace title, base URLs, and publisher metadata for SEO helpers.
- Brand assets and favicon files should be vendored locally in public/ and kept aligned with the title and accent palette used by the site chrome.
- Every public route must define canonical metadata and should reuse shared SEO helpers rather than hard-coding URLs.
- New public pages must be evaluated for sitemap coverage, robots behavior, Open Graph/Twitter metadata, and structured data.
- Structured data should be server-rendered, deterministic at build time, and derived from existing catalog or fetched skill data.
- Public SEO assets such as preview images, `robots.txt`, `sitemap.xml`, and feed discovery links must stay aligned with the GitHub Pages base path.

## Preview and validation expectations

- When presenting UI or site changes, prefer starting a fresh local preview from a clean state rather than relying on an older long-running dev server.
- If a preview starts behaving inconsistently, clear stale Next.js build artifacts such as `.next/` and republish the preview before concluding the app is broken.
- Before presenting preview work to the user, validate the served site with read-only HTTP probes such as `curl --head --fail --location` and `wget --spider` against the actual preview URLs.
- For responsive UI changes, include manual review at representative phone, tablet, and desktop widths before calling the work ready.
- Use those probes to confirm the primary page responds successfully and that critical linked assets, especially branding files and generated artifacts, resolve from the correct base path.
- Treat browser inspection as helpful but not sufficient on its own; pair visual review with command-line verification so stale caches, broken asset paths, and publish mismatches are caught early.
## Adding a new skill source repo

Update `catalog.json`, not hard-coded arrays in application code.

For marketplace listing:

```json
{
  "pluginName": "my-plugin",
  "owner": "your-github-username",
  "repo": "your-repo-name",
  "skillsRoot": "skills",
  "label": "My Skills",
  "category": "my-skills",
  "color": "bg-violet-100 text-violet-800",
  "ref": "main",
  "siteDescription": "Description for the marketplace UI."
}
```

For RSS feed inclusion:

```json
{
  "owner": "your-github-username",
  "repo": "your-repo-name",
  "label": "My Skills",
  "ref": "main",
  "enabled": true
}
```

The upstream repo must expose skill directories either under `skills/` or at the repository
root via `"skillsRoot": "."`, ship a Keep a Changelog style `CHANGELOG.md` if it should appear
in RSS, and publish per-skill ZIP assets named `{skillName}-skill.zip` from releases so direct
download links resolve correctly. Release workflows should still dispatch `plugin-updated` to
`alisonaquinas/llm-skills`.

## Development

```bash
npm install
npm run dev          # http://localhost:3000/llm-skills
npm run test         # Vitest business-logic tests
```

## Building for production

```bash
npm run build        # Outputs static files to out/
npm run rss:generate -- out/rss.xml
```

The `out/` directory is what gets deployed to GitHub Pages.
Set a `GITHUB_TOKEN` environment variable to avoid GitHub API rate limits
during the build.

## Conventions

- All data fetching is server-side and happens at build time; no client-side API calls.
- Search and filtering are client-side in the UI, but their business logic belongs in `src/lib/skills`.
- Use `cache: "force-cache"` on all `fetch()` calls in build-time data paths.
- Feed and marketplace source configuration belongs in `catalog.json`; avoid hard-coding repo lists.
- The catch-all route `[...slug]` is used for skill detail pages so that `/` separators in owner/repo/name are real path segments.
- Keep page files thin and prefer moving non-trivial logic into `src/lib` before adding more JSX complexity.



