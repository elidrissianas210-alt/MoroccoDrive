# Folder Structure

## Overview

This document defines the official folder structure for the MoroccoDrive project.

The project follows a feature-based (domain-driven) architecture to improve scalability, maintainability, and developer experience.

Every new feature must follow this structure.

---

# Project Structure

```
src/
│
├── app/
├── actions/
├── components/
├── db/
├── hooks/
├── lib/
├── modules/
├── services/
├── types/
├── utils/
├── validators/
└── middleware.ts
```

---

# app/

Contains all application routes using the Next.js App Router.

Responsibilities:

- Pages
- Layouts
- Route groups
- Loading UI
- Error UI

Business logic should never live here.

---

# actions/

Contains all Server Actions.

Responsibilities:

- Create booking
- Update profile
- Cancel booking
- Create review
- Subscription actions

Rules

- One action per file.
- Validate inputs using Zod.
- Never access UI components.

---

# components/

Contains reusable UI components shared across multiple features.

Examples

- Button
- Card
- Dialog
- Navbar
- Footer
- Data Table
- Pagination

Rules

Only shared components belong here.

Feature-specific components must stay inside their module.

---

# db/

Database layer.

Structure

```
db/

schema/

migrations/

index.ts
```

Responsibilities

- Database schema
- Database connection
- Relations
- Migrations

---

# hooks/

Reusable React hooks.

Examples

- usePagination
- useDebounce
- useSearch
- useFilters

Rules

Hooks should never contain business logic.

---

# lib/

Shared utilities and third-party configurations.

Examples

- Stripe
- Supabase
- Authentication helpers
- Date helpers

---

# modules/

Business domains.

Each module owns its own files.

Example

```
modules/

auth/

agencies/

cars/

bookings/

payments/

subscriptions/

reviews/

contracts/
```

Each module may contain

```
cars/

components/

actions/

services/

validators/

types/

utils/
```

Rules

A module should be self-contained.

Feature-specific code belongs inside the module.

---

# services/

Business services shared across multiple modules.

Examples

- Email service
- Stripe service
- Notification service

Rules

Services should contain business logic, not UI.

---

# validators/

Global Zod validation schemas.

Feature-specific validators belong inside the corresponding module.

---

# types/

Shared TypeScript types.

Examples

- Pagination
- API responses
- Global enums

---

# utils/

Pure utility functions.

Examples

- formatCurrency()
- slugify()
- calculateDays()

Rules

Utility functions should be stateless.

---

# Public Folder

Used for static assets.

Examples

- Images
- Icons
- Fonts

Do not store uploaded files here.

---

# Documentation

```
docs/

01-product/

02-design/

03-architecture/

04-features/

05-decisions/

tasks/
```

Documentation is the source of truth.

---

# Naming Conventions

Folders

kebab-case

Files

kebab-case

Components

PascalCase

Variables

camelCase

Database tables

snake_case

Database columns

snake_case

---

# Architecture Principles

- Keep modules isolated.
- Prefer composition over inheritance.
- Avoid circular dependencies.
- Shared code belongs in shared folders.
- Feature-specific code belongs inside modules.
- Business logic must remain independent from UI.

---

# Folder Ownership

Each file should have a clear owner.

Ask:

"Which feature owns this file?"

If the answer is unclear, the file is probably in the wrong place.

---

# Future Scalability

This structure supports future additions such as:

- Mobile application
- Admin dashboard
- API versioning
- Background jobs
- AI features
- Multi-country support
- Multiple payment providers


## Service Organization

The project follows a hybrid service architecture.

### Module Services

By default, every service belongs to its owning module.

Example:

modules/
├── cars/
│   └── services/
├── bookings/
│   └── services/
├── payments/
│   └── services/

Module services should only contain business logic related to that specific domain.

---

### Shared Services

If a service is used by multiple modules, it should be promoted to the global `src/services` directory.

Examples:

src/
└── services/
    ├── stripe/
    ├── email/
    ├── storage/
    ├── logger/
    └── notifications/

Shared services must remain framework-independent whenever possible.

---

### Guiding Principle

Start local.

Promote to shared only when multiple modules depend on the same service.

Avoid premature abstraction.