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

The combined release feed is published at:

```text
https://alisonaquinas.github.io/llm-skills/rss.xml
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

Generate the combined RSS feed:

```bash
npm run rss:generate -- out/rss.xml
```

To produce both the repo-root marketplace file and the GitHub Pages copy:

```bash
tsx scripts/generate-marketplace-json.ts .claude-plugin/marketplace.json out/marketplace.json
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

Push to `main` or publish a release tag and GitHub Actions will:

1. build the static site,
2. generate `.claude-plugin/marketplace.json`,
3. generate `out/rss.xml`,
4. copy hosted artifacts into `out/`, and
5. publish the site to GitHub Pages.

Set `GITHUB_TOKEN` during local or CI builds to reduce GitHub API rate-limit issues.

## Configuration

Marketplace, plugin, and RSS feed source configuration is centralized in `catalog.json`.

## Release feed

The site publishes a static RSS 2.0 feed that aggregates released changelog entries from
the configured skill-source repositories.

- Output URL: `https://alisonaquinas.github.io/llm-skills/rss.xml`
- Build command: `npm run rss:generate -- out/rss.xml`
- Feed content is sourced from the repositories listed in `catalog.json`

## Adding a new skill source repo

1. Add the plugin entry in `catalog.json` if it should appear in the marketplace listing.
2. Add or enable the matching feed source entry in `catalog.json` if it should appear in the combined RSS feed.
3. Ensure the upstream repo has a Keep a Changelog style `CHANGELOG.md`.
4. Ensure the upstream repo dispatches `plugin-updated` to `alisonaquinas/llm-skills` on release/tag publish.
5. Push a release and confirm the deployed site includes the new source in `rss.xml`.

## License

MIT - © 2026 Alison Aquinas

