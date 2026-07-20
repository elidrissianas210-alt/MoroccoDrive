# GitHub Actions

## Overview

This document defines the Continuous Integration (CI) and Continuous Deployment (CD) workflow for the MoroccoDrive project.

Every Pull Request and every merge into the `main` branch must pass the GitHub Actions pipeline.

The goal is to ensure that the project always remains stable, buildable, and production-ready.

---

# Objectives

GitHub Actions is responsible for:

- Code Quality
- Type Safety
- Build Verification
- Docker Image Validation
- Automatic Deployment
- Preventing broken code from reaching production

---

# Continuous Integration (CI)

CI runs automatically when:

- A Pull Request is opened
- A Pull Request is updated
- Code is pushed to a feature branch

Pipeline:

Checkout Repository

↓

Install Dependencies

↓

Setup Node.js

↓

Install Packages

↓

Generate Types (if required)

↓

TypeScript Type Check

↓

ESLint

↓

Build Application

↓

Docker Build Validation

↓

CI Success

---

# Continuous Deployment (CD)

CD only runs after code is merged into the `main` branch.

Pipeline:

Merge into main

↓

Run CI

↓

Build Production

↓

Deploy to Vercel

↓

Deployment Successful

---

# Branches

Run CI on:

- feature/*
- fix/*
- refactor/*
- docs/*
- chore/*
- pull_request
- main

Deploy only from:

- main

---

# Required Checks

Every Pull Request must pass:

- Install dependencies
- Type checking
- ESLint
- Production build
- Docker image build

Future checks:

- Unit tests
- Integration tests
- End-to-end tests

---

# Type Checking

Run:

npm run type-check

The build must fail if TypeScript reports errors.

---

# Linting

Run:

npm run lint

No warnings should be ignored.

No ESLint errors are allowed.

---

# Build

Run:

npm run build

The project must build successfully before merging.

---

# Docker Validation

Every Pull Request must verify that the Docker image builds successfully.

Run:

docker build .

The image is validated but not deployed.

---

# Deployment

Production deployment is automatic.

Provider:

Vercel

Database:

Supabase

Storage:

Supabase Storage

Authentication:

Supabase Auth

---

# Secrets

Secrets must never exist inside the repository.

Use GitHub Secrets.

Examples:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

STRIPE_SECRET_KEY

STRIPE_WEBHOOK_SECRET

RESEND_API_KEY

VERCEL_TOKEN

VERCEL_PROJECT_ID

VERCEL_ORG_ID

---

# Failure Policy

If any CI step fails:

- Block merge
- Do not deploy
- Fix the issue
- Re-run the pipeline

---

# Pull Request Policy

A Pull Request cannot be merged unless:

- CI passes
- Review completed
- Branch is up-to-date
- No merge conflicts

---

# Notifications

Future integrations may include:

- Slack
- Discord
- Email notifications

---

# Future Improvements

The CI/CD pipeline is designed to support:

- Unit Testing
- Integration Testing
- End-to-End Testing
- Security Scanning
- Dependency Scanning
- Performance Testing
- Lighthouse Audits
- Automatic Releases

---

# Development Philosophy

Automation should prevent human mistakes.

Every deployment should be:

- Repeatable
- Reliable
- Predictable

CI/CD should always protect production from broken code.