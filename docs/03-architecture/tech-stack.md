# Tech Stack

## Overview

This document defines the official technology stack for the MoroccoDrive project.

All development must follow the technologies listed in this document unless a documented architectural decision introduces a change.

---

# Core Principles

When choosing technologies, the project prioritizes:

- Scalability
- Maintainability
- Performance
- Type Safety
- Developer Experience
- Security
- Long-term support

---

# Frontend

## Framework

### Next.js 16

Purpose

- Full-stack React framework
- Server-side rendering
- App Router
- Server Components
- Server Actions
- Optimized performance

Project Standard

- Use App Router only.
- Prefer Server Components.
- Use Client Components only when required.

---

## Language

### TypeScript

Purpose

Provide type safety across the entire project.

Project Standard

- Strict mode enabled.
- Never use `any`.
- Prefer explicit typing.
- Shared types should be reusable.

---

## Styling

### Tailwind CSS

Purpose

Utility-first CSS framework.

Reason

- Fast development
- Consistent spacing
- Easy maintenance
- Excellent Next.js integration

Project Standard

- Use Tailwind utilities.
- Avoid custom CSS unless necessary.

---

## UI Components

### shadcn/ui

Purpose

Reusable accessible UI components.

Reason

- Beautiful defaults
- Accessible
- Fully customizable
- Built on Radix UI

Project Standard

Use shadcn/ui components before creating custom ones.

---

## Icons

### Lucide React

Purpose

Consistent icon library.

Project Standard

Use Lucide icons throughout the application.

---

# Backend

## Runtime

Next.js Server Actions

Purpose

Handle server-side business logic.

Project Standard

Prefer Server Actions over API Routes.

API Routes are reserved for:

- Stripe Webhooks
- External integrations
- Public endpoints

---

# Database

## PostgreSQL

Hosted on Supabase.

Reason

- Reliable
- Scalable
- Fully managed
- Excellent PostgreSQL support

---

## ORM

### Drizzle ORM

Purpose

Type-safe ORM.

Reason

- SQL-first
- Excellent TypeScript support
- Lightweight
- Great developer experience

Project Standard

All database operations must use Drizzle ORM.

Avoid raw SQL unless absolutely necessary.

---

# Authentication

## Supabase Auth

Purpose

Authentication and user management.

Responsibilities

- Login
- Registration
- Sessions
- Password reset
- Email verification

Project Standard

Authentication should always be handled through Supabase Auth.

---

# Storage

## Supabase Storage

Purpose

Store application files.

Examples

- Car images
- Agency logos
- Contract files

Project Standard

Do not store files inside the database.

Store only file URLs.

---

# Payments

## Stripe

Purpose

Online payment processing.

Responsibilities

- Subscription payments
- Booking payments
- Refunds
- Webhooks

Project Standard

Stripe is the default payment provider.

The payment architecture should remain provider-independent.

---

# Forms

## React Hook Form

Purpose

Manage forms efficiently.

Project Standard

Use React Hook Form for all forms.

---

## Validation

### Zod

Purpose

Schema validation.

Project Standard

Validate every input on the server.

Client validation is only for user experience.

---

# Data Fetching

## TanStack Query

Purpose

Client-side data fetching and caching.

Use Cases

- Search
- Filters
- Dashboard
- Infinite scrolling

Project Standard

Use TanStack Query only when client-side caching is required.

Prefer Server Components whenever possible.

---

# Email

## Resend

Purpose

Transactional emails.

Examples

- Welcome emails
- Booking confirmation
- Payment confirmation
- Password reset
- Subscription reminders

---

## React Email

Purpose

Build reusable email templates.

Project Standard

All email templates should use React Email.

---

# Development Tools

## ESLint

Purpose

Code quality.

---

## Prettier

Purpose

Consistent code formatting.

---

## Git

Purpose

Version control.

Project Standard

Every feature should be developed in its own branch.

---

# Deployment

## Vercel

Purpose

Frontend deployment.

---

## Supabase

Purpose

Database
Authentication
Storage

---

# Future Technologies

The architecture is prepared for future integration with:

- Redis
- Queue System
- Background Jobs
- Analytics
- Monitoring
- AI Features
- Mobile Application

---

# Technology Principles

When introducing a new dependency:

- It must solve a real problem.
- It should be actively maintained.
- It should support TypeScript.
- It should integrate well with Next.js.
- It should not duplicate existing functionality.

Avoid unnecessary dependencies.

Prefer simplicity whenever possible.
