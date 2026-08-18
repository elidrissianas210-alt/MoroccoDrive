import { z } from "zod";

import { recordFailure, recordHandoff, updateTaskStatus } from "./runtime";
import {
  handoffSchema,
  type Handoff,
  type WorkflowRun,
} from "./types";
import {
  agentExecutionRequestSchema,
  agentExecutionResultSchema,
  type AgentExecutionResult,
  type AgentExecutor,
} from "./executor";

const executionContextSchema = z.object({
  workingDirectory: z.string().trim().min(1),
  documentPaths: z.array(z.string().trim().min(1)),
  implementationFiles: z.array(z.string().trim().min(1)),
  decisions: z.array(z.string().trim().min(1)),
  knownRisks: z.array(z.string().trim().min(1)),
});

const HANDOFF_FIELDS = [
  "Task",
  "Status",
  "What was completed",
  "Files changed",
  "Decisions made",
  "Dependencies",
  "Validation performed",
  "Known issues",
  "Next recommended agent",
] as const;

const LIST_FIELDS = new Set([
  "Files changed",
  "Decisions made",
  "Dependencies",
  "Validation performed",
  "Known issues",
]);

type HandoffField = (typeof HANDOFF_FIELDS)[number];

export type ExecutionContext = z.infer<typeof executionContextSchema>;

export type WorkflowExecutionResult = {
  run: WorkflowRun;
  executions: AgentExecutionResult[];
};

export const parseHandoffText = (text: string): Handoff => {
  try {
    return handoffSchema.parse(JSON.parse(text) as unknown);
  } catch {
    const fields = new Map<HandoffField, string[]>();
    let currentField: HandoffField | null = null;

    for (const line of text.split(/\r?\n/)) {
      const match = /^(Task|Status|What was completed|Files changed|Decisions made|Dependencies|Validation performed|Known issues|Next recommended agent):\s*(.*)$/.exec(line.trim());
      if (match && HANDOFF_FIELDS.includes(match[1] as HandoffField)) {
        currentField = match[1] as HandoffField;
        fields.set(currentField, match[2] ? [match[2].trim()] : []);
        continue;
      }
      if (currentField && LIST_FIELDS.has(currentField) && line.trim().startsWith("-")) {
        fields.get(currentField)?.push(line.trim().slice(1).trim());
      }
    }

    const first = (field: HandoffField): string => fields.get(field)?.[0] ?? "";
    const list = (field: HandoffField): string[] => (fields.get(field) ?? []).filter(Boolean);
    const nextAgent = first("Next recommended agent");

    return handoffSchema.parse({
      task: first("Task"),
      status: first("Status"),
      whatWasCompleted: first("What was completed"),
      filesChanged: list("Files changed"),
      decisionsMade: list("Decisions made"),
      dependencies: list("Dependencies"),
      validationPerformed: list("Validation performed"),
      knownIssues: list("Known issues"),
      nextRecommendedAgent: ["", "none", "null"].includes(nextAgent.toLowerCase())
        ? null
        : nextAgent,
    });
  }
};

const handoffSummary = (taskId: string, handoff: Handoff): string => {
  return [
    `Handoff for ${taskId}: ${handoff.whatWasCompleted}`,
    `Files changed: ${handoff.filesChanged.join(", ") || "none"}`,
    `Known issues: ${handoff.knownIssues.join(", ") || "none"}`,
  ].join(" | ");
};

const failureEvidence = (execution: AgentExecutionResult): string => {
  return [
    `Agent execution failed with status ${execution.status}.`,
    `Exit code: ${execution.exitCode ?? "none"}.`,
    `Signal: ${execution.signal ?? "none"}.`,
    `Timed out: ${execution.timedOut}.`,
    execution.stderr ? `Stderr: ${execution.stderr}` : "Stderr: none.",
  ].join(" ");
};

const recordExecutionFailure = (
  run: WorkflowRun,
  taskId: string,
  kind: "implementation" | "incomplete_handoff",
  evidence: string,
): WorkflowRun => {
  const failed = updateTaskStatus(run, taskId, "failed");
  return recordFailure(failed, {
    taskId,
    kind,
    evidence,
    suspectedCause: kind === "incomplete_handoff"
      ? "The agent returned output that did not match the required handoff contract."
      : "The agent process or handoff did not complete successfully.",
    attempts: 1,
    containmentAction: "Stopped the workflow before executing downstream tasks.",
    nextOwner: "orchestrator",
  });
};

export const executeWorkflow = async (
  runInput: WorkflowRun,
  contextInput: unknown,
  executor: AgentExecutor,
): Promise<WorkflowExecutionResult> => {
  let run = runInput;
  const context = executionContextSchema.parse(contextInput);
  const executions: AgentExecutionResult[] = [];

  for (const task of run.definition.tasks) {
    if (task.status === "passed") {
      continue;
    }
    if (task.status !== "pending") {
      throw new Error(`Workflow task is not executable: ${task.id} (${task.status})`);
    }

    const agent = run.agents.find((candidate) => candidate.role === task.agentRole);
    if (!agent) {
      throw new Error(`No agent configured for role: ${task.agentRole}`);
    }

    run = updateTaskStatus(run, task.id, "in_progress");
    const priorHandoffs = (Object.entries(run.handoffs) as [string, Handoff][]).map(
      ([taskId, handoff]) => handoffSummary(taskId, handoff),
    );
    const request = agentExecutionRequestSchema.parse({
      agentId: agent.id,
      agentRole: agent.role,
      taskId: task.id,
      task: task.description,
      acceptanceCriteria: task.acceptanceCriteria,
      workingDirectory: context.workingDirectory,
      context: {
        documentPaths: context.documentPaths,
        implementationFiles: context.implementationFiles,
        decisions: [...context.decisions, ...priorHandoffs],
        knownRisks: context.knownRisks,
      },
    });
    const execution = agentExecutionResultSchema.parse(await executor(request));
    executions.push(execution);

    if (execution.status === "failed") {
      run = recordExecutionFailure(run, task.id, "implementation", failureEvidence(execution));
      break;
    }

    let handoff: Handoff;
    try {
      handoff = parseHandoffText(execution.handoffText);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown handoff parsing error";
      run = recordExecutionFailure(
        run,
        task.id,
        "incomplete_handoff",
        `Invalid handoff output: ${message}`,
      );
      break;
    }

    if (handoff.status !== "passed") {
      run = recordExecutionFailure(
        run,
        task.id,
        "implementation",
        `Agent handoff status was ${handoff.status}.`,
      );
      break;
    }

    run = recordHandoff(run, task.id, handoff);
    run = updateTaskStatus(run, task.id, "passed");
  }

  return { run, executions };
};