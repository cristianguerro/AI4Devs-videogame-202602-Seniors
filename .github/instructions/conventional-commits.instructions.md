---
description: "Use when creating git commits, proposing commit messages, or preparing pull requests that include commit history. Enforce Conventional Commits format and examples."
name: "Conventional Commits"
---
# Conventional Commits

- Use the header format: `<type>(<scope>): <subject>`
- Scope is optional: `<type>: <subject>` is valid.
- Use lowercase for `type` and `subject` unless a proper noun requires uppercase.
- Keep the subject concise, imperative, and without a trailing period.
- Keep the header under 72 characters when possible.
- Allowed `type` values:
  - `feat`
  - `fix`
  - `docs`
  - `style`
  - `refactor`
  - `perf`
  - `test`
  - `build`
  - `ci`
  - `chore`
  - `revert`

Breaking changes:

- Use `!` in the header when appropriate: `feat(api)!: remove v1 endpoints`
- Add a footer with `BREAKING CHANGE: <details>`

Body and footers:

- Add a body when context is needed, wrapping lines around 72 characters.
- Reference issues in footers when relevant, such as `Refs: #123` or `Closes: #123`.

Examples:

- `feat(onitama): add turn validation`
- `fix(ui): prevent card desync after undo`
- `docs(readme): explain local setup`
- `refactor(engine): simplify move resolution`
- `feat(api)!: remove deprecated route`