# Failure Handling and Recovery

## Failure loop

```text
Agent failure -> freeze scope -> capture evidence -> Orchestrator diagnosis
  -> retry bounded task | reassign with context | return to Planner/Architect
  -> human escalation when a gate or authority is required
```

## Classification

- **Transient/tool failure:** retry once after preserving the failure output and checking the environment.
- **Incomplete handoff or misunderstanding:** stop the next agent and return to the author for a corrected handoff.
- **Implementation defect:** assign the smallest corrective task to the responsible agent; run the failed validation again.
- **Contract or architecture conflict:** pause implementation and return to Planner, then Architect when applicable. Update source-of-truth documentation before coding.
- **Security or destructive-data risk:** stop immediately and require Security plus human approval where specified.
- **Repeated failure:** after two unsuccessful attempts on the same cause, reassign to a fresh agent or escalate. Do not allow blind repeated edits.

## Stop conditions

Ask the human before proceeding when requirements remain ambiguous, a major architecture or dependency choice is required, a destructive database migration is proposed, secrets/access are needed, security findings cannot be resolved, the branch contains unexplained changes, or CI/repository permissions prevent a trustworthy result.

## Recovery record

The Orchestrator records the failed task, evidence, suspected cause, attempts, changed files, rollback/containment action, decision, and next owner. Revert or isolate only changes introduced by the failed task; preserve unrelated user work. A failure is closed only after the original acceptance criteria and affected validations pass.

## No-progress rule

An agent must not continue modifying code when the failure cause is unknown. It returns a `failed` or `blocked` handoff with evidence, allowing the Orchestrator to choose diagnosis, reassignment, planning, or escalation.
