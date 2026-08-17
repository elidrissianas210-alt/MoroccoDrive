# Agent Handoff Protocol

Every agent returns a self-contained handoff in this exact order:

```text
Task: <assigned scope and acceptance criteria>
Status: <passed | failed | blocked | needs-revision>
What was completed: <observable result>
Files changed: <repo-relative paths, or none>
Decisions made: <decisions and documentation references>
Dependencies: <required prior work or downstream contracts>
Validation performed: <commands/checks and results>
Known issues: <remaining risks, failures, or none>
Next recommended agent: <role and reason, or none>
```

The handoff must include exact file paths, schema/API/UI contracts, and unresolved assumptions. “Done” is not evidence. A failed handoff must identify the failing command or acceptance criterion and must not claim readiness.

## Handoff acceptance

The Orchestrator verifies that the assigned files are in scope, the status is supported by evidence, and dependencies are satisfied. The receiving agent reads the handoff and relevant files, then acknowledges any missing information before changing code. If the handoff is incomplete, work returns to its author for clarification.

## Conflict control

Agents do not overwrite valid changes from another agent. Overlapping ownership is resolved by the Orchestrator before edits. If a conflict changes architecture, business rules, schema, or public contracts, return to the Planner/Architect gate and update documentation first.
