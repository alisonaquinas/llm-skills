# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Static RSS feed generation for combined release notes across configured marketplace feed sources
- `catalog.json` feed-source configuration so new source repos can join the RSS feed without generator code changes

### Changed
- GitHub Pages deploy workflow now regenerates `rss.xml` on `main`, release tags, and upstream `repository_dispatch` events

## [1.0.0] - 2026-03-11

### Added
- Tag-driven CI/CD release pipeline across all skill repos
- `repository_dispatch` trigger so marketplace auto-rebuilds on upstream releases
- `docs/release-workflow.md` documenting the full release process
- GitHub Actions `release.yml` added to `llm-shared-skills` and `llm-ci-dev`

### Changed
- Version bumped to 1.0.0 - first stable public release
- Published to GitHub Pages at `https://alisonaquinas.github.io/llm-skills/`

## [0.1.0] - 2026-03-11

### Added
- Initial marketplace built with Next.js 15 App Router and Tailwind CSS
- GitHub API data layer fetching skill metadata from two source repos:
  - `alisonaquinas/llm-shared-skills` (49 skills)
  - `alisonaquinas/llm-ci-dev` (61 skills)
- Home page with plugin registry summary cards (version, description, skill count)
- Client-side skill grid with live search and repo filter (no page reload)
- Skill detail pages at `/skill/{owner}/{repo}/{name}` showing:
  - File listing with SKILL.md highlighted
  - Copy-ready `git clone` install command
  - Full SKILL.md content with copy-raw button
- Static export (`output: 'export'`) with `basePath: /llm-skills` for GitHub Pages
- GitHub Actions workflow deploying `out/` to `gh-pages` branch on push to `main`
- `AGENTS.md` with architecture notes and contribution guide for AI agents
- MIT License

