# Claude Plugin Marketplace

A static Next.js site and marketplace catalog for two installable Claude Code plugins:

- [`shared-skills`](https://github.com/alisonaquinas/llm-shared-skills)
- [`ci-cd`](https://github.com/alisonaquinas/llm-ci-dev)

The website lets you browse the skills contained inside those plugins. The marketplace catalog at
`.claude-plugin/marketplace.json` publishes the actual installable plugins.

**Live site:** https://alisonaquinas.github.io/llm-skills/

## Install in Claude Code

Recommended marketplace source:

```text
/plugin marketplace add alisonaquinas/llm-skills
```

Then install one of the published plugins:

```text
/plugin install shared-skills@llm-skills
/plugin install ci-cd@llm-skills
```

The hosted marketplace JSON is also published at:

```text
https://alisonaquinas.github.io/llm-skills/marketplace.json
```

## What this repository publishes

| Plugin | Source repository | Purpose |
|--------|-------------------|---------|
| `shared-skills` | [llm-shared-skills](https://github.com/alisonaquinas/llm-shared-skills) | Reusable Claude Code skills for common developer workflows and shared utilities |
| `ci-cd` | [llm-ci-dev](https://github.com/alisonaquinas/llm-ci-dev) | Claude Code skills for CI/CD pipelines, release flows, and delivery automation |

## Development

```bash
npm install
npm run dev
```

Default dev URL:

```text
http://localhost:3000/llm-skills
```

## Marketplace generation and validation

Generate the canonical marketplace file:

```bash
npm run marketplace:generate
```

Validate it:

```bash
npm run marketplace:validate
```

To produce both the repo-root marketplace file and the GitHub Pages copy:

```bash
node scripts/generate-marketplace-json.mjs .claude-plugin/marketplace.json out/marketplace.json
```

Claude Code validation workflow:

```bash
claude plugin validate .
/plugin marketplace add ./path/to/llm-skills
/plugin install shared-skills@llm-skills
/plugin install ci-cd@llm-skills
```

## Build and deploy

```bash
npm run build
```

Push to `main` and GitHub Actions will:

1. build the static site,
2. generate `.claude-plugin/marketplace.json`,
3. copy a hosted `marketplace.json` into `out/`, and
4. publish the site to GitHub Pages.

Set `GITHUB_TOKEN` during local or CI builds to reduce GitHub API rate-limit issues.

## Configuration

Marketplace and plugin configuration is centralized in `catalog.json`.

## License

MIT — © 2026 Alison Aquinas
