import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { isAbsolute } from "node:path";
import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);

export const codexSandboxModes = ["read-only", "workspace-write", "danger-full-access"] as const;
export const codexApprovalPolicies = ["untrusted", "on-failure", "on-request", "never"] as const;

export const codexExecutionRequestSchema = z.object({
  agentId: nonEmptyString,
  agentRole: nonEmptyString,
  taskId: nonEmptyString,
  task: nonEmptyString,
  acceptanceCriteria: z.array(nonEmptyString).min(1),
  workingDirectory: nonEmptyString,
  context: z.object({
    documentPaths: z.array(nonEmptyString),
    implementationFiles: z.array(nonEmptyString),
    decisions: z.array(nonEmptyString),
    knownRisks: z.array(nonEmptyString),
  }),
  executable: nonEmptyString.default("codex"),
  timeoutMs: z.number().int().positive().default(900_000),
  sandbox: z.enum(codexSandboxModes).default("workspace-write"),
  approvalPolicy: z.enum(codexApprovalPolicies).default("on-request"),
});

export const codexExecutionResultSchema = z.object({
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

export type CodexExecutionRequest = z.infer<typeof codexExecutionRequestSchema>;
export type CodexExecutionResult = z.infer<typeof codexExecutionResultSchema>;

export type CodexCommand = {
  command: string;
  args: string[];
  cwd: string;
  timeoutMs: number;
};

type CommandOutcome = {
  exitCode: number | null;
  signal: string | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
};

export type CodexCommandRunner = (command: CodexCommand) => Promise<CommandOutcome>;

const formatList = (items: string[]): string => {
  return items.length === 0 ? "- none" : items.map((item) => `- ${item}`).join("\n");
};

export const buildCodexPrompt = (requestInput: unknown): string => {
  const request = codexExecutionRequestSchema.parse(requestInput);

  return [
    `You are the ${request.agentRole} agent for task ${request.taskId}.`,
    "Execute only the assigned task in the provided working directory.",
    "Read AGENTS.md and the listed source-of-truth documents before changing anything.",
    "Do not infer undocumented architecture, expand scope, modify unrelated files, or call external LLMs.",
    "Return the required handoff fields exactly, including validation evidence and known issues.",
    "",
    `Task: ${request.task}`,
    "Acceptance criteria:",
    formatList(request.acceptanceCriteria),
    "",
    "Required documentation:",
    formatList(request.context.documentPaths),
    "",
    "Implementation files in scope:",
    formatList(request.context.implementationFiles),
    "",
    "Prior decisions:",
    formatList(request.context.decisions),
    "",
    "Known risks:",
    formatList(request.context.knownRisks),
    "",
    "Handoff format:",
    "Task:",
    "Status: passed | failed | blocked | needs-revision",
    "What was completed:",
    "Files changed:",
    "Decisions made:",
    "Dependencies:",
    "Validation performed:",
    "Known issues:",
    "Next recommended agent:",
  ].join("\n");
};

export const buildCodexCommand = (requestInput: unknown): CodexCommand => {
  const request = codexExecutionRequestSchema.parse(requestInput);
  if (!isAbsolute(request.workingDirectory)) {
    throw new Error("Codex workingDirectory must be an absolute path");
  }

  return {
    command: request.executable,
    args: [
      "exec",
      "--json",
      "--sandbox",
      request.sandbox,
      "--ask-for-approval",
      request.approvalPolicy,
      "-C",
      request.workingDirectory,
      buildCodexPrompt(request),
    ],
    cwd: request.workingDirectory,
    timeoutMs: request.timeoutMs,
  };
};

const runCodexCommand: CodexCommandRunner = (command) => {
  return new Promise((resolve, reject) => {
    let child: ChildProcessWithoutNullStreams;
    try {
      child = spawn(command.command, command.args, {
        cwd: command.cwd,
        env: process.env,
        shell: false,
        windowsHide: true,
      });
    } catch (error) {
      reject(error);
      return;
    }

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, command.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.once("error", reject);
    child.once("close", (exitCode, signal) => {
      clearTimeout(timeout);
      resolve({
        exitCode,
        signal,
        timedOut,
        stdout,
        stderr,
      });
    });
  });
};

export const executeCodexAgent = async (
  requestInput: unknown,
  runner: CodexCommandRunner = runCodexCommand,
): Promise<CodexExecutionResult> => {
  const request = codexExecutionRequestSchema.parse(requestInput);
  const outcome = await runner(buildCodexCommand(request));
  return codexExecutionResultSchema.parse({
    taskId: request.taskId,
    agentId: request.agentId,
    status: outcome.exitCode === 0 && !outcome.timedOut ? "passed" : "failed",
    exitCode: outcome.exitCode,
    signal: outcome.signal,
    timedOut: outcome.timedOut,
    stdout: outcome.stdout,
    stderr: outcome.stderr,
    handoffText: outcome.stdout.trim(),
  });
};
