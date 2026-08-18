import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);

export const agentExecutionRequestSchema = z.object({
  agentId: nonEmptyString,
  agentRole: nonEmptyString,
  taskId: nonEmptyString,
  task: nonEmptyString,
  acceptanceCriteria: z.array(nonEmptyString).min(1),
  workingDirectory: z.string().trim().min(1),
  context: z.object({
    documentPaths: z.array(nonEmptyString),
    implementationFiles: z.array(nonEmptyString),
    decisions: z.array(nonEmptyString),
    knownRisks: z.array(nonEmptyString),
  }),
});

export const agentExecutionResultSchema = z.object({
  taskId: nonEmptyString,
  agentId: nonEmptyString,
  status: z.enum(["passed", "failed"]),
  exitCode: z.number().int().nullable(),
  signal: z.string().nullable(),
  timedOut: z.boolean(),
  stdout: z.string(),
  stderr: z.string(),
  handoffText: z.string(),
});

export type AgentExecutionRequest = z.infer<typeof agentExecutionRequestSchema>;
export type AgentExecutionResult = z.infer<typeof agentExecutionResultSchema>;

export type AgentExecutor = (
  request: AgentExecutionRequest,
) => Promise<AgentExecutionResult>;