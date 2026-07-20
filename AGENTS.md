# MoroccoDrive AI Development Guide

## Before Starting Any Task

- Read all documentation inside `/docs` before starting any task.
- Follow the project architecture and documentation.
- If documentation conflicts with implementation, documentation is the source of truth.
- Never modify the database schema without updating `docs/03-architecture/database.md`.
- Never introduce new dependencies without justification.
- Keep every implementation aligned with the project architecture.

---

## General Principles

- Follow all coding rules defined in `docs/03-architecture/coding-rules.md`.
- Respect the folder structure.
- Write clean, reusable, production-ready code.
- Never duplicate business logic.
- Keep components small and focused.
- Use TypeScript strict mode.
- Validate all inputs with Zod.
- Use Server Actions by default unless an API Route is required.
- Never expose secrets or sensitive data.

---

## Before Finishing a Task

- Ensure there are no TypeScript errors.
- Ensure there are no ESLint errors.
- Remove unused imports and variables.
- Update documentation if architecture or business logic changes.
- Make sure the implementation matches the acceptance criteria.