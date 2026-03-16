# AGENTS.md

## Responsibility

- Implement repository tooling and file-generation workflows.
- Keep entrypoints simple and reusable logic in `scripts/lib`.

## Rules

- Prefer pure helpers in `scripts/lib` over growing CLI files.
- Keep output writing separate from document construction when practical.
- Mirror validation rules in tests when the behavior is stable and business-relevant.
- Every source file must have a file-level JSDoc header stating its responsibilities.
- All exported functions and interfaces must have JSDoc; use `@param` and `@returns` on functions.
- CLI entrypoints must guard `isMainModule` checks so helpers remain importable by tests without side effects.
