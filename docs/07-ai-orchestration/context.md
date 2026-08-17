# Shared Context and Documentation Matrix

## Mandatory context

Before every task, every agent reads `AGENTS.md`, `README.md`, the feature request/acceptance criteria, and the current implementation in its scope. Agents read documentation rather than infer architecture from code. They must check `git status` and preserve pre-existing changes.

## Required documents by role

| Role | Required project documentation |
| --- | --- |
| Orchestrator / Planner | All `/docs` for intake; especially product scope, `03-architecture/development-workflow.md`, `folder-structure.md`, `security.md`, and `06-devops/*` |
| Architect | `03-architecture/*`, relevant product/design docs, and relevant `06-devops/*` |
| Database | `03-architecture/database.md`, `coding-rules.md`, `security.md`, `folder-structure.md`, and relevant user roles/business rules |
| Backend | `api-conventions.md`, `coding-rules.md`, `security.md`, `database.md`, `user-roles.md`, `folder-structure.md`, and relevant product docs |
| Frontend | `02-design/*` relevant to the UI, `information-architecture.md`, `navigation.md`, `coding-rules.md`, and relevant product docs |
| Security | `security.md`, `user-roles.md`, `api-conventions.md`, `database.md`, `environments.md`, and changed implementation |
| Testing | Relevant feature/product/design docs, `coding-rules.md`, `security.md`, `api-conventions.md`, and all changed implementation |
| Reviewer | `AGENTS.md`, `README.md`, all changed-area docs, this section, and the complete diff |

When a feature touches another domain, add that domain's documentation to the task packet. If documentation is missing or contradictory, stop and route the issue to Planner; do not invent a rule.

## Context packet

The Orchestrator passes a compact packet containing the request, acceptance criteria, selected agents, task graph, relevant document paths, current branch/commit, pre-existing changes, owned files, decisions, and known risks. The packet is the shared source for the run; agents must not depend on hidden prompts or prior chat.
