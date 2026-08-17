import { z } from "zod";

export const agentRoles = [
  "orchestrator",
  "planner",
  "architect",
  "database",
  "backend",
  "frontend",
  "security",
  "testing",
  "reviewer",
] as const;

export const workflowStages = [
  "intake",
  "planning",
  "architecture",
  "implementation",
  "integration",
  "security",
  "testing",
  "review",
  "validation",
  "ci",
  "pull_request",
] as const;

export const taskStatuses = [
  "pending",
  "in_progress",
  "passed",
  "failed",
  "blocked",
  "needs_revision",
] as const;

export const handoffStatuses = ["passed", "failed", "blocked", "needs_revision"] as const;
export const validationStatuses = ["pending", "passed", "failed", "skipped"] as const;
export const reviewStatuses = ["pending", "approved", "rejected"] as const;
export const failureKinds = [
  "transient_tool",
  "incomplete_handoff",
  "implementation",
  "architecture_conflict",
  "security_risk",
  "repeated_failure",
] as const;

const nonEmptyString = z.string().trim().min(1);

export const agentDefinitionSchema = z.object({
  id: nonEmptyString,
  role: z.enum(agentRoles),
  responsibilities: z.array(nonEmptyString).min(1),
  canImplement: z.boolean(),
});

export const taskSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  description: nonEmptyString,
  agentRole: z.enum(agentRoles),
  stage: z.enum(workflowStages),
  status: z.enum(taskStatuses),
  dependencies: z.array(nonEmptyString),
  acceptanceCriteria: z.array(nonEmptyString).min(1),
});

export const handoffSchema = z.object({
  task: nonEmptyString,
  status: z.enum(handoffStatuses),
  whatWasCompleted: nonEmptyString,
  filesChanged: z.array(nonEmptyString),
  decisionsMade: z.array(nonEmptyString),
  dependencies: z.array(nonEmptyString),
  validationPerformed: z.array(nonEmptyString),
  knownIssues: z.array(nonEmptyString),
  nextRecommendedAgent: z.string().trim().min(1).nullable(),
});

export const validationResultSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  status: z.enum(validationStatuses),
  command: z.string().trim().min(1).nullable(),
  details: nonEmptyString,
});

export const failureRecordSchema = z.object({
  taskId: nonEmptyString,
  kind: z.enum(failureKinds),
  evidence: nonEmptyString,
  suspectedCause: nonEmptyString,
  attempts: z.number().int().positive(),
  containmentAction: nonEmptyString,
  nextOwner: nonEmptyString,
});

export const reviewStateSchema = z.object({
  status: z.enum(reviewStatuses),
  findings: z.array(nonEmptyString),
  reviewer: nonEmptyString.nullable(),
});

export const workflowDefinitionSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  stages: z.array(z.enum(workflowStages)).min(1),
  tasks: z.array(taskSchema),
});

export const workflowRunSchema = z.object({
  id: nonEmptyString,
  definition: workflowDefinitionSchema,
  agents: z.array(agentDefinitionSchema),
  handoffs: z.record(z.string(), handoffSchema),
  validations: z.array(validationResultSchema),
  failures: z.array(failureRecordSchema),
  review: reviewStateSchema,
});

export type AgentRole = (typeof agentRoles)[number];
export type WorkflowStage = (typeof workflowStages)[number];
export type TaskStatus = (typeof taskStatuses)[number];
export type HandoffStatus = (typeof handoffStatuses)[number];
export type ValidationStatus = (typeof validationStatuses)[number];
export type ReviewStatus = (typeof reviewStatuses)[number];
export type FailureKind = (typeof failureKinds)[number];
export type AgentDefinition = z.infer<typeof agentDefinitionSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Handoff = z.infer<typeof handoffSchema>;
export type ValidationResult = z.infer<typeof validationResultSchema>;
export type FailureRecord = z.infer<typeof failureRecordSchema>;
export type ReviewState = z.infer<typeof reviewStateSchema>;
export type WorkflowDefinition = z.infer<typeof workflowDefinitionSchema>;
export type WorkflowRun = z.infer<typeof workflowRunSchema>;
