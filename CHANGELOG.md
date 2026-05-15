# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [1.4.9] - 2026-05-15

### Fixed

- Bumped `ci-cd`, `software-design`, `doc-skills`, and `web-design-skills` catalog pins to `v1.2.4`, `v1.4.4`, `v1.3.2`, and `v1.1.6` respectively. The prior tags (`v1.2.3`, `v1.4.3`, `v1.3.1`, `v1.1.5`) were cut **before** the `.codex-plugin/plugin.json` manifest landed on each bundle's `main`, so Codex marketplace installs failed for all four — the Codex CLI / app cloned the tagged commit, found no plugin manifest, and aborted the install. Only `shared-skills` worked because its v1.8.0 tag was cut after that manifest was added. Each plugin has been re-released as a patch (`vX.Y.Z+1`) including `.codex-plugin/plugin.json`, and the marketplace catalog now points at those tags.
- Restored Codex marketplace plugin names in `.agents/plugins/marketplace.json` to the names declared by each bundle's Codex plugin manifest (`shared-skills`, `ci-cd`, `software-design`, `doc-skills`, `web-design-skills`) so repo-backed Codex marketplace installs do not look up Claude-only plugin names.
- Added Codex marketplace validation that fails when the committed `.agents/plugins/marketplace.json` drifts from `catalog.json` generation.
- Moved the `llm-doc-skills` `v1.3.1` pin and marketplace `1.4.8` version into `catalog.json` so future generated artifacts keep the released metadata.

### Changed

- Regenerated `.claude-plugin/marketplace.json` from `catalog.json` so the committed file matches the deployed marketplace (the deployed `marketplace.json` already serves the short names; the committed copy had drifted).

## [1.4.8] - 2026-05-15

### Changed

- Promoted `llm-doc-skills` catalog pin from `v1.3.0` to `v1.3.1` in both `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json`.

## [1.4.7] - 2026-05-15

### Fixed

- Aligned all five catalog plugin names in `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json` with the `name` field declared in each plugin's `plugin.json` (`shared-skills` → `llm-shared-skills`, `ci-cd` → `llm-ci-dev`, `software-design` → `llm-software-design`, `doc-skills` → `llm-doc-skills`, `web-design-skills` → `llm-web-design-skills`). The plugin manager resolves updates by looking up the installed plugin's `plugin.json` name in the catalog; the mismatch caused "Plugin not found" errors on every update attempt for all five plugins.

## [1.4.6] - 2026-05-08

### Fixed

- Regenerated Claude and Codex marketplace manifests so `shared-skills` installs point at `alisonaquinas/llm-shared-skills` tag `v1.8.0` instead of stale `v1.7.7` metadata.

### Added

- Added Codex marketplace generation at `.agents/plugins/marketplace.json` and `out/codex-marketplace.json`, with validation and tests for Git-backed Codex plugin entries.
- Updated marketplace metadata loading to prefer upstream `.codex-plugin/plugin.json` while falling back to `.claude-plugin/plugin.json` during rollout.
- Updated install documentation and the landing-page install banner with `codex plugin marketplace add alisonaquinas/llm-skills`.

## [1.4.5] - 2026-04-16

### Fixed

- Added "Team install / Claude Code on the Web" section to `README.md` documenting the project-scoped `extraKnownMarketplaces` + `enabledPlugins` configuration required for cloud sessions and co-work compatibility. The previous install instructions only covered the personal `~/.claude/settings.json` path, which is not available in Claude Code on the Web cloud VMs; plugins must be declared in the repo's `.claude/settings.json` to survive cloud session startup.
- Corrected two remaining stale `https://alisonaquinas.github.io/llm-skills/` URLs (marketplace.json and rss.xml) to the canonical custom-domain `https://llm-skills.alisonaquinas.com/` equivalents.

## [1.4.4] - 2026-04-16

### Fixed

- Regenerated `.claude-plugin/marketplace.json` from `catalog.json`; the committed file was stale at v1.4.2 with all plugin `ref` fields pointing to `main`, losing the version-pinned refs (`v1.7.7`, `v1.2.3`, etc.) added in v1.4.3. Claude Code instances were picking up unpinned installs instead of the declared tested versions.
- Added `marketplace:generate` to the `postbuild` script so local `npm run build` now produces both `out/marketplace.json` and `out/rss.xml` without a separate manual step.
- Corrected live-site URL in `README.md` from the legacy `https://alisonaquinas.github.io/llm-skills/` to `https://llm-skills.alisonaquinas.com/` and updated preview `curl`/`wget` probe commands to match.
- Corrected dev-server URL in `AGENTS.md` from `http://localhost:3000/llm-skills` to `http://localhost:3000/` to match the empty `basePath` in `next.config.ts`.

## [1.4.3] - 2026-03-31

### Fixed

