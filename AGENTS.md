# AGENTS.md

This file describes how AI coding agents should work with this repository.

## What this repo is

A static Next.js 15 marketplace that lists and documents LLM skill packages
sourced from two upstream GitHub repositories:

- [`alisonaquinas/llm-shared-skills`](https://github.com/alisonaquinas/llm-shared-skills) — general-purpose skills (bash, git, docker, aws, …)
- [`alisonaquinas/llm-ci-dev`](https://github.com/alisonaquinas/llm-ci-dev) — CI/CD skills (GitHub Actions, GitLab CI, Jenkins, Kubernetes, …)

Skill data is fetched from the GitHub API at **build time** and exported as
static HTML. The site is published to GitHub Pages at
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

```
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
    github.ts           # GitHub API helpers + REPOS config
.github/workflows/
  deploy.yml            # CI: build → out/ → gh-pages branch
```

## Adding a new skill source repo

Edit `src/lib/github.ts` and add an entry to the `REPOS` array:

```ts
{
  owner: "your-github-username",
  repo: "your-repo-name",
  label: "My Skills",
  color: "bg-violet-100 text-violet-800",
}
```

The repo must have skills in a `skills/` directory and a
`.claude-plugin/plugin.json` metadata file.

## Development

```bash
npm install
npm run dev          # http://localhost:3000/llm-skills
```

## Building for production

```bash
npm run build        # Outputs static files to out/
```

The `out/` directory is what gets deployed to GitHub Pages.
Set a `GITHUB_TOKEN` environment variable to avoid GitHub API rate limits
during the build.

## Conventions

- All data fetching is server-side and happens at build time — no client-side API calls.
- Search and filtering are client-side (`useState` in `SkillGrid`).
- Use `cache: "force-cache"` on all `fetch()` calls (ISR is not compatible with static export).
- The catch-all route `[...slug]` is used for skill detail pages so that `/` separators
  in owner/repo/name are real path segments, not URL-encoded `%2F`.
