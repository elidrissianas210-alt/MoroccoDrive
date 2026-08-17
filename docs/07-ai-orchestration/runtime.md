# Runtime Foundation

The runtime foundation is a framework-independent TypeScript module at `MoroccoDrive/src/modules/ai-orchestration/`. It represents orchestration state and enforces the smallest deterministic rules needed by a future CLI adapter.

## Boundary

The runtime does not call models, select agents autonomously, access Supabase or Drizzle, create branches, persist state, or execute shell commands. A future Orchestrator adapter supplies the workflow definition, selected agents, handoffs, and validation evidence.

## State model

`WorkflowRun` contains:

- a validated `WorkflowDefinition` with ordered stages and tasks;
- selected `AgentDefinition` records;
- task status and dependency state;
- one latest handoff per task;
- validation results keyed by validation id;
- append-only failure records;
- final review status and findings.

All external input is parsed with Zod schemas. Runtime operations return a new validated state and do not mutate the input run.

## Operations

- `startWorkflowRun` creates an empty run from a validated definition and agent list.
- `updateTaskStatus` enforces the documented state transitions and prevents work from starting before dependencies pass.
- `recordHandoff` validates and stores the standard handoff contract.
- `recordValidation` upserts a validation result by id.
- `recordFailure` records failure evidence without hiding it or retrying automatically.
- `isReadyForReview` reports whether tasks, failures, and validations permit review.
- `setReviewState` prevents approval until all tasks pass and no validation has failed.

The runtime intentionally leaves retry, reassignment, human approval, persistence, and agent execution to the Orchestrator described in [workflow](workflow.md) and [failure handling](failure-handling.md).
