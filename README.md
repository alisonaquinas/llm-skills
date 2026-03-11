# Claude Plugin Marketplace

A static Next.js marketplace for browsing and installing LLM skill packages
for Claude Code and Codex.

**Live site:** https://alisonaquinas.github.io/llm-skills/

## Skill sources

| Package | Skills | Description |
|---------|--------|-------------|
| [llm-shared-skills](https://github.com/alisonaquinas/llm-shared-skills) | 49 | General-purpose tools: bash, git, docker, aws, jq, zoxide, … |
| [llm-ci-dev](https://github.com/alisonaquinas/llm-ci-dev) | 61 | CI/CD pipelines: GitHub Actions, GitLab CI, Jenkins, Kubernetes, Terraform, … |

## Development

```bash
npm install
npm run dev      # → http://localhost:3000/llm-skills
```

## Build & deploy

```bash
npm run build    # Static export → out/
```

Push to `main` — GitHub Actions builds and publishes to GitHub Pages automatically.

Set `GITHUB_TOKEN` to avoid API rate limits during the build.

## Adding a new skill repo

Add an entry to the `REPOS` array in `src/lib/github.ts`:

```ts
{
  owner: "your-github-username",
  repo:  "your-repo-name",
  label: "My Skills",
  color: "bg-violet-100 text-violet-800",
}
```

The repo needs skills in a `skills/` directory and a
`.claude-plugin/plugin.json` metadata file.

## License

MIT — © 2026 Alison Aquinas
