# AI Orchestration Overview

## Purpose

This section defines the reusable contract for developing MoroccoDrive features with Codex CLI and specialized agents. It governs planning, implementation, review, validation, and Git handoffs; it does not implement an orchestration engine or application features.

The project documentation remains the source of truth. Agents must follow `AGENTS.md` and the relevant documents in `/docs`, especially the architecture, security, development workflow, and DevOps documents referenced by [context](context.md).

## Operating model

```text
Feature request
  -> Orchestrator intake and scope
  -> Planner brief
  -> Architect gate (when architectural risk exists)
  -> Selected implementation agents
  -> Integration checkpoint
  -> Security review (when sensitive boundaries exist)
  -> Testing
  -> Reviewer
  -> Local validation and CI
  -> Pull Request and human merge decision
```

The Orchestrator owns the state machine and handoffs. Agents own only their assigned responsibility. No agent may silently expand scope, skip a required gate, or rely on hidden conversation context.

## Non-goals

- No application code, database schema, Supabase configuration, authentication, UI feature, or agent runtime is created by this documentation.
- This contract does not replace product requirements, architecture decisions, or the GitHub Actions configuration.

## Outputs

Each feature produces a plan, explicit handoffs, validation evidence, review findings, and a Git/PR state that can be audited by a human.
