# Environments

## Overview

This document defines the environments used by the MoroccoDrive project.

Each environment has its own configuration and secrets.

---

# Development

Purpose

Local development.

Environment File

.env.local

Characteristics

- Local machine
- Debugging enabled
- Connected to Supabase development project

---

# Preview

Purpose

Pull Request testing.

Hosted by

Vercel Preview Deployments

Characteristics

- Temporary
- Automatically created
- Safe for testing

---

# Production

Purpose

Live application.

Hosted by

Vercel

Characteristics

- Optimized
- Secure
- Stable

---

# Environment Variables

Common variables:

NEXT_PUBLIC_APP_URL

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

DATABASE_URL

SUPABASE_SERVICE_ROLE_KEY

STRIPE_SECRET_KEY

STRIPE_WEBHOOK_SECRET

RESEND_API_KEY

---

# Rules

- Never commit .env.local
- Never expose secret keys
- Keep .env.example updated
- Store production secrets inside Vercel

---

# .env.example

The repository should always contain an up-to-date .env.example file.

It should contain variable names only.

Example:

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

DATABASE_URL=

STRIPE_SECRET_KEY=

RESEND_API_KEY=

---

# Secret Management

Development

.env.local

Production

Vercel Environment Variables

GitHub Secrets

Supabase Secrets

---

# Configuration Rules

- Keep variable names consistent.
- Never duplicate secrets.
- Never hardcode credentials.
- Use descriptive variable names.

---

# Future Environments

The architecture supports additional environments such as:

- Staging
- QA
- Testing
- Demo

without changing the application architecture.

---

# Development Principles

Configuration should remain environment-specific.

The application code should never change between environments.

Only configuration should change.
