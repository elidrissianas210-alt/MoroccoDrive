# Orchestration Planning Layer

The planning layer is a deterministic, provider-independent boundary at
`MoroccoDrive/src/modules/ai-orchestration/planner.ts`. It accepts a short feature
request and produces an `OrchestrationPlan` containing selected agents, rationales,
an ordered existing `WorkflowDefinition`, required documentation, validations, and
human approval gates.

It uses request signals to select only applicable specialized roles. Orchestrator,
Planner, Testing, and Reviewer are always retained; Architect is selected for
cross-domain or architecture-sensitive scope. Database, Backend, Frontend, and
Security are selected from persistence, server, user-facing, and sensitive-boundary
signals respectively. These rules are intentionally deterministic and are not an
LLM or feature-specific workflow.

The generated workflow is directly compatible with:

```ts
const plan = createOrchestrationPlan(featureRequest);
const run = startWorkflowRun({
  definition: plan.workflow,
  agents: plan.selectedAgents,
});
await executeWorkflow(run, executionContext, executor);
```

The planner validates that every task references a selected role, every dependency
exists and precedes its task, Planner is first, and Reviewer is last. It does not
execute agents, mutate runtime state, bypass human approval, read from external
systems, or implement application features.
