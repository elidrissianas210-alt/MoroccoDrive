# Orchestrated Git Workflow

The user-requested orchestration foundation uses `feature/ai-orchestration-foundation`. For normal feature work, follow `docs/06-devops/branch-strategy.md` and `git-workflow.md`: one logical feature, one branch, one PR, starting from the latest `main`.

## Ownership

- **Orchestrator:** verifies branch, base commit, scope, status, and that agents do not work on `main`; tracks commits and PR readiness.
- **Implementation agents:** edit only assigned files and report changes; they do not create uncontrolled branches or include unrelated changes.
- **Orchestrator or designated integration owner:** stages only reviewed paths and creates meaningful commits. For this foundation, the commit message is `docs(ai): define agent orchestration workflow`.
- **Human developer:** authorizes push/PR when required, owns credentials and repository settings, and retains merge authority.

## Rules

Never commit pre-existing changes, secrets, `.env.local`, generated noise, or unrelated files. Never force-push, rewrite another agent's work, merge `main`, or bypass review. Before PR, rebase the feature branch onto current `main`, resolve conflicts, confirm the diff, and run required validation. Use squash merge; only a human/repository maintainer merges. After merge, delete the branch according to project policy.

## Checkpoints

Record the starting commit and dirty paths. Before commit, inspect staged paths and diff. After commit, verify the commit contains only the orchestration docs. After push, verify the remote branch and commit. A PR is ready only when CI, review, documentation, and branch freshness requirements are satisfied.
