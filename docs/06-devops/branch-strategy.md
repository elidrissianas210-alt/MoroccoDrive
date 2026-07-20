# Branch Strategy

## Overview

This document defines the official branching strategy for the MoroccoDrive project.

The project follows GitHub Flow with a feature-based branching model.

Every task must be developed in its own dedicated branch.

---

# Main Branch

## main

Purpose

Production-ready code.

Rules

- Protected branch.
- Direct pushes are forbidden.
- Every change must go through a Pull Request.
- CI must pass before merging.
- The branch must always remain deployable.

---

# Feature Branches

Pattern

feature/<feature-name>

Examples

feature/authentication

feature/database-schema

feature/landing-page

feature/car-management

feature/booking-system

feature/payment-integration

Rules

- One feature per branch.
- Start from the latest `main`.
- Delete the branch after merging.

---

# Bug Fix Branches

Pattern

fix/<bug-name>

Examples

fix/login-validation

fix/payment-webhook

fix/navbar-mobile

Rules

- Only bug fixes.
- No new features.
- Merge after successful review.

---

# Refactoring Branches

Pattern

refactor/<area>

Examples

refactor/auth-service

refactor/database-layer

refactor/car-module

Rules

- Improve existing code only.
- No feature additions.
- Preserve existing functionality.

---

# Documentation Branches

Pattern

docs/<topic>

Examples

docs/database

docs/api-conventions

docs/security

Rules

- Documentation updates only.
- No application code.

---

# Chore Branches

Pattern

chore/<task>

Examples

chore/update-dependencies

chore/eslint-config

chore/docker

chore/github-actions

Rules

Used for maintenance tasks that do not change application behavior.

---

# Release Branches

Currently not required.

The project deploys directly from the `main` branch.

Release branches may be introduced in the future if needed.

---

# Branch Lifecycle

Create branch

↓

Implement feature

↓

Commit changes

↓

Push branch

↓

Open Pull Request

↓

GitHub Actions

↓

Review

↓

Merge

↓

Delete branch

---

# Branch Naming Rules

Use:

- lowercase
- kebab-case
- meaningful names

Good

feature/user-profile

feature/car-search

feature/agency-dashboard

Bad

feature/test

feature/new

feature/update

feature/aaaa

---

# Branch Ownership

Each branch should implement a single responsibility.

Good

feature/payment

Bad

feature/payment-and-booking-and-dashboard

---

# Keeping Branches Updated

Before opening a Pull Request:

git checkout main

git pull origin main

git checkout feature/your-feature

git rebase main

Resolve conflicts before creating the Pull Request.

---

# Protected Branch Rules

The `main` branch must enforce:

- Require Pull Requests
- Require GitHub Actions
- Require up-to-date branches
- Prevent force pushes
- Prevent direct commits

---

# Branch Cleanup

After a successful merge:

- Delete the remote branch.
- Delete the local branch.
- Keep the repository clean.

---

# Development Principles

- One task = One branch.
- One branch = One Pull Request.
- One Pull Request = One logical change.

Avoid mixing unrelated work in the same branch.