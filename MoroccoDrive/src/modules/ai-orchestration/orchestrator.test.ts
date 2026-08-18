import { describe, expect, it, vi } from "vitest";

import {
  executeWorkflow,
  parseHandoffText,
} from "./orchestrator";
import { startWorkflowRun } from "./runtime";
import type { AgentExecutionRequest, AgentExecutionResult } from "./executor";

const context = {
  workingDirectory: "C:\\workspace\\MoroccoDrive",
  documentPaths: ["docs/07-ai-orchestration/runtime.md"],
  implementationFiles: ["src/components/empty-state.tsx"],
  decisions: ["Keep the pilot low risk"],
  knownRisks: ["No real application page integration"],
};

const makeRun = () => startWorkflowRun({
  definition: {
    id: "pilot",
    name: "Pilot workflow",
    stages: ["planning", "implementation", "review", "testing"],
    tasks: [
      {
        id: "planner-task",
        title: "Plan",
        description: "Create the implementation plan.",
        agentRole: "planner",
        stage: "planning",
        status: "pending",
        dependencies: [],
        acceptanceCriteria: ["Return a bounded plan."],
      },
      {
        id: "implementation-task",
        title: "Implement",
        description: "Implement the planned feature.",
        agentRole: "frontend",
        stage: "implementation",
        status: "pending",
        dependencies: ["planner-task"],
        acceptanceCriteria: ["Implement only the approved files."],
      },
      {
        id: "review-task",
        title: "Review",
        description: "Review the integrated change.",
        agentRole: "reviewer",
        stage: "review",
        status: "pending",
        dependencies: ["implementation-task"],
        acceptanceCriteria: ["Report blocking findings."],
      },
      {
        id: "testing-task",
        title: "Test",
        description: "Run the required checks.",
        agentRole: "testing",
        stage: "testing",
        status: "pending",
        dependencies: ["review-task"],
        acceptanceCriteria: ["Return validation evidence."],
      },
    ],
  },
  agents: [
    ["planner", "planner-agent"],
    ["frontend", "frontend-agent"],
    ["reviewer", "reviewer-agent"],
    ["testing", "testing-agent"],
  ].map(([role, id]) => ({
    id,
    role: role as "planner" | "frontend" | "reviewer" | "testing",
    responsibilities: [`${role} responsibilities`],
    canImplement: role !== "reviewer" && role !== "testing",
  })),
});

const executionFor = (request: AgentExecutionRequest): AgentExecutionResult => ({
  taskId: request.taskId,
  agentId: request.agentId,
  status: "passed",
  exitCode: 0,
  signal: null,
  timedOut: false,
  stdout: "handoff",
  stderr: "",
  handoffText: JSON.stringify({
    task: request.taskId,
    status: "passed",
    whatWasCompleted: `${request.agentRole} completed the task`,
    filesChanged: [request.taskId],
    decisionsMade: ["Followed the approved context"],
    dependencies: [],
    validationPerformed: ["Focused validation passed"],
    knownIssues: [],
    nextRecommendedAgent: null,
  }),
});

describe("executeWorkflow", () => {
  it("executes tasks in dependency order and passes handoffs downstream", async () => {
    const requests: AgentExecutionRequest[] = [];
    const executor = vi.fn(async (request: AgentExecutionRequest) => {
      requests.push(request);
      return executionFor(request);
    });

    const original = makeRun();
    const result = await executeWorkflow(original, context, executor);

    expect(requests.map((request) => request.agentRole)).toEqual([
      "planner",
      "frontend",
      "reviewer",
      "testing",
    ]);
    expect(requests[1]?.context.decisions).toEqual(
      expect.arrayContaining([expect.stringContaining("planner-task")]),
    );
    expect(result.run.definition.tasks.every((task) => task.status === "passed")).toBe(true);
    expect(Object.keys(result.run.handoffs)).toHaveLength(4);
    expect(result.run.failures).toHaveLength(0);
    expect(original.definition.tasks.every((task) => task.status === "pending")).toBe(true);
  });

  it("stops downstream execution and records failed agent evidence", async () => {
    const executor = vi.fn(async (request: AgentExecutionRequest) => {
      if (request.taskId === "implementation-task") {
        return {
          ...executionFor(request),
          status: "failed" as const,
          exitCode: 1,
          stderr: "implementation failed",
          handoffText: "",
        };
      }
      return executionFor(request);
    });

    const result = await executeWorkflow(makeRun(), context, executor);

    expect(executor).toHaveBeenCalledTimes(2);
    expect(result.run.definition.tasks[1]?.status).toBe("failed");
    expect(result.run.definition.tasks[2]?.status).toBe("pending");
    expect(result.run.failures[0]).toMatchObject({
      taskId: "implementation-task",
      kind: "implementation",
    });
  });

  it("rejects malformed text handoffs and supports the documented format", () => {
    expect(() => parseHandoffText("not a handoff")).toThrow();
    expect(parseHandoffText([
      "Task: planner-task",
      "Status: passed",
      "What was completed: Planning complete",
      "Files changed:",
      "- docs/plan.md",
      "Decisions made:",
      "- Keep scope bounded",
      "Dependencies:",
      "- none",
      "Validation performed:",
      "- Reviewed requirements",
      "Known issues:",
      "- none",
      "Next recommended agent: frontend",
    ].join("\n"))).toMatchObject({
      task: "planner-task",
      status: "passed",
      filesChanged: ["docs/plan.md"],
      nextRecommendedAgent: "frontend",
    });
  });
});