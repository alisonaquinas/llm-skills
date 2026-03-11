# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [0.1.0] — 2026-03-11

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
