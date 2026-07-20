# Docker

## Overview

This document defines the Docker strategy for the MoroccoDrive project.

Docker provides a consistent development environment across all machines and CI/CD pipelines.

The goal is to ensure that the application behaves identically in development, testing, and production.

---

# Objectives

Docker is used to:

- Standardize the development environment.
- Eliminate "works on my machine" issues.
- Validate production builds.
- Simplify onboarding.
- Support CI/CD pipelines.

---

# Docker Philosophy

Only the Next.js application runs inside Docker.

External services are managed by cloud providers.

Current architecture:

- Next.js → Docker
- PostgreSQL → Supabase
- Authentication → Supabase Auth
- Storage → Supabase Storage

No local PostgreSQL container is required.

---

# Containers

Current containers:

- moroccodrive-app

Future containers:

- redis
- worker
- queue
- monitoring

Only introduce new containers when required.

---

# Dockerfile

The application uses a multi-stage Docker build.

Stages:

- Dependencies
- Builder
- Production

Goals:

- Small image size
- Fast builds
- Production optimization

---

# Docker Compose

Docker Compose is used for local development.

Responsibilities:

- Build the application
- Run the container
- Load environment variables
- Mount volumes during development

---

# Environment Variables

Docker loads environment variables from:

.env.local

Never store secrets inside Dockerfiles.

---

# Volumes

Use bind mounts during development.

Never store application data inside containers.

Containers should remain stateless.

---

# Networking

The application communicates directly with Supabase over HTTPS.

No custom Docker network is required at this stage.

---

# Production

Production deployments use Docker only for build validation.

The application is deployed to Vercel.

Docker ensures that production builds remain reproducible.

---

# Best Practices

- Keep images lightweight.
- Use multi-stage builds.
- Never run as root.
- Ignore unnecessary files using .dockerignore.
- Rebuild images after dependency changes.

---

# Future Improvements

Future Docker support may include:

- Redis
- Background workers
- Queue system
- Monitoring services
- Local Mail Server

---

# Development Principles

Docker should simplify development, not complicate it.

Only containerize services that provide real value.