- Fixed auto-update detection for all installed plugins. Plugin entries in `catalog.json` and the generated `marketplace.json` now include explicit `version` and pinned `ref` fields (e.g. `"ref": "v1.7.7"`, `"version": "1.7.7"`) instead of `"ref": "main"` with no version. Claude Code compares the installed version against the marketplace-listed version to detect updates; without a version field, no update was ever detected.
- Added `version` field to `MarketplacePluginDocument` interface and `buildMarketplacePluginDocument` generation so the published `marketplace.json` carries per-plugin version metadata.
- Added `version` field to the `PluginConfig` catalog type so version data flows cleanly from `catalog.json` through the generator into the published document.
- Updated `deploy.yml` to automatically update `catalog.json` with the new version tag when triggered by a `plugin-updated` repository dispatch. Previously, dispatches from upstream repos only triggered a rebuild without updating the pinned ref or version, so the marketplace.json never reflected new releases.
- Updated `settings.json` marketplace registration from `source: "git"` (URL) to `source: "github"` (repo) to match all other working marketplaces and enable GitHub API-based update checks.

## [1.4.2] - 2026-03-16

### Changed

- Landing page: moved plugin GitHub repository links from the crowded top-of-page link row into individual plugin cards (displayed beneath the install command banner), reducing header clutter and keeping repo context close to each plugin.
- Landing page: removed horizontal scroll overflow from the install command text box on plugin cards so the command displays on a single fixed-width line.
- Landing page: added a copy-to-clipboard button beside each plugin card install command, matching the copy-button pattern already used on Skill detail cards.

## [1.4.1] - 2026-03-16

### Fixed

- `release.yml`: `all-plugins.zip` now contains individual `*-skill.zip` files flat at the archive root rather than nesting the plugin bundle ZIPs inside it; each plugin bundle is downloaded then extracted, and the resulting skill ZIPs are collected with `zip -j` (junk paths) into a single flat archive

## [1.4.0] - 2026-03-16

### Added

- `MarkdownRenderer` component (`src/components/MarkdownRenderer.tsx`): server component using `react-markdown` + `remark-gfm` with `@tailwindcss/typography` prose styling; replaces raw `<pre>` blocks on skill detail pages so all skill documentation is rendered as HTML
- `buildPluginBundleUrl()` in `src/lib/github/skill-service.ts`: builds the `{pluginName}-plugin.zip` download URL from a plugin config and version
- `buildAllPluginsBundleUrl()` in `src/lib/catalog/service.ts`: builds the `all-plugins.zip` download URL from `catalog.json` marketplace version and GitHub repo
- `MarketplacePluginSummary.bundleUrl` field: per-plugin all-in-one bundle download URL, or `null` when the plugin version is unavailable
- Landing page: per-plugin "Bundle" download link on each plugin card and a "Download all plugins" banner at the top of the marketplace that links to `all-plugins.zip`
- `release.yml`: two new steps — "Download plugin bundle ZIPs" (fetches each `{pluginName}-plugin.zip` from the latest plugin release) and "Build all-plugins bundle" (assembles `all-plugins.zip` from the downloaded bundles); `all-plugins.zip` is uploaded as a GitHub Release asset
- Unit tests for `buildPluginBundleUrl` and `bundleUrl` population in `buildMarketplacePluginSummaries`

### Changed

- Skill detail page (`src/app/skill/[...slug]/page.tsx`): replaced `<pre>` raw markdown display with `<MarkdownRenderer>` for rendered HTML output
- `src/lib/github/index.ts` and `src/lib/catalog/index.ts`: barrel exports updated for new URL builder functions
- `package.json`: added `react-markdown`, `remark-gfm` as runtime dependencies; `@tailwindcss/typography` as dev dependency
- `tailwind.config.ts`: registered `@tailwindcss/typography` plugin

### Fixed

- `catalog.json` and `package.json` version corrected to `1.4.0`; the v1.3.9 tag was pushed without bumping these files, causing the release workflow to fail the version-gate check

## [1.3.9] - 2026-03-16

### Added

- registered `llm-web-design-skills` as a new plugin in the marketplace catalog, regenerated `marketplace.json`, and updated the README plugin list

### Changed

- documented trunk-based development workflow in `AGENTS.md`
- updated `package-lock.json` to v1.3.8

## [1.3.6] - 2026-03-14

### Fixed

- Skill cards now respond to clicks anywhere on the card body (icon, name, badge, command area, padding) instead of only the border region. The absolute overlay link was previously rendered below the content div in stacking order and absorbed no clicks; adding `z-[1]` raises it above the content layer while keeping copy and download buttons accessible above it at `z-10`.

## [1.3.5] - 2026-03-14

### Added

- Added a `raw-document` icon entry (🗜️) to the skill icon map, used by skills that work directly with OOXML and ODF ZIP packages at the schema level.

