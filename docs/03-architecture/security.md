# Security

## Overview

Security is a core requirement of the MoroccoDrive platform.

Every feature must follow these rules.

---

# Authentication

Authentication is handled exclusively by Supabase Auth.

Never implement custom authentication.

Always verify authenticated users on the server.

---

# Authorization

Every protected action must verify:

- User role
- Resource ownership
- Required permissions

Never trust client-side roles.

---

# Input Validation

Every request must be validated using Zod.

Never trust client input.

Sanitize user input whenever necessary.

---

# Database Security

Use PostgreSQL Foreign Keys.

Use Row Level Security (RLS) where appropriate.

Never expose internal IDs unnecessarily.

---

# Secrets

Never expose:

- API Keys
- Stripe Secret Keys
- Database Credentials
- Service Role Keys

Store secrets only in environment variables.

---

# Payments

Payments must always be verified using Stripe Webhooks.

Never trust:

- Client payment success
- Client payment amount

The payment provider is the source of truth.

---

# File Uploads

Allowed files only.

Validate:

- MIME Type
- File Size
- Upload Permissions

Store uploaded files in Supabase Storage.

Store only URLs inside PostgreSQL.

---

# Rate Limiting

Protect sensitive actions.

Examples

- Login
- Register
- Password Reset
- Payments

---

# Error Messages

Never expose:

- SQL Errors
- Stack Traces
- Internal Exceptions

Return generic messages to users.

Log technical details internally.

---

# Logging

Log:

- Authentication failures
- Payment failures
- Unexpected exceptions
- Critical business events

Never log passwords or sensitive information.

---

# Environment Variables

Secrets belong only inside:

.env.local

Never commit environment files.

---

# HTTPS

Production must always use HTTPS.

Never send sensitive information over unsecured connections.

---

# Dependencies

Only install trusted dependencies.

Prefer well-maintained libraries.

Remove unused dependencies.

---

# Principle of Least Privilege

Every user should only access the resources they are allowed to access.

No feature should expose unnecessary permissions.

---

# Security Reviews

Every feature should be reviewed for:

- Authentication
- Authorization
- Validation
- Input Sanitization
- Error Handling
- Sensitive Data Exposure