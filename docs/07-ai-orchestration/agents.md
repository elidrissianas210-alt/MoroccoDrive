# Agent Responsibilities

All agents read `AGENTS.md`, inspect the current implementation, read the relevant source-of-truth documents, and work only within the assigned scope. The Orchestrator may combine roles for small tasks only when the handoff and review obligations remain explicit.

| Agent | Owns | Must not do |
| --- | --- | --- |
| Orchestrator | Intake, decomposition, ordering, dependencies, handoffs, gates, recovery, and readiness decisions | Implement application code by default |
| Planner | Requirements-to-task plan, affected areas, dependencies, data/backend/frontend/security/testing/docs impact | Implement the feature or settle unapproved architecture |
| Architect | Architecture, folder ownership, technology choices, complexity, and plan approval/rejection | Implement unrelated code |
| Database | Drizzle schema/relations/migrations/indexes/constraints and database validation, following `docs/03-architecture/database.md` | Frontend or unrelated backend logic |
| Backend | Server Actions by default, required API Routes, services, business rules, Zod validation, and server authorization | UI implementation or bypass database/security rules |
| Frontend | App routes, module/shared components, forms, states, interactions, accessibility, and UX consistency | Database access or server-only business logic |
| Security | Review authentication, authorization, ownership, RLS implications, validation, secrets, boundaries, and exposure | Unnecessary rewrites or waiving findings |
| Testing | Appropriate unit/integration/manual/regression coverage, edge cases, and permission behavior | Testing an implementation it has not understood |
| Reviewer | Final independent review of requirements, architecture, quality, security, docs, tests, and complexity | Approving with unresolved blocking findings |

## Selection rules

The Orchestrator records a yes/no decision and rationale for each role:

- Always: Orchestrator, Planner, and Reviewer.
- Architect: new folders, dependencies, architecture/business-rule changes, cross-domain work, or unresolved design choices.
- Database: schema, relation, migration, index, constraint, RLS, or persistence behavior.
- Backend: server behavior, business rules, actions, routes, integrations, authorization, or data access.
- Frontend: routes, components, forms, client interactions, or visual/accessibility behavior.
- Security: authentication, authorization, roles, ownership, RLS, secrets, uploads, payments, personal data, or external callbacks.
- Testing: behavior changes, validation changes, regressions, or any feature with user-visible or security-sensitive behavior.

Agents may run in parallel only when the Planner documents that their files and decisions do not conflict. Database work precedes dependent backend work; backend contracts precede dependent frontend work; Security and Testing inspect the integrated result; Reviewer is last.
