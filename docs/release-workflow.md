# Release & Deployment Workflow

This document describes how the marketplace builds, deploys, and stays in sync
with upstream skill packages.

---

## Automatic deploys

The [`deploy.yml`](../.github/workflows/deploy.yml) workflow triggers on:

| Trigger | When it fires |
|---------|---------------|
| `push` to `main` | Any direct commit or merged PR to `main` |
| `workflow_dispatch` | Manual run from the GitHub Actions UI |
| `repository_dispatch` (type: `plugin-updated`) | Upstream skill repo published a new release |

On each trigger the workflow:

1. Installs Node.js 20 and runs `npm ci`
2. Runs `npm run build` — fetches live skill data from the GitHub API and
   generates a fully static export in `out/`
3. Deploys `out/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`
4. GitHub Pages serves the site at `https://alisonaquinas.github.io/llm-skills/`

Typical end-to-end time from trigger to live site: **~2 minutes**.

---

## How upstream repos trigger a rebuild

Each skill repo (e.g. `llm-shared-skills`, `llm-ci-dev`) has a
`release.yml` workflow that fires when a `vX.Y.Z` tag is pushed. The final
step of that workflow calls:

```text
POST /repos/alisonaquinas/llm-skills/dispatches
  event_type: plugin-updated
  client_payload: { repo, version }
```

This arrives as a `repository_dispatch` event here and kicks off a fresh build.
The `GITHUB_TOKEN` used during build has read access to the GitHub API, so the
rebuilt site will show the updated version from each repo's `plugin.json`.

---

## Manual rebuild

To force a rebuild without pushing to `main`:

1. Go to **Actions → Deploy to GitHub Pages**
2. Click **Run workflow** → **Run workflow**

Or via the CLI:

```bash
gh workflow run deploy.yml
```

---

## Adding a new skill repo to the marketplace

### 1. Add the repo to `src/lib/github.ts`

```ts
// src/lib/github.ts
export const REPOS: RepoConfig[] = [
  // existing repos...
  {
    owner: "alisonaquinas",
    repo:  "my-new-skills",
    label: "My New Skills",
    color: "bg-violet-100 text-violet-800",
  },
];
```

The new repo must have:

- A `skills/` directory with one subdirectory per skill
- A `.claude-plugin/plugin.json` with `name`, `version`, `description`, `author`
- A `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format

### 2. Set up the `release.yml` workflow in the new repo

Copy `.github/workflows/release.yml` from any existing skill repo verbatim —
no edits required.

### 3. Add the `MARKETPLACE_DISPATCH_TOKEN` secret to the new repo

In the new repo: **Settings → Secrets and variables → Actions → New repository secret**

- Name: `MARKETPLACE_DISPATCH_TOKEN`
- Value: the same fine-grained PAT used by the other skill repos
  (Contents: write on `alisonaquinas/llm-skills`)

### 4. Commit and push

```bash
git add src/lib/github.ts
git commit -m "feat: add my-new-skills to marketplace"
git push
```

The marketplace will rebuild automatically and show the new repo.

---

## Required secrets

| Secret | Used by | Purpose |
|--------|---------|---------|
| `GITHUB_TOKEN` | `deploy.yml` (auto-provided) | Read GitHub API during build; write to `gh-pages` branch |
| `MARKETPLACE_DISPATCH_TOKEN` | Upstream repos' `release.yml` | Write `repository_dispatch` events to this repo |
