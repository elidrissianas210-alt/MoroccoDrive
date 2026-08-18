import { z } from "zod";

import {
  agentDefinitionSchema,
  agentRoles,
  taskSchema,
  workflowDefinitionSchema,
  type AgentDefinition,
  type AgentRole,
  type Task,
  type WorkflowDefinition,
} from "./types";

const nonEmptyString = z.string().trim().min(1);

const roleOrder: readonly AgentRole[] = [
  "orchestrator", "planner", "architect", "database", "backend",
  "frontend", "security", "testing", "reviewer",
];
const implementationRoles = ["database", "backend", "frontend"] as const;
type ImplementationRole = (typeof implementationRoles)[number];

const baseDocumentation = [
  "AGENTS.md", "README.md",
  "docs/07-ai-orchestration/overview.md", "docs/07-ai-orchestration/agents.md",
  "docs/07-ai-orchestration/context.md", "docs/07-ai-orchestration/workflow.md",
  "docs/07-ai-orchestration/handoffs.md", "docs/07-ai-orchestration/runtime.md",
  "docs/07-ai-orchestration/validation.md", "docs/07-ai-orchestration/failure-handling.md",
  "docs/07-ai-orchestration/git-workflow.md",
] as const;

const planningContextSchema = z.object({
  documentPaths: z.array(nonEmptyString).default([]),
  implementationFiles: z.array(nonEmptyString).default([]),
  decisions: z.array(nonEmptyString).default([]),
  knownRisks: z.array(nonEmptyString).default([]),
});

export const planningRequestSchema = z.object({
  featureRequest: nonEmptyString,
  context: planningContextSchema.default({ documentPaths: [], implementationFiles: [], decisions: [], knownRisks: [] }),
});
export const agentSelectionSchema = z.object({
  role: z.enum(agentRoles), selected: z.boolean(), rationale: nonEmptyString,
});
export const validationRequirementSchema = z.object({
  id: nonEmptyString, name: nonEmptyString, reason: nonEmptyString, required: z.boolean(),
});
export const approvalGateSchema = z.object({
  id: nonEmptyString, name: nonEmptyString, reason: nonEmptyString,
  beforeRoles: z.array(z.enum(agentRoles)), humanApprovalRequired: z.boolean(),
});
export const orchestrationPlanSchema = z.object({
  featureRequest: nonEmptyString,
  selectedAgents: z.array(agentDefinitionSchema).min(1),
  agentSelection: z.array(agentSelectionSchema).length(agentRoles.length),
  executionOrder: z.array(z.enum(agentRoles)).min(1),
  requiredDocumentation: z.array(nonEmptyString).min(1),
  validationRequirements: z.array(validationRequirementSchema).min(1),
  approvalGates: z.array(approvalGateSchema),
  workflow: workflowDefinitionSchema,
});

export type PlanningRequest = z.infer<typeof planningRequestSchema>;
export type AgentSelection = z.infer<typeof agentSelectionSchema>;
export type ValidationRequirement = z.infer<typeof validationRequirementSchema>;
export type ApprovalGate = z.infer<typeof approvalGateSchema>;
export type OrchestrationPlan = z.infer<typeof orchestrationPlanSchema>;

const hasAny = (text: string, terms: readonly string[]) => terms.some((term) => text.includes(term));
const managementSignal = (request: string, entity: boolean) => hasAny(request, [
  "manage", "management", "crud", "admin",
]) || (entity && hasAny(request, ["create", "edit", "update", "delete"]));
const entitySignal = (request: string) => hasAny(request, [
  "agency", "agencies", "vehicle", "vehicles", "car", "cars", "fleet",
  "booking", "bookings", "customer", "customers", "subscription", "user", "users",
]);

