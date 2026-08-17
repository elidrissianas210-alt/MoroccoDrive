import {
  failureRecordSchema,
  handoffSchema,
  reviewStateSchema,
  taskStatuses,
  validationResultSchema,
  workflowDefinitionSchema,
  workflowRunSchema,
  type FailureRecord,
  type Handoff,
  type ReviewState,
  type TaskStatus,
  type ValidationResult,
  type WorkflowDefinition,
  type WorkflowRun,
} from "./types";

const transitions: Record<TaskStatus, readonly TaskStatus[]> = {
  pending: ["in_progress", "blocked"],
  in_progress: ["passed", "failed", "blocked", "needs_revision"],
  passed: ["needs_revision"],
  failed: ["in_progress", "blocked"],
  blocked: ["in_progress"],
  needs_revision: ["in_progress", "blocked"],
};

const findTask = (run: WorkflowRun, taskId: string) => {
  const task = run.definition.tasks.find((candidate) => candidate.id === taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }
  return task;
};

const assertDependenciesPassed = (run: WorkflowRun, taskId: string) => {
  const task = findTask(run, taskId);
  const incomplete = task.dependencies.filter((dependencyId) => {
    const dependency = findTask(run, dependencyId);
    return dependency.status !== "passed";
  });

  if (incomplete.length > 0) {
    throw new Error(`Task dependencies are incomplete: ${incomplete.join(", ")}`);
  }
};

export const createWorkflowRun = (input: unknown): WorkflowRun => {
  return workflowRunSchema.parse(input);
};

export const updateTaskStatus = (
  run: WorkflowRun,
  taskId: string,
  status: TaskStatus,
): WorkflowRun => {
  const parsedStatus = taskStatuses.find((candidate) => candidate === status);
  if (!parsedStatus) {
    throw new Error(`Invalid task status: ${status}`);
  }

  const task = findTask(run, taskId);
  if (!transitions[task.status].includes(parsedStatus)) {
    throw new Error(`Invalid task transition: ${task.status} -> ${parsedStatus}`);
  }

  if (parsedStatus === "in_progress" && task.dependencies.length > 0) {
    assertDependenciesPassed(run, taskId);
  }

  return workflowRunSchema.parse({
    ...run,
    definition: {
      ...run.definition,
      tasks: run.definition.tasks.map((candidate) =>
        candidate.id === taskId ? { ...candidate, status: parsedStatus } : candidate,
      ),
    },
  });
};

export const recordHandoff = (run: WorkflowRun, taskId: string, input: unknown): WorkflowRun => {
  findTask(run, taskId);
  const handoff = handoffSchema.parse(input);
  return workflowRunSchema.parse({
    ...run,
    handoffs: { ...run.handoffs, [taskId]: handoff },
  });
};

export const recordValidation = (run: WorkflowRun, input: unknown): WorkflowRun => {
  const validation = validationResultSchema.parse(input);
  const validations = run.validations.filter((candidate) => candidate.id !== validation.id);
  return workflowRunSchema.parse({ ...run, validations: [...validations, validation] });
};

export const recordFailure = (run: WorkflowRun, input: unknown): WorkflowRun => {
  const failure = failureRecordSchema.parse(input);
  findTask(run, failure.taskId);
  return workflowRunSchema.parse({ ...run, failures: [...run.failures, failure] });
};

export const setReviewState = (run: WorkflowRun, input: unknown): WorkflowRun => {
  const review = reviewStateSchema.parse(input);
  if (review.status === "approved") {
    const incompleteTasks = run.definition.tasks.filter((task) => task.status !== "passed");
    if (incompleteTasks.length > 0) {
      throw new Error("Review cannot be approved while tasks remain incomplete");
    }
    const failedValidations = run.validations.filter((validation) => validation.status === "failed");
    if (failedValidations.length > 0) {
      throw new Error("Review cannot be approved while validation has failed");
    }
  }

  return workflowRunSchema.parse({ ...run, review });
};

export const isReadyForReview = (run: WorkflowRun): boolean => {
  return (
    run.definition.tasks.every((task) => task.status === "passed") &&
    run.failures.length === 0 &&
    run.validations.every((validation) => validation.status !== "failed")
  );
};

export type RuntimeInput = {
  definition: WorkflowDefinition;
  agents: WorkflowRun["agents"];
};

export const startWorkflowRun = (input: RuntimeInput): WorkflowRun => {
  const definition = workflowDefinitionSchema.parse(input.definition);
  return workflowRunSchema.parse({
    id: `${definition.id}-run`,
    definition,
    agents: input.agents,
    handoffs: {},
    validations: [],
    failures: [],
    review: { status: "pending", findings: [], reviewer: null },
  });
};
