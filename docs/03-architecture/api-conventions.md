# API Conventions

## Overview

This document defines the standards for server communication in the MoroccoDrive project.

The project primarily uses Next.js Server Actions.

API Routes should only be created when Server Actions are not appropriate.

---

# Server Actions

Server Actions are the default approach.

Use Server Actions for:

- Authentication
- Profile Management
- Agency Management
- Vehicle Management
- Bookings
- Reviews
- Favorites
- Dashboard Actions

Do not create API Routes for these features unless there is a technical requirement.

---

# API Routes

API Routes are only allowed for:

- Stripe Webhooks
- External Integrations
- Public APIs
- Third-party callbacks

Examples

/api/stripe/webhook

/api/auth/callback

---

# Naming

Server Actions

createBooking()

cancelBooking()

updateProfile()

createReview()

API Routes

/api/stripe/webhook

/api/auth/callback

---

# Response Format

Successful responses should always follow a consistent format.

Example

{
    success: true,
    data: ...
}

Errors

{
    success: false,
    message: "..."
}

---

# Pagination

Use cursor pagination whenever possible.

If unnecessary, use simple pagination.

Example

?page=1

&pageSize=20

---

# Sorting

Example

?sort=price

?order=asc

Allowed values

asc

desc

---

# Filtering

Filtering should always use query parameters.

Example

?brand=BMW

?category=SUV

?city=Marrakech

?priceMin=300

?priceMax=1000

---

# Validation

Every request must be validated using Zod.

Never trust client-side validation.

---

# Error Handling

Never expose internal errors.

Return meaningful messages.

Log unexpected exceptions.

---

# Authentication

Protected actions require authentication.

Never trust data coming from the client.

Always verify permissions on the server.

---

# Authorization

Every protected action must verify:

- User identity
- User role
- Resource ownership

---

# File Uploads

Files should never pass through the database.

Upload flow

Client

↓

Supabase Storage

↓

Store URL inside PostgreSQL

---

# Stripe

Never trust payment status from the client.

Always verify payments through Stripe Webhooks.

---

# Future APIs

Future public APIs should be versioned.

Example

/api/v1/