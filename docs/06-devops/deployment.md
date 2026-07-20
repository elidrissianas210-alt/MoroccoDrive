# Deployment

## Overview

This document defines the deployment strategy for the MoroccoDrive project.

Deployments should be automated, repeatable, and reliable.

---

# Architecture

GitHub

↓

GitHub Actions

↓

Vercel

↓

Supabase

---

# Deployment Flow

Developer

↓

Feature Branch

↓

Pull Request

↓

GitHub Actions

↓

Merge into main

↓

Automatic Deployment

---

# Hosting

Frontend

- Vercel

Database

- Supabase PostgreSQL

Authentication

- Supabase Auth

Storage

- Supabase Storage

Payments

- Stripe

Emails

- Resend

---

# Preview Deployments

Every Pull Request automatically generates a Preview Deployment.

Purpose:

- UI testing
- QA
- Review

Preview deployments should never affect production data.

---

# Production Deployment

Only the main branch can trigger production deployment.

Deployment is automatic.

Manual deployments should be avoided.

---

# Rollback Strategy

If production fails:

- Revert the Pull Request.
- Push the revert.
- Trigger automatic deployment.

Never modify production manually.

---

# Deployment Checklist

Before deployment:

- CI passes
- Build succeeds
- TypeScript passes
- ESLint passes
- Documentation updated

---

# Domains

Production

https://moroccodrive.com

Future

https://app.moroccodrive.com

---

# Secrets

Deployment secrets are stored in:

- GitHub Secrets
- Vercel Environment Variables

Never store secrets inside Git.

---

# Monitoring

Future integrations:

- Sentry
- Better Stack
- Vercel Analytics

---

# Development Principles

Production should always be deployable.

Every deployment should be reversible.

Deployment must remain fully automated.