## [1.3.4] - 2026-03-14

### Added

- Added an icon-only variant to `CopyButton` so copy affordances can be embedded inline without taking up extra vertical space.
- Added a `CopyIcon` SVG component to `SiteIcons` for use by the icon-only copy button variant.
- Added inline copy buttons to all install command surfaces in the `InstallBanner` (marketplace add, per-plugin install, and marketplace URL commands).
- Added an inline copy button to each skill card's invocation command.

### Changed

- Install banner command rows now truncate long commands inside their container and show the full command as a tooltip, replacing the previous horizontally-scrollable overflow layout.
- Skill card invocation commands now truncate with an ellipsis and surface the full command as a tooltip instead of scrolling horizontally.

## [1.3.3] - 2026-03-14

### Fixed

- Expanded the marketplace skill icon matcher so doc-skills entries pick up the intended icons more reliably, including Markdown-related skills that previously fell through to a false match.

## [1.3.2] - 2026-03-14

### Added

- Added direct GitHub release asset download links for individual skill ZIP bundles on marketplace cards and skill detail pages.

### Changed

- Extended marketplace skill discovery so plugins can publish skills from either `skills/` or the repository root, allowing `llm-doc-skills` to resolve cleanly alongside the other plugin repos.
- Marketplace download links and plugin version badges now prefer the latest published GitHub release tag so direct asset links stay aligned with real release assets.
- Marketplace skill cards now collapse duplicate skill names to one preferred entry, favoring more specific plugin repos over `shared-skills` when the same skill exists in multiple sources.

## [1.3.1] - 2026-03-13

### Fixed

- RSS generation now skips feed sources whose upstream `CHANGELOG.md` cannot be fetched, logging a warning instead of failing the entire GitHub Pages deploy.
- Updated `catalog.json` marketplace version to `1.3.1` so the release tag, published metadata, and site chrome remain aligned.

## [1.3.0] - 2026-03-13

### Added

- Added `llm-doc-skills` plugin to the marketplace: new 📄 Doc Skills card covering Word, PowerPoint, Excel, and PDF document workflows (`docx-custom`, `pptx-custom`, `xlsx-custom`, `pdf-custom`, `office-custom`).
- Added `llm-doc-skills` feed source to `catalog.json` so its releases appear in the combined RSS feed.
- Updated marketplace description to reference all four plugin families.
- Updated `catalog.json` marketplace version to `1.3.0`.

## [1.2.0] - 2026-03-13

### Added

- Expanded skill icon map in `src/lib/skills/icons.ts` to cover all 127 skills across all three plugins — 123 keyword-to-emoji mappings organized by category (CI/CD platforms, cloud, secrets, shells, package managers, AI tools, source control, databases, XML, search, text processing, binary tools, network, and more).
- Added optional `icon` field to the `PluginConfig` interface in `src/lib/catalog/types.ts` for per-plugin emoji display.
- Added emoji icons to all three plugin cards in `catalog.json`: 🧰 shared-skills, 🚀 ci-cd, 🏛️ software-design.
- Rendered plugin icons in the marketplace home page plugin card headers (`src/app/page.tsx`).
- Updated `catalog.json` marketplace version to `1.2.0`.

## [1.1.1] - 2026-03-13

### Fixed

- Corrected the published marketplace name from `Alison' LLM Plugins` to `Alison's LLM Plugins` across catalog metadata, README copy, preview artwork, and test fixtures.
- Updated `catalog.json` marketplace version to `1.1.1` so the hotfix tag, release workflow, and published site chrome remain aligned.

## [1.1.0] - 2026-03-13

### Added

- Added vendored Alison Aquinas brand assets for the site favicon, header logo bug, and social preview artwork.
- Added a compact mobile overflow menu in the header so repository and RSS links remain reachable without crowding the phone layout.

### Changed

- Renamed the published marketplace title across the UI, metadata, structured data, generated artifacts, and tests to `Alison's LLM Plugins`.
- Moved the home page introduction above the install instructions banner and refreshed the header links with GitHub and RSS icons.
- Refined the shared shell, install banner, plugin cards, skill grid, and skill detail route into a mobile-first responsive layout from phone widths through desktop.
- Updated the shared accent palette and install surfaces to use Alison Aquinas-inspired coral and ink brand tones while preserving light and dark mode behavior.
- Documented that branding assets and marketplace identity remain sourced from `catalog.json` plus vendored files in `public/`.
- Added agent guidance for republishing fresh local previews and validating them with `curl` and `wget --spider` before presenting UI work.

### Fixed

- Vendored the real Alison Aquinas favicon and logo bug assets from the local design source files so the site header and metadata use the intended branding.
- Corrected the branded bug image path to respect the `/llm-skills` base path in local previews and static export builds.
- Recovered from stale Next.js dev-server state by documenting the expectation to republish previews from a clean build cache when runtime chunks become inconsistent.
- Removed mobile-hostile truncation from install commands and kept code-heavy surfaces scrollable inside their own containers instead of forcing page-level overflow.

