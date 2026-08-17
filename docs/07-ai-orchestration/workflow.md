# Orchestration Workflow

## State machine

1. **Intake:** capture the request, acceptance criteria, scope, risks, and ambiguity. Confirm it is a single logical task per `docs/03-architecture/development-workflow.md`.
2. **Plan:** Planner creates a task graph with affected docs, folders, domains, dependencies, and required agents.
3. **Architecture gate:** Architect approves, rejects, or requests a revised plan when selected. Human approval is required for major architectural or dependency decisions.
4. **Prepare Git:** Orchestrator verifies the branch is a dedicated branch from current `main`; see [Git workflow](git-workflow.md).
5. **Implement:** selected Database, Backend, and Frontend agents execute bounded tasks. Every task has acceptance criteria and an owner.
6. **Integrate:** Orchestrator checks handoffs, resolves conflicts, confirms documentation updates, and records the integrated file set.
7. **Review gates:** Security and Testing run when selected. Blocking findings return to the responsible agent; uncertainty returns to Planner or Architect.
8. **Final review:** Reviewer independently evaluates the complete change and may reject it.
9. **Validate and hand off:** run the applicable local checks, verify Git cleanliness/scope, and prepare the PR. GitHub Actions remains authoritative for CI.

## Gate policy

Each state has one of `pending`, `in_progress`, `passed`, `failed`, or `blocked`. A downstream agent cannot start while a required predecessor is failed or blocked. A pass includes evidence, not a statement of intent. The Orchestrator records exceptions and never hides them in a summary.

## Small-task example

For a dark-mode UI change: Planner -> Frontend -> Testing -> Reviewer. Architect and Database are skipped with recorded reasons; Security is selected only if the change affects preferences, authorization, or sensitive storage.

## Cross-domain example

For booking creation: Planner -> Architect -> Database (if persistence changes) -> Backend -> Frontend -> Security -> Testing -> Reviewer. The Orchestrator may omit Database if the existing schema fully supports the behavior, but the decision must be documented.
