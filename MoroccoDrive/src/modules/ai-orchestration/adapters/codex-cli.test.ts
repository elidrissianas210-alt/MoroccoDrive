import { EventEmitter } from "node:events";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { spawn } from "node:child_process";
import {
  buildCodexCommand,
  buildCodexPrompt,
  executeCodexAgent,
} from "./codex-cli";
import { startWorkflowRun, updateTaskStatus } from "../runtime";

vi.mock("node:child_process", () => ({ spawn: vi.fn() }));

type FakeChild = EventEmitter & {
  stdout: EventEmitter;
  stderr: EventEmitter;
  kill: ReturnType<typeof vi.fn>;
};

const makeChild = (): FakeChild => {
  const child = new EventEmitter() as FakeChild;
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.kill = vi.fn();
  return child;
};

const request = {
  agentId: "backend-agent",
  agentRole: "backend",
  taskId: "codex-adapter",
  task: "Implement the adapter; preserve $(echo unsafe) and && rm -rf .",
  acceptanceCriteria: ["Pass criteria; $(not-a-command)"],
  workingDirectory: "C:\\workspace\\MoroccoDrive",
  context: {
    documentPaths: ["C:\\workspace\\docs\\07-ai-orchestration\\runtime.md"],
    implementationFiles: ["src/modules/ai-orchestration/adapters/codex-cli.ts"],
    decisions: ["Use an injected runner in tests"],
    knownRisks: ["CLI may be unavailable"],
  },
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("Codex CLI adapter", () => {
  it("constructs a valid request prompt and explicit CLI command", () => {
    const prompt = buildCodexPrompt(request);
    const command = buildCodexCommand(request);

    expect(prompt).toContain(request.task);
    expect(command.command).toBe("codex");
    expect(command.cwd).toBe(request.workingDirectory);
    expect(command.args).toEqual([
      "exec",
      "--json",
      "--sandbox",
      "workspace-write",
      "--ask-for-approval",
      "on-request",
      "-C",
      request.workingDirectory,
      prompt,
    ]);
  });

  it("rejects invalid requests and relative working directories", () => {
    expect(() => buildCodexCommand({})).toThrow();
    expect(() => buildCodexCommand({ ...request, workingDirectory: "relative" })).toThrow(
      "absolute path",
    );
  });

  it("passes shell metacharacters inside the prompt argument", () => {
    const command = buildCodexCommand(request);
    expect(command.args.at(-1)).toContain("$(echo unsafe)");
    expect(command.args.at(-1)).toContain("&& rm -rf .");
    expect(command.args).toHaveLength(9);
  });

  it("maps successful runner output and captures stdout/stderr", async () => {
    const runner = vi.fn().mockResolvedValue({
      exitCode: 0,
      signal: null,
      timedOut: false,
      stdout: "handoff output",
      stderr: "diagnostic output",
    });

    await expect(executeCodexAgent(request, runner)).resolves.toEqual({
      taskId: request.taskId,
      agentId: request.agentId,
      status: "passed",
      exitCode: 0,
      signal: null,
      timedOut: false,
      stdout: "handoff output",
      stderr: "diagnostic output",
      handoffText: "handoff output",
    });
    expect(runner).toHaveBeenCalledWith(expect.objectContaining({ cwd: request.workingDirectory }));
  });

  it("maps non-zero exits and timeouts to failed results", async () => {
    const failed = await executeCodexAgent(request, vi.fn().mockResolvedValue({
      exitCode: 2,
      signal: null,
      timedOut: false,
      stdout: "partial",
      stderr: "failure",
    }));
    const timedOut = await executeCodexAgent(request, vi.fn().mockResolvedValue({
      exitCode: null,
      signal: "SIGTERM",
      timedOut: true,
      stdout: "partial",
      stderr: "timeout",
    }));

    expect(failed.status).toBe("failed");
    expect(timedOut).toMatchObject({ status: "failed", timedOut: true, signal: "SIGTERM" });
  });

  it("enforces shell:false and maps real runner events without launching Codex", async () => {
    const child = makeChild();
    vi.mocked(spawn).mockImplementation(((...args: unknown[]) => {
      const options = args[2] as { shell?: boolean };
      expect(options.shell).toBe(false);
      queueMicrotask(() => {
        child.stdout.emit("data", Buffer.from("json handoff\n"));
        child.stderr.emit("data", Buffer.from("warning\n"));
        child.emit("close", 0, null);
      });
      return child;
    }) as unknown as typeof spawn);

    await expect(executeCodexAgent(request)).resolves.toMatchObject({
      status: "passed",
      stdout: "json handoff\n",
      stderr: "warning\n",
      handoffText: "json handoff",
    });
    expect(spawn).toHaveBeenCalledTimes(1);
  });

  it("kills the child on timeout and reports the timeout", async () => {
    const child = makeChild();
    child.kill.mockImplementation(() => child.emit("close", null, "SIGTERM"));
    vi.mocked(spawn).mockReturnValue(child as never);

    await expect(executeCodexAgent({ ...request, timeoutMs: 5 })).resolves.toMatchObject({
      status: "failed",
      timedOut: true,
      signal: "SIGTERM",
    });
    expect(child.kill).toHaveBeenCalledWith("SIGTERM");
  });
});

describe("orchestration runtime boundary", () => {
  it("starts and advances a run without importing a provider adapter", () => {
    const run = startWorkflowRun({
      definition: {
        id: "provider-independent",
        name: "Provider-independent run",
        stages: ["implementation"],
        tasks: [{
          id: "task-1",
          title: "Task",
          description: "Description",
          agentRole: "backend",
          stage: "implementation",
          status: "pending",
          dependencies: [],
          acceptanceCriteria: ["Criterion"],
        }],
      },
      agents: [{
        id: "backend-agent",
        role: "backend",
        responsibilities: ["Implement backend work"],
        canImplement: true,
      }],
    });

    const started = updateTaskStatus(run, "task-1", "in_progress");
    expect(started.definition.tasks[0]?.status).toBe("in_progress");
  });
});