const selectRoles = (featureRequest: string): Set<AgentRole> => {
  const request = featureRequest.trim().toLowerCase();
  const entity = entitySignal(request);
  const management = managementSignal(request, entity);
  const frontend = management || hasAny(request, [
    "frontend", "ui", "ux", "page", "screen", "component", "form", "layout",
    "accessibility", "responsive", "visual",
  ]);
  const backend = management || hasAny(request, [
    "backend", "server", "api", "route", "action", "business rule", "validation",
    "integration", "notification", "auth", "authorization", "permission", "permissions", "ownership", "role",
  ]);
  const database = (management && entity) || hasAny(request, [
    "database", "schema", "table", "column", "migration", "persist", "persistence",
    "relation", "index", "constraint", "drizzle", "rls",
  ]);
  const security = hasAny(request, [
    "auth", "authorization", "permission", "role", "ownership", "rls", "secret",
    "upload", "payment", "personal data", "external callback",
  ]) || (management && entity);
  const architecture = [database, backend, frontend].filter(Boolean).length > 1 ||
    hasAny(request, ["architecture", "dependency", "new folder", "cross-domain", "technology choice"]);
  const selected = new Set<AgentRole>(["orchestrator", "planner", "testing", "reviewer"]);
  if (architecture) selected.add("architect");
  if (database) selected.add("database");
  if (backend) selected.add("backend");
  if (frontend) selected.add("frontend");
  if (security) selected.add("security");
  return selected;
};

const agentDefinitionFor = (role: AgentRole): AgentDefinition => ({
  id: `${role}-agent`,
  role,
  responsibilities: [`Follow the documented ${role} agent responsibilities.`],
  canImplement: ["database", "backend", "frontend"].includes(role),
});

const rationaleFor = (role: AgentRole, selected: boolean, featureRequest: string): string => {
  if (role === "orchestrator") return "Always selected for intake, ordering, gates, and recovery.";
  if (role === "planner") return "Always selected to refine the request into a bounded task graph.";
  if (role === "reviewer") return "Always selected for independent final review.";
  if (role === "testing") return "Always selected for behavior, regression, edge, and permission validation.";
  if (!selected) return `Not selected: no ${role} scope was detected.`;
  const reasons: Record<AgentRole, string> = {
    architect: "Cross-domain or architecture-sensitive scope was detected.",
    database: "Persistence or management of a persisted product entity was detected.",
    backend: "Server, business-rule, data-access, or management scope was detected.",
    frontend: "User-facing screen, interaction, or management UI scope was detected.",
    security: "Authorization-sensitive entity management or explicit security scope was detected.",
    orchestrator: "", planner: "", testing: "", reviewer: "",
  };
  return `${reasons[role]} Feature: ${featureRequest}`;
};

const taskOrderFor = (selected: Set<AgentRole>): AgentRole[] =>
  roleOrder.filter((role) => selected.has(role) && role !== "orchestrator");

const dependenciesFor = (role: AgentRole, selected: Set<AgentRole>): string[] => {
  if (role === "planner") return [];
  if (role === "architect") return ["planner-task"];
  if (implementationRoles.includes(role as ImplementationRole)) {
    const candidates = role === "database" ? ["architect"]
      : role === "backend" ? ["architect", "database"]
        : ["architect", "database", "backend"];
    const dependencies = candidates
      .filter((candidate) => selected.has(candidate as AgentRole));
    return dependencies.length > 0
      ? dependencies.map((candidate) => `${candidate}-task`)
      : ["planner-task"];
  }
  if (role === "security") {
    return taskOrderFor(selected)
      .filter((candidate) => implementationRoles.includes(candidate as ImplementationRole))
      .map((candidate) => `${candidate}-task`);
  }
  if (role === "testing") {
    return taskOrderFor(selected)
      .filter((candidate) => ["architect", ...implementationRoles, "security"].includes(candidate))
      .map((candidate) => `${candidate}-task`);
  }
  return role === "reviewer" ? ["testing-task"] : [];
};

