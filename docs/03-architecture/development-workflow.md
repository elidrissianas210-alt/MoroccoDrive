# Development Workflow

## Overview

This document defines the official development workflow for the MoroccoDrive project.

Every implementation must follow this workflow to ensure consistency, quality, and maintainability.

---

# General Workflow

Every feature follows the same lifecycle:

1. Product Decision
2. Documentation
3. Task Creation
4. Implementation
5. Manual Testing
6. Code Review
7. Documentation Update
8. Merge

No implementation should skip any step.

---

# Before Starting Any Task

Before writing code:

- Read `AGENTS.md`
- Read all relevant documentation inside `/docs`
- Understand the feature requirements
- Review related architecture decisions
- Review database documentation if database changes are involved

Never start implementing a feature without understanding the documentation.

---

# Task Scope

Each task must have a single responsibility.

Examples:

✅ Create Login Page

✅ Create Booking Service

✅ Create Cars Table

❌ Build Authentication System

❌ Build Booking Module

Large features must always be split into smaller tasks.

---

# Implementation Rules

During implementation:

- Follow the project architecture.
- Follow all coding rules.
- Keep code simple.
- Avoid unnecessary abstractions.
- Do not over-engineer.
- Write production-ready code.

---

# Documentation

Documentation is the source of truth.

If implementation changes:

- Database
- Architecture
- Business Logic
- Folder Structure

The documentation must be updated before the task is considered complete.

---

# Testing

Every completed task must be manually tested.

Verify:

- Success cases
- Error cases
- Edge cases
- Permission checks

No feature is considered complete without testing.

---

# Code Review

Before merging:

Verify:

- No TypeScript errors
- No ESLint errors
- No duplicated code
- No unused imports
- No unused variables
- Clean architecture
- Reusable code
- Proper naming

---

# Pull Request Checklist

Every completed task should satisfy:

- Requirements implemented
- Documentation updated
- Code reviewed
- Manual testing completed
- Production-ready

---

# Architecture Changes

Never modify:

- Database Structure
- Folder Structure
- Business Rules
- Project Architecture

Without updating the related documentation.

---

# AI Development Workflow

Codex should always follow this process:

Read AGENTS.md

↓

Read the relevant documentation

↓

Read the task document

↓

Implement only that task

↓

Stop

Never continue to another task automatically.

---

# Communication

If a requirement is unclear:

Stop implementation.

Do not guess.

The documentation should be updated before continuing.

---

# Development Philosophy

MoroccoDrive follows these principles:

- Keep it simple.
- Build only what is needed.
- Avoid premature optimization.
- Avoid premature abstraction.
- Prefer maintainability over clever solutions.
- Prefer readability over complexity.
- Scale only when necessary.

---

# Definition of Success

A task is successful when:

- It solves the requested problem.
- It follows the project architecture.
- It respects all coding rules.
- It passes manual testing.
- Documentation remains accurate.
- The code is production-ready.