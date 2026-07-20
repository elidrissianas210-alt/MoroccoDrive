# Coding Rules

## Purpose

This document defines the coding standards for the MoroccoDrive project.

Every implementation must follow these rules without exception.

---

# General Principles

- Write clean, maintainable, and scalable code.
- Prioritize readability over cleverness.
- Avoid unnecessary complexity.
- Follow SOLID principles where applicable.
- Do not duplicate business logic.
- Always prefer composition over duplication.

---

# TypeScript Rules

- Use TypeScript strict mode.
- Never use `any`.
- Prefer `unknown` over `any`.
- Always define interfaces or types.
- Use enums only when they provide real value.
- Export shared types from a dedicated location.
- Keep types close to their domain.

---

# Next.js Rules

- Use App Router.
- Use Server Components by default.
- Use Client Components only when necessary.
- Prefer Server Actions over API Routes.
- API Routes should only be used for:
  - Stripe Webhooks
  - External integrations
  - Public endpoints

---

# Component Rules

- Components must have a single responsibility.
- Keep components small and reusable.
- If a component is reused more than once, move it to the shared components directory.
- Business logic should not live inside UI components.
- Avoid deeply nested components.

---

# Folder Rules

- Follow the established folder structure.
- Keep related files inside their domain.
- Do not place unrelated files together.
- Do not create new folders without a valid architectural reason.

---

# Database Rules

- Never access the database directly from UI components.
- Use Drizzle ORM only.
- Never write raw SQL unless absolutely necessary.
- Always use relations defined in the schema.
- Never duplicate database queries.

---

# Validation Rules

- Validate every input using Zod.
- Never trust client-side validation.
- Validate Server Actions.
- Validate API Routes.
- Return meaningful validation errors.

---

# Error Handling

- Never expose internal errors.
- Log unexpected errors.
- Return user-friendly error messages.
- Use consistent error handling across the project.

---

# Authentication & Authorization

- Always verify authentication.
- Never trust client roles.
- Verify permissions on the server.
- Protect every sensitive action.
- Follow the role-based access control rules.

---

# Security Rules

- Never expose secrets.
- Never hardcode API keys.
- Use environment variables.
- Sanitize user input.
- Protect against unauthorized access.

---

# Performance Rules

- Minimize unnecessary re-renders.
- Use lazy loading when appropriate.
- Optimize database queries.
- Avoid unnecessary network requests.
- Keep bundle size as small as possible.

---

# Naming Conventions

## Files

Use kebab-case.

Example:

car-card.tsx

agency-details.tsx

---

## Components

Use PascalCase.

Example:

CarCard

BookingDetails

---

## Variables

Use camelCase.

Example:

dailyPrice

bookingStatus

---

## Constants

Use UPPER_SNAKE_CASE.

Example:

MAX_CARS

DEFAULT_PAGE_SIZE

---

## Database

Tables:

snake_case

Plural

Example:

cars

car_images

booking_drivers

Columns:

snake_case

Foreign keys:

agency_id

car_id

booking_id

---

# Styling Rules

- Use Tailwind CSS.
- Use shadcn/ui components.
- Do not write unnecessary custom CSS.
- Follow the design system.
- Keep spacing consistent.

---

# Code Quality

Before completing any task:

- No TypeScript errors.
- No ESLint errors.
- No duplicated code.
- No unused imports.
- No unused variables.
- No console.log.
- No TODO comments.

---

# Testing

Every feature must be manually tested before being considered complete.

Verify:

- Success flow
- Error flow
- Edge cases
- Permission checks

---

# Documentation

If implementation changes:

- Database
- Folder structure
- Architecture
- Business logic

Update the documentation accordingly.

---

# Definition of Done

A task is considered complete only if:

- Requirements are fully implemented.
- Code follows all coding rules.
- No lint errors.
- No TypeScript errors.
- Manual testing completed.
- Documentation updated if needed.
- Code is production-ready.