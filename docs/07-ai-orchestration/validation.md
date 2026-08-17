# Validation Workflow

Validation is proportional to risk, but no feature skips the final review and applicable project checks. The order is:

```text
TypeScript -> ESLint -> Tests/manual checks -> Build -> Docker (CI) -> Security review -> Final review -> GitHub Actions CI -> PR
```

## Stages

- **During implementation:** run focused checks for the changed area and validate success, error, edge, and permission paths. Database work includes migration/schema validation; UI work includes accessibility and responsive states.
- **Integration checkpoint:** run `npm run type-check`, `npm run lint`, and relevant tests after cross-agent integration. If a script is unavailable, record that fact; do not claim it passed.
- **Pre-PR:** run the project's type check, lint, production build, relevant tests/manual checks, and `docker build .` when Docker is available and the change can affect the image. Confirm docs and diff scope.
- **Security gate:** Security reviews server/client boundaries, authentication, authorization, ownership, Zod validation, RLS implications, secrets, uploads, payments, and sensitive data according to `docs/03-architecture/security.md`.
- **CI:** GitHub Actions is authoritative for install, type-check, ESLint, build, and Docker image validation. Future test/security jobs apply when configured. Any failed required check blocks merge.

## Evidence

Record command, result, and scope in the handoff. A skipped check needs a reason and an owner. Fix failures before progressing; do not repeatedly rerun a deterministic failure.

## Documentation-only changes

Documentation changes do not require application behavior tests, but they still require review, link/path consistency checks, Git scope checks, and the repository's applicable CI. If CI invokes application checks, report their actual result rather than treating documentation scope as an override.