const taskFor = (
  featureRequest: string, role: AgentRole, dependencies: string[],
  context: PlanningRequest["context"],
): Task => {
  const stage = role === "planner" ? "planning"
    : role === "architect" ? "architecture"
      : role === "security" ? "security"
        : role === "testing" ? "testing"
          : role === "reviewer" ? "review" : "implementation";
  const work: Record<AgentRole, string> = {
    orchestrator: "Own workflow state and gates; do not implement application code.",
    planner: "Refine the deterministic scope into a bounded implementation plan.",
    architect: "Review architecture, ownership, and unresolved design decisions.",
    database: "Implement only the approved persistence scope.",
    backend: "Implement only the approved server and business-rule scope.",
    frontend: "Implement only the approved user-facing scope.",
    security: "Review authorization, ownership, validation, secrets, and exposure boundaries.",
    testing: "Validate the integrated work and report evidence.",
    reviewer: "Independently review the complete change.",
  };
  const criteria: Record<AgentRole, string> = {
    orchestrator: "Record the approved task graph and gates.",
    planner: "Return explicit scope, dependencies, risks, and required documentation.",
    architect: "Confirm ownership boundaries and unresolved architecture decisions.",
    database: "Keep persistence changes within approved schema and documentation boundaries.",
    backend: "Validate server behavior, business rules, and inputs within approved scope.",
    frontend: "Validate behavior, accessibility, and responsive states within approved scope.",
    security: "Report blocking security findings and required mitigations.",
    testing: "Return success, failure, edge, permission, and regression evidence.",
    reviewer: "Report unresolved blocking findings or approve the complete change.",
  };
  return taskSchema.parse({
    id: `${role}-task`,
    title: `${role[0].toUpperCase()}${role.slice(1)}: ${featureRequest}`,
    description: `${work[role]} Read the supplied documentation and current implementation. Do not expand scope or bypass human approval gates.`,
    agentRole: role, stage, status: "pending", dependencies,
    acceptanceCriteria: [criteria[role], `Use supplied documents: ${context.documentPaths.join(", ") || "none"}.`],
  });
};

const documentationFor = (selected: Set<AgentRole>, context: PlanningRequest["context"]): string[] => {
  const documents = new Set<string>([...baseDocumentation, ...context.documentPaths]);
  if (selected.has("architect")) {
    documents.add("docs/03-architecture/development-workflow.md");
    documents.add("docs/03-architecture/folder-structure.md");
  }
  if (selected.has("database")) documents.add("docs/03-architecture/database.md");
  if (selected.has("backend")) {
    documents.add("docs/03-architecture/api-conventions.md");
    documents.add("docs/03-architecture/security.md");
  }
  if (selected.has("frontend")) {
    documents.add("docs/02-design/design-system.md");
    documents.add("docs/03-architecture/information-architecture.md");
    documents.add("docs/03-architecture/navigation.md");
  }
  if (selected.has("security")) {
    documents.add("docs/03-architecture/security.md");
    documents.add("docs/03-architecture/user-roles.md");
  }
  return [...documents];
};

const validationsFor = (selected: Set<AgentRole>): ValidationRequirement[] => [
  { id: "type-check", name: "TypeScript type-check", reason: "Required project validation.", required: true },
  { id: "lint", name: "ESLint", reason: "Required project validation.", required: true },
  { id: "tests", name: "Relevant tests and manual checks", reason: "Every feature needs behavior and regression evidence.", required: true },
  { id: "build", name: "Production build", reason: "Required pre-PR validation.", required: true },
  ...(selected.has("frontend") ? [{ id: "accessibility", name: "Accessibility and responsive checks", reason: "Frontend scope requires UI-state validation.", required: true }] : []),
  ...(selected.has("database") ? [{ id: "database-validation", name: "Schema and migration validation", reason: "Persistence scope requires database validation.", required: true }] : []),
  ...(selected.has("security") ? [{ id: "security-review", name: "Security review", reason: "Sensitive boundaries require explicit review.", required: true }] : []),
];

