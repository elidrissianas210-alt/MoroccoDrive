import { describe, expect, it } from "vitest";

import {
  createOrchestrationPlan,
  startWorkflowRun,
  executeWorkflow,
  validateOrchestrationPlan,
} from "./index";
import type { AgentExecutionRequest, AgentExecutionResult } from "./executor";

const roles = (request: string) => createOrchestrationPlan(request).executionOrder;

describe("orchestration planner", () => {
  it("selects only the required agents for a frontend-only feature", () => {
    const plan = createOrchestrationPlan("Update the search results page UI");

    expect(plan.executionOrder).toEqual(["planner", "frontend", "testing", "reviewer"]);
    expect(plan.selectedAgents.map((agent) => agent.role)).toEqual([
      "orchestrator", "planner", "frontend", "testing", "reviewer",
    ]);
    expect(plan.validationRequirements.map((item) => item.id)).toContain("accessibility");
    expect(plan.validationRequirements.map((item) => item.id)).not.toContain("database-validation");
  });

  it("selects database work without unnecessary frontend or backend agents", () => {
    const plan = createOrchestrationPlan("Add vehicle persistence schema and migration");

    expect(plan.executionOrder).toEqual(["planner", "database", "testing", "reviewer"]);
    expect(plan.selectedAgents.map((agent) => agent.role)).not.toContain("frontend");
    expect(plan.selectedAgents.map((agent) => agent.role)).not.toContain("backend");
    expect(plan.requiredDocumentation).toContain("docs/03-architecture/database.md");
    expect(plan.validationRequirements.map((item) => item.id)).toContain("database-validation");
  });

  it("builds a full-stack dependency graph", () => {
    const plan = createOrchestrationPlan("Implement agency and vehicle management");

    expect(plan.executionOrder).toEqual([
      "planner", "architect", "database", "backend", "frontend",
      "security", "testing", "reviewer",
    ]);
    const positions = new Map(plan.workflow.tasks.map((task, index) => [task.id, index]));
    for (const task of plan.workflow.tasks) {
      for (const dependency of task.dependencies) {
        expect(positions.get(dependency)).toBeLessThan(positions.get(task.id) ?? -1);
      }
    }
    expect(plan.approvalGates.map((gate) => gate.id)).toEqual([
      "plan-approval", "architecture-approval", "database-approval",
      "security-approval", "merge-approval",
    ]);
  });

  it("selects security and backend for authorization-sensitive work", () => {
    const plan = createOrchestrationPlan("Add role-based authorization for agency owners");

    expect(plan.selectedAgents.map((agent) => agent.role)).toContain("security");
    expect(plan.selectedAgents.map((agent) => agent.role)).toContain("backend");
    expect(plan.selectedAgents.map((agent) => agent.role)).not.toContain("database");
    expect(plan.validationRequirements.map((item) => item.id)).toContain("security-review");
  });

  it("rejects invalid dependency references and ordering", () => {
    const plan = createOrchestrationPlan("Update the search results page UI");
    const invalid = {
      ...plan,
      workflow: {
        ...plan.workflow,
        tasks: plan.workflow.tasks.map((task, index) =>
          index === 1 ? { ...task, dependencies: ["missing-task"] } : task,
        ),
      },
    };

    expect(() => validateOrchestrationPlan(invalid)).toThrow("Task dependency does not exist");
  });

  it("preserves compatibility with executeWorkflow", async () => {
    const plan = createOrchestrationPlan("Update the search results page UI");
    const run = startWorkflowRun({ definition: plan.workflow, agents: plan.selectedAgents });
    const requests: AgentExecutionRequest[] = [];
    const executor = async (request: AgentExecutionRequest): Promise<AgentExecutionResult> => {
      requests.push(request);
      return {
        taskId: request.taskId,
        agentId: request.agentId,
        status: "passed",
        exitCode: 0,
        signal: null,
        timedOut: false,
        stdout: "",
        stderr: "",
        handoffText: JSON.stringify({
          task: request.taskId,
          status: "passed",
          whatWasCompleted: `${request.agentRole} completed the planned task`,
          filesChanged: [],
          decisionsMade: [],
          dependencies: [],
          validationPerformed: ["Planner compatibility test passed"],
          knownIssues: [],
          nextRecommendedAgent: null,
        }),
      };
    };

    const result = await executeWorkflow(run, {
      workingDirectory: "C:\\workspace\\MoroccoDrive",
      documentPaths: plan.requiredDocumentation,
      implementationFiles: [],
      decisions: [],
      knownRisks: [],
    }, executor);

    expect(requests.map((request) => request.agentRole)).toEqual(plan.executionOrder);
    expect(result.run.definition.tasks.every((task) => task.status === "passed")).toBe(true);
    expect(result.run.failures).toHaveLength(0);
  });

  it("accepts a short request string and produces required context", () => {
    const plan = createOrchestrationPlan({
      featureRequest: "Improve account permissions",
      context: {
        documentPaths: ["docs/custom-requirements.md"],
        implementationFiles: ["src/modules/accounts"],
        decisions: ["Keep authorization server-side"],
        knownRisks: ["Existing roles may be incomplete"],
      },
    });

    expect(plan.featureRequest).toBe("Improve account permissions");
    expect(plan.requiredDocumentation).toContain("docs/custom-requirements.md");
    expect(plan.workflow.tasks[0]?.acceptanceCriteria.join(" ")).toContain("docs/custom-requirements.md");
    expect(roles("Improve account permissions")[0]).toBe("planner");
  });
});
