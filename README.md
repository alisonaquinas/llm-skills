# Alison's LLM Plugins

A static Next.js site and marketplace catalog for installable Claude Code plugins:

- [`shared-skills`](https://github.com/alisonaquinas/llm-shared-skills)
- [`ci-cd`](https://github.com/alisonaquinas/llm-ci-dev)
- [`software-design`](https://github.com/alisonaquinas/llm-software-design)
- [`doc-skills`](https://github.com/alisonaquinas/llm-doc-skills)
- [`web-design-skills`](https://github.com/alisonaquinas/llm-web-design-skills)

The website lets you browse the skills contained inside those plugins. The marketplace catalog at
`.claude-plugin/marketplace.json` publishes the actual installable plugins.

**Live site:** <https://llm-skills.alisonaquinas.com/>

## Latest release: v1.4.4

Fixes stale marketplace registration that caused Claude Code instances to install plugins from `main` instead of the declared pinned versions.

- `.claude-plugin/marketplace.json` regenerated from `catalog.json`; was frozen at v1.4.2 with all plugin refs pointing to `main`.
- `postbuild` now generates `out/marketplace.json` automatically alongside the RSS feed so local builds stay complete.
- Corrected live-site and dev-server URLs in `README.md` and `AGENTS.md` to reflect the custom-domain migration.

## Install in Claude Code

Recommended marketplace source:

```text
/plugin marketplace add alisonaquinas/llm-skills
```

Then install one of the published plugins:

```text
/plugin install shared-skills@llm-skills
/plugin install ci-cd@llm-skills
/plugin install software-design@llm-skills
/plugin install web-design-skills@llm-skills
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
| `software-design` | [llm-software-design](https://github.com/alisonaquinas/llm-software-design) | Claude Code skills for software design, OOP, architecture, and maintainability guidance |
| `doc-skills` | [llm-doc-skills](https://github.com/alisonaquinas/llm-doc-skills) | Claude Code skills for document authoring, publishing formats, Markdown hosts, and diagram workflows |
| `web-design-skills` | [llm-web-design-skills](https://github.com/alisonaquinas/llm-web-design-skills) | Claude Code skills for web design, UI/UX, CSS, HTML, and front-end development workflows |

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

## Preview validation

When UI work is being reviewed locally, prefer a fresh preview over a long-running stale dev server.

Validate the published preview URL and key assets before handing it off:

```bash
curl --head --fail --location http://localhost:3000/
wget --spider http://localhost:3000/alison-bug.svg
```

## Marketplace source of truth

Marketplace, plugin, RSS feed, and branding configuration is centralized in `catalog.json`.

- The website reads the marketplace title, description, version, and owner information from `catalog.json`.
- Marketplace JSON generation uses `catalog.json` plus upstream plugin metadata.
- Feed content is sourced from the repositories listed in `catalog.json`.
- UI branding should keep the site title aligned with `catalog.json` and local vendored assets in `public/`.

## Adding a new plugin or feed source

1. Add the plugin entry in `catalog.json` if it should appear in the marketplace listing.
2. Add or enable the matching feed source entry in `catalog.json` if it should appear in the combined RSS feed.
3. Ensure the source repository publishes a Keep a Changelog compatible `CHANGELOG.md`.
4. Ensure the source repository dispatches `plugin-updated` to `llm-skills` on release publication.
5. If the source repo publishes skills from the repository root instead of `skills/`, set `"skillsRoot": "."` in `catalog.json`.