const gatesFor = (selected: Set<AgentRole>): ApprovalGate[] => [
  {
    id: "plan-approval", name: "Human plan approval",
    reason: "The generated graph must be approved before implementation.",
    beforeRoles: ["architect", "database", "backend", "frontend"].filter((role) => selected.has(role as AgentRole)) as AgentRole[],
    humanApprovalRequired: true,
  },
  ...(selected.has("architect") ? [{ id: "architecture-approval", name: "Architecture gate", reason: "Cross-domain or architecture-sensitive work requires human approval.", beforeRoles: ["architect" as AgentRole], humanApprovalRequired: true }] : []),
  ...(selected.has("database") ? [{ id: "database-approval", name: "Database gate", reason: "Persistence work requires human approval.", beforeRoles: ["database" as AgentRole], humanApprovalRequired: true }] : []),
  ...(selected.has("security") ? [{ id: "security-approval", name: "Security gate", reason: "Security findings require resolution or escalation.", beforeRoles: ["security" as AgentRole], humanApprovalRequired: true }] : []),
  { id: "merge-approval", name: "Human merge decision", reason: "Only a human maintainer may merge the reviewed change.", beforeRoles: ["reviewer"], humanApprovalRequired: true },
];

export const validateOrchestrationPlan = (input: unknown): OrchestrationPlan => {
  const plan = orchestrationPlanSchema.parse(input);
  const taskIds = new Set(plan.workflow.tasks.map((task) => task.id));
  const roles = new Set(plan.selectedAgents.map((agent) => agent.role));
  const positions = new Map(plan.workflow.tasks.map((task, index) => [task.id, index]));
  if (!roles.has("orchestrator")) throw new Error("Plan must include the orchestrator agent");
  if (plan.workflow.tasks.length === 0) throw new Error("Plan must contain an executable task");
  for (const task of plan.workflow.tasks) {
    if (!roles.has(task.agentRole)) throw new Error(`Task agent is not selected: ${task.agentRole}`);
    for (const dependency of task.dependencies) {
      if (!taskIds.has(dependency)) throw new Error(`Task dependency does not exist: ${dependency}`);
      if ((positions.get(dependency) ?? -1) >= (positions.get(task.id) ?? -1)) {
        throw new Error(`Task dependency must precede task: ${dependency} -> ${task.id}`);
      }
    }
  }
  if (plan.workflow.tasks[0]?.agentRole !== "planner") throw new Error("Planner must be first");
  if (plan.workflow.tasks.at(-1)?.agentRole !== "reviewer") throw new Error("Reviewer must be last");
  return plan;
};

export const createOrchestrationPlan = (input: unknown, contextInput?: unknown): OrchestrationPlan => {
  const request = planningRequestSchema.parse(typeof input === "string"
    ? { featureRequest: input, context: contextInput ?? {} }
    : input);
  const context = planningContextSchema.parse(request.context ?? {});
  const selected = selectRoles(request.featureRequest);
  const executionOrder = taskOrderFor(selected);
  const tasks = executionOrder.map((role) => taskFor(
    request.featureRequest, role, dependenciesFor(role, selected), context,
  ));
  const slug = request.featureRequest.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "feature";
  return validateOrchestrationPlan({
    featureRequest: request.featureRequest,
    selectedAgents: roleOrder.filter((role) => selected.has(role)).map(agentDefinitionFor),
    agentSelection: roleOrder.map((role) => ({ role, selected: selected.has(role), rationale: rationaleFor(role, selected.has(role), request.featureRequest) })),
    executionOrder, requiredDocumentation: documentationFor(selected, context),
    validationRequirements: validationsFor(selected), approvalGates: gatesFor(selected),
    workflow: {
      id: `planned-${slug}`, name: `Planned workflow: ${request.featureRequest}`,
      stages: [...new Set(tasks.map((task) => task.stage))], tasks,
    } satisfies WorkflowDefinition,
  });
};

export const planWorkflow = createOrchestrationPlan;
