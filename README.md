# Alison's LLM Plugins

A static Next.js site and marketplace catalog for installable Claude Code and Codex plugins:

- [`shared-skills`](https://github.com/alisonaquinas/llm-shared-skills)
- [`ci-cd`](https://github.com/alisonaquinas/llm-ci-dev)
- [`software-design`](https://github.com/alisonaquinas/llm-software-design)
- [`doc-skills`](https://github.com/alisonaquinas/llm-doc-skills)
- [`web-design-skills`](https://github.com/alisonaquinas/llm-web-design-skills)

The website lets you browse the skills contained inside those plugins. The Claude Code
marketplace catalog is published at `.claude-plugin/marketplace.json`; the Codex
marketplace catalog is published at `.agents/plugins/marketplace.json`.

**Live site:** <https://llm-skills.alisonaquinas.com/>

## Latest release: v1.4.5

Adds team and cloud-session install documentation so plugins work with Claude Code on the Web (co-work sessions).

- Added "Team install / Claude Code on the Web" section to README with the `extraKnownMarketplaces` + `enabledPlugins` project-settings format required for cloud sessions.
- Corrected two remaining GitHub Pages URLs (marketplace.json and rss.xml) to the custom domain.

## Install in Claude Code

### Personal install (local terminal)

Register the marketplace and install whichever plugins you want:

```text
/plugin marketplace add alisonaquinas/llm-skills
```

```text
/plugin install shared-skills@llm-skills
/plugin install ci-cd@llm-skills
/plugin install software-design@llm-skills
/plugin install doc-skills@llm-skills
/plugin install web-design-skills@llm-skills
```

This writes to your personal `~/.claude/settings.json` and is only active on your local machine.

### Team install / Claude Code on the Web (co-work sessions)

Personal settings are not available in cloud sessions or shared with teammates. To make
plugins available in Claude Code on the Web and for everyone who clones your repository,
commit the marketplace registration and plugin selection to your project's
`.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "llm-skills": {
      "source": {
        "source": "github",
        "repo": "alisonaquinas/llm-skills"
      }
    }
  },
  "enabledPlugins": {
    "shared-skills@llm-skills": true,
    "ci-cd@llm-skills": true,
    "software-design@llm-skills": true,
    "doc-skills@llm-skills": true,
    "web-design-skills@llm-skills": true
  }
}
```

Include only the plugins your project needs. Claude Code installs them automatically
at the start of each cloud session and prompts local teammates to install on first use.

The hosted marketplace JSON is published at:

```text
https://llm-skills.alisonaquinas.com/marketplace.json
```

## Install in Codex

Register the Codex marketplace with the Codex CLI:

```text
codex plugin marketplace add alisonaquinas/llm-skills
```

Restart Codex, open the plugin directory, choose Alison's LLM Skills Marketplace,
and install the bundles your project needs. The published Codex marketplace JSON is:

```text
https://llm-skills.alisonaquinas.com/codex-marketplace.json
```

The combined release feed is published at:

```text
https://llm-skills.alisonaquinas.com/rss.xml
```

## What this repository publishes

| Plugin | Source repository | Purpose |
|--------|-------------------|---------|
| `shared-skills` | [llm-shared-skills](https://github.com/alisonaquinas/llm-shared-skills) | Reusable Claude Code and Codex skills for common developer workflows and shared utilities |
| `ci-cd` | [llm-ci-dev](https://github.com/alisonaquinas/llm-ci-dev) | Claude Code and Codex skills for CI/CD pipelines, release flows, and delivery automation |
| `software-design` | [llm-software-design](https://github.com/alisonaquinas/llm-software-design) | Claude Code and Codex skills for software design, OOP, architecture, and maintainability guidance |
| `doc-skills` | [llm-doc-skills](https://github.com/alisonaquinas/llm-doc-skills) | Claude Code and Codex skills for document authoring, publishing formats, Markdown hosts, and diagram workflows |
| `web-design-skills` | [llm-web-design-skills](https://github.com/alisonaquinas/llm-web-design-skills) | Claude Code and Codex skills for web design, UI/UX, CSS, HTML, and front-end development workflows |

## Development

```bash
npm install
npm run dev
```

## Generate Marketplace JSON

```bash
npm run marketplace:generate -- .claude-plugin/marketplace.json out/marketplace.json
npm run codex-marketplace:generate -- .agents/plugins/marketplace.json out/codex-marketplace.json
```

## Validate Marketplace JSON

```bash
npm run marketplace:validate
npm run codex-marketplace:validate
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
- Claude Code and Codex marketplace JSON generation use `catalog.json` plus upstream plugin metadata.
- Feed content is sourced from the repositories listed in `catalog.json`.
- UI branding should keep the site title aligned with `catalog.json` and local vendored assets in `public/`.

## Adding a new plugin or feed source

1. Add the plugin entry in `catalog.json` if it should appear in the marketplace listing.
2. Add or enable the matching feed source entry in `catalog.json` if it should appear in the combined RSS feed.
3. Ensure the source repository publishes a Keep a Changelog compatible `CHANGELOG.md`.
4. Ensure the source repository dispatches `plugin-updated` to `llm-skills` on release publication.
5. If the source repo publishes skills from the repository root instead of `skills/`, set `"skillsRoot": "."` in `catalog.json`.