## [1.0.6] - 2026-03-13

### Added

- Added a persisted theme preference toggle with Light, Dark, and System modes in the site header.

### Changed

- Added a repository-local `.markdownlint-cli2.jsonc` configuration so first-party docs can be linted consistently without including generated output or dependency markdown.
- Autoformatted first-party markdown files to satisfy the repository markdownlint policy for spacing, list separation, and heading structure.
- Switched the marketplace UI to class-based theming so shared surfaces and skill detail pages respect the user's saved dark mode preference without a hydration flash.

### Fixed

- Excluded the plain `MIT LICENSE.md` text from markdownlint checks to avoid false-positive heading failures on the stock license preamble.

## [1.0.5] - 2026-03-13

### Fixed

- Added an explicit `text` language tag to the release-dispatch example in `docs/release-workflow.md` so markdownlint no longer fails the documentation workflow on `MD040`.
- Updated `catalog.json` marketplace version to `1.0.5` so the release tag, published metadata, and site chrome remain aligned.
- Refreshed the front-page `README.md` release summary to describe the `v1.0.5` documentation fix.

## [1.0.4] - 2026-03-13

### Added

- Added a shared site footer that shows the current marketplace version and credits Alison Aquinas with official website, GitHub, and LinkedIn profile links.

### Changed

- Sourced the footer version display from `catalog.json` so the published UI always reflects the same release metadata used for tags and generated artifacts.

## [1.0.3] - 2026-03-13

### Fixed

- Serialized GitHub Pages deploy runs with a workflow concurrency group so overlapping `main`, tag, and `repository_dispatch` publishes do not race when pushing the `gh-pages` branch.
- Updated `catalog.json` marketplace version to `1.0.3` so release metadata remains aligned with the published git tag and GitHub Release workflow.
- Refreshed the front-page `README.md` release summary to describe the `v1.0.3` deployment-stability fix.

## [1.0.2] - 2026-03-13

### Added

- Module-local `README.md` and `AGENTS.md` files for `src/app`, `src/components`, `src/lib`, and `scripts`.
- PlantUML module diagrams describing page composers, services, parsers, and tooling collaborators.
- Vitest unit tests for marketplace aggregation, skill filtering, route parsing, marketplace document generation, and RSS generation helpers.
- A dedicated top-level `tests/` tree that keeps unit tests separate from runtime modules while mirroring the source structure.
- Static SEO artifacts for GitHub Pages export, including `robots.txt`, `sitemap.xml`, JSON-LD structured data, and a social preview image.
- A tag-driven GitHub Release workflow that publishes release notes directly from `CHANGELOG.md`.

### Changed

- GitHub Pages deploy workflow now regenerates `rss.xml` on `main`, release tags, and upstream `repository_dispatch` events.
- Migrated first-party build and validation scripts from `.mjs` to TypeScript and run them via `tsx`.
- Tightened `tsconfig.json` by disabling `allowJs` now that the repository tooling is TypeScript-based.
- Refactored business logic into cohesive `src/lib` namespaces for catalog, commands, GitHub access, marketplace services, routes, and skills.
- Thinned page and component files so they compose services instead of owning filtering, command building, and route parsing logic.
- Added detailed file headers and API-level doc comments across source files, scripts, and tests, and documented that standard in the repo `AGENTS.md`.
- Expanded route metadata with canonical URLs, Open Graph/Twitter cards, crawl directives, and shared SEO helpers backed by `catalog.json`.
- Updated `catalog.json` marketplace version to `1.0.2` so the published metadata and git tag are aligned.
- Updated the front-page `README.md` to summarize the `1.0.2` release and point readers to the latest marketplace capabilities.

[Unreleased]: https://github.com/alisonaquinas/llm-skills/compare/v1.3.6...HEAD
[1.3.6]: https://github.com/alisonaquinas/llm-skills/compare/v1.3.5...v1.3.6
[1.3.5]: https://github.com/alisonaquinas/llm-skills/compare/v1.3.4...v1.3.5
[1.3.4]: https://github.com/alisonaquinas/llm-skills/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/alisonaquinas/llm-skills/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/alisonaquinas/llm-skills/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/alisonaquinas/llm-skills/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/alisonaquinas/llm-skills/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/alisonaquinas/llm-skills/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/alisonaquinas/llm-skills/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/alisonaquinas/llm-skills/compare/v1.0.6...v1.1.0
[1.0.6]: https://github.com/alisonaquinas/llm-skills/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/alisonaquinas/llm-skills/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/alisonaquinas/llm-skills/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/alisonaquinas/llm-skills/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/alisonaquinas/llm-skills/compare/v1.0.1...v1.0.2
