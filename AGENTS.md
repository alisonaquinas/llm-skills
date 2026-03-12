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

## Project layout

```text
src/
  app/
    layout.tsx          # Root shell: sticky header, nav links
    page.tsx            # Home: registry cards + SkillGrid
    globals.css
    skill/[...slug]/
      page.tsx          # Detail: files, install cmd, SKILL.md viewer
  components/
    SkillCard.tsx       # Single skill card (icon, badge, link)
    SkillGrid.tsx       # Client component: search + filter + grid
    CopyButton.tsx      # Clipboard copy with confirmation
  lib/
    catalog.ts          # Typed catalog access for marketplace + feed sources
    github.ts           # GitHub API helpers for skills and plugin metadata
scripts/
  generate-marketplace-json.mjs
  generate-rss-feed.mjs
.github/workflows/
  deploy.yml            # CI: build -> out/ -> gh-pages branch
```

## Adding a new skill source repo

Update `catalog.json`, not hard-coded arrays in application code.

For marketplace listing:

```json
{
  "pluginName": "my-plugin",
  "owner": "your-github-username",
  "repo": "your-repo-name",
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

The upstream repo must have a `skills/` directory if it is a marketplace plugin, a
Keep a Changelog style `CHANGELOG.md` if it should appear in RSS, and a release workflow
that dispatches `plugin-updated` to `alisonaquinas/llm-skills`.

## Development

```bash
npm install
npm run dev          # http://localhost:3000/llm-skills
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
- Search and filtering are client-side (`useState` in `SkillGrid`).
- Use `cache: "force-cache"` on all `fetch()` calls in build-time data paths.
- Feed and marketplace source configuration belongs in `catalog.json`; avoid hard-coding repo lists.
- The catch-all route `[...slug]` is used for skill detail pages so that `/` separators
  in owner/repo/name are real path segments, not URL-encoded `%2F`.
