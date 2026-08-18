# Codex CLI Adapter

The Codex adapter is a Node-only boundary at `MoroccoDrive/src/modules/ai-orchestration/adapters/codex-cli.ts`. It translates an already-selected orchestration task into one explicit Codex CLI invocation and returns captured execution evidence. It does not select agents, alter workflow state, parse or approve handoffs, retry failures, or make model calls on its own.

## Request boundary

`CodexExecutionRequest` must include the agent and task identity, acceptance criteria, absolute working directory, and a context packet containing document paths, implementation files, decisions, and known risks. The adapter validates this input with Zod.

Execution policy is explicit in every command:

- executable, defaulting to `codex`;
- `workspace-write` sandbox by default;
- `on-request` approval by default;
- bounded timeout;
- `shell: false` and the supplied working directory.
The current Codex CLI (verified with `codex-cli 0.147.0`) no longer accepts the
legacy `--ask-for-approval <policy>` option. The adapter maps `on-request` to
the supported `--approve-for-me` automatic-review preset. The other supported
policy values are passed through `-c approval_policy="<policy>"`; the legacy
`on-failure` value is mapped to the current `on-request` policy because the
installed CLI documents `on-failure` as deprecated. `never` therefore remains
an explicit non-interactive policy, and no approval option is used that would
weaken the requested sandbox boundary. The adapter never uses
`--dangerously-bypass-approvals-and-sandbox`.

Callers may select stricter or broader policies only through the validated request and must apply the human approval gates in [workflow](workflow.md). `danger-full-access` and `never` approval are intentionally available as explicit choices but are not defaults.

## Result boundary

`executeCodexAgent` returns task/agent identity, passed/failed status, exit code, signal, timeout state, stdout, stderr, and the raw stdout handoff text. The Orchestrator must validate that text against [handoffs](handoffs.md) before calling the runtime’s `recordHandoff`. A zero exit code is execution success only; it is not review approval or feature completion.

## Testability and safety

The command runner is injectable, so tests can verify command construction and result mapping without starting Codex. The default runner uses `spawn` without a shell and never interpolates a command string. The adapter does not add secrets to prompts; environment inheritance is limited to the child process needed by Codex and must be controlled by the caller’s execution environment.

The adapter is intentionally not exported from the browser-facing runtime index. Import it only from a trusted Node/CLI orchestration process.
