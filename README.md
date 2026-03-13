# Claude Plugin Marketplace

A static Next.js site and marketplace catalog for two installable Claude Code plugins:

- [`shared-skills`](https://github.com/alisonaquinas/llm-shared-skills)
- [`ci-cd`](https://github.com/alisonaquinas/llm-ci-dev)

The website lets you browse the skills contained inside those plugins. The marketplace catalog at
`.claude-plugin/marketplace.json` publishes the actual installable plugins.

**Live site:** https://alisonaquinas.github.io/llm-skills/

## Latest release: v1.0.5

The current marketplace release fixes a documentation lint failure so the release workflow notes stay CI-friendly.

- The release workflow guide now marks the repository dispatch example as `text`, resolving the markdownlint MD040 failure.
- `catalog.json` version metadata is aligned to `1.0.5` so the site footer, generated artifacts, and git tag stay synchronized.
- The shared footer introduced in `v1.0.4` continues to expose the current published version and Alison Aquinas profile links.

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

## Generate Marketplace JSON

```bash
npm run marketplace:generate -- .claude-plugin/marketplace.json out/marketplace.json
```

## Validate Marketplace JSON

```bash
npm run marketplace:validate
```

## Generate Combined RSS Feed

```bash
npm run rss:generate -- out/rss.xml
```

## Test and build

```bash
npm test
npm run build
```

## Marketplace source of truth

Marketplace, plugin, and RSS feed source configuration is centralized in `catalog.json`.

- The website reads the marketplace title, description, version, and owner information from `catalog.json`.
- Marketplace JSON generation uses `catalog.json` plus upstream plugin metadata.
- Feed content is sourced from the repositories listed in `catalog.json`.

## Adding a new plugin or feed source

1. Add the plugin entry in `catalog.json` if it should appear in the marketplace listing.
2. Add or enable the matching feed source entry in `catalog.json` if it should appear in the combined RSS feed.
3. Ensure the source repository publishes a Keep a Changelog compatible `CHANGELOG.md`.
4. Ensure the source repository dispatches `plugin-updated` to `llm-skills` on release publication.
