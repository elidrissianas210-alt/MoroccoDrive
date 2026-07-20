# Git Workflow

## Overview

This document defines the official Git workflow for the MoroccoDrive project.

Every contribution must follow this workflow.

The project uses GitHub Flow.

---

# Workflow

Every new task follows this lifecycle:

Create Branch

↓

Implement

↓

Commit

↓

Push

↓

Pull Request

↓

GitHub Actions

↓

Code Review

↓

Merge into main

↓

Automatic Deployment

---

# Main Branch

The `main` branch always represents the production-ready version of the application.

Rules

- Never commit directly to `main`.
- Never push directly to `main`.
- Every change must go through a Pull Request.
- The main branch must always remain deployable.

---

# Feature Development

Every task starts from the latest `main`.

Example:

git checkout main

git pull origin main

git checkout -b feature/authentication

Only one feature should be developed per branch.

---

# Pull Requests

Every feature branch must create a Pull Request before merging.

A Pull Request must:

- Explain the implemented feature.
- Pass all GitHub Actions.
- Be reviewed.
- Have no merge conflicts.

---

# Code Review

Before approving a Pull Request verify:

- Requirements completed
- Clean architecture
- No duplicated code
- TypeScript passes
- ESLint passes
- Documentation updated
- Manual testing completed

---

# Merge Rules

Merge only after:

- CI passes
- Review completed
- Documentation updated
- Feature tested

Use Squash Merge to keep Git history clean.

---

# Hotfixes

Critical production issues should use:

fix/...

After review they are merged into main immediately.

---

# Documentation

Documentation changes should use:

docs/...

Examples:

docs/database-update

docs/security-rules

---

# Refactoring

Refactoring should never be mixed with feature development.

Use dedicated branches.

Example:

refactor/payment-service

---

# Dependency Updates

Dependency updates should use:

chore/...

Example:

chore/update-nextjs

---

# Rollback Strategy

If a deployment fails:

- Revert the Pull Request.
- Merge the revert.
- Redeploy automatically.

Never modify production manually.

---

# Development Principles

- Small Pull Requests.
- One feature per branch.
- Keep commits meaningful.
- Keep Git history clean.
- Never bypass code review.