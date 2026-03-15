# Release Guide

This document describes the release process for `llm-skills` marketplace and prevents version mismatch failures.

## Version Sync Requirements

**Critical:** The release workflow validates that the Git tag matches the marketplace version in `catalog.json`. Both must be updated together before tagging.

### Version Files to Update

When releasing a new version, update **both** of these files in the same commit:

1. **`package.json`** — The npm/Node.js package version (used for dev tooling)
2. **`catalog.json`** — The marketplace identity version (validated by CI during release)

### Release Workflow

1. Update `package.json` and `catalog.json` to the new version (e.g., `1.3.8`)
2. Create a release commit: `git commit -m "chore(release): cut v1.3.8"`
3. Tag the commit: `git tag v1.3.8`
4. Push both: `git push origin main v1.3.8`

The release workflow will:
- Extract the version from `catalog.json`
- Validate that `TAG == v{catalog.json version}`
- Build static artifacts (`out/`)
- Publish to GitHub Pages
- Dispatch `plugin-updated` webhook to marketplace aggregators

### Common Failures

**"tag v1.3.8 does not match catalog.json version v1.3.7"**

This means the Git tag was pushed before `catalog.json` was updated. Fix:

1. Update `catalog.json` to match the tag version
2. Create a new release commit (or amend if unpushed)
3. Move the tag: `git tag -f v1.3.8 HEAD`
4. Force-push: `git push origin v1.3.8 --force`

## Why Two Files?

- **`package.json`** — Local tooling and Node.js ecosystem identity
- **`catalog.json`** — Published marketplace identity and SEO metadata

Both are part of the release artifact published to GitHub Pages, so they must stay synchronized.

## Checklist

- [ ] Updated `package.json` version
- [ ] Updated `catalog.json` version (same number)
- [ ] Verified both files have matching version numbers
- [ ] Committed both changes together
- [ ] Tagged with `v{version}`
- [ ] Pushed `main` branch and tag
