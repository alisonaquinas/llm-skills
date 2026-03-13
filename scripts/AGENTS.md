# AGENTS.md

## Responsibility

- Implement repository tooling and file-generation workflows.
- Keep entrypoints simple and reusable logic in `scripts/lib`.

## Rules

- Prefer pure helpers in `scripts/lib` over growing CLI files.
- Keep output writing separate from document construction when practical.
- Mirror validation rules in tests when the behavior is stable and business-relevant.
