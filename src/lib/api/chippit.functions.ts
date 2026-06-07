import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getInsforgeAdmin } from "../insforge.server";

export type ChippitEmployee = {
  id: string;
  name: string;
  role: string;
  description: string;
  status: string;
  autonomy: string;
  current_project: string;
  tools: string[];
  sort_order: number;
};

export type ChippitProject = {
  id: string;
  name: string;
  status: string;
  deadline: string;
  team: string[];
  blockers: number;
  approvals: number;
  summary: string;
  next_action: string;
  sort_order: number;
};

export type ChippitTask = {
  id: string;
  project_id: string;
  stage: string;
  title: string;
  owner: string;
  source: string;
  due_label: string;
  risk: string;
  confidence: number | null;
  status: string;
  requires_approval: boolean;
  reason: string | null;
  sort_order: number;
};

export type ChippitApproval = {
  id: string;
  title: string;
  agent: string;
  risk: string;
  status: string;
  subject: string;
  draft: string[];
  revised_draft: string[];
  context_sources: string[];
  revision_prompt: string;
  sort_order: number;
};

export type ChippitInboxMessage = {
  id: string;
  channel: string;
  agent: string;
  time_label: string;
  body: string;
  actions: string[];
  sort_order: number;
};

export type ChippitActivityEvent = {
  id: string;
  time_label: string;
  actor: string;
  description: string;
  sort_order: number;
};

export type ChippitKnowledgeSource = {
  id: string;
  source: string;
  source_type: string;
  used_by: string[];
  status: string;
  extracted_fact: string | null;
  sort_order: number;
};

export type ChippitCallLine = {
  id: string;
  speaker: string;
  line_text: string;
  tick: number;
  sort_order: number;
};

export type ChippitCallDetection = {
  id: string;
  label: string;
  value: string;
  tick: number;
  sort_order: number;
};

export type ChippitCallAgentAction = {
  id: string;
  agent: string;
  body: string;
  tick: number;
  sort_order: number;
};

function requireData<T>(result: { data?: T | null; error?: unknown }, label: string): T {
  if (result.error) {
    throw new Error(`${label}: ${JSON.stringify(result.error)}`);
  }
  return (result.data ?? []) as T;
}

async function selectOrdered<T>(table: string) {
  const admin = getInsforgeAdmin();
  const result = await admin.database.from(table).select().order("sort_order", { ascending: true });
  return requireData<T[]>(result, `Failed to load ${table}`);
}

const demoCopyReplacements: Array<[RegExp, string]> = [
  [new RegExp(["Book", "shop", " Santa ", "Cruz"].join(""), "g"), "Your business"],
  [new RegExp(["Book", "shop"].join(""), "g"), "Workspace"],
  [new RegExp(["book", "shop"].join(""), "g"), "workspace"],
  [new RegExp(["book", "store"].join(""), "g"), "business"],
  [new RegExp(["book", " club"].join(""), "g"), "customer group"],
  [new RegExp(["used", "-book"].join(""), "g"), "policy"],
  [new RegExp(["used", " books"].join(""), "g"), "policy questions"],
  [new RegExp(["used", " book"].join(""), "g"), "policy question"],
  [/event availability/g, "schedule availability"],
  [/event capacity/g, "schedule capacity"],
  [/event/g, "customer request"],
  [/online order pickup/g, "customer follow-up"],
  [/online pickup/g, "customer follow-up"],
  [/pickup/g, "follow-up"],
  [/drop-off/g, "handoff"],
  [new RegExp(["Front", "Desk", "Bee"].join(""), "g"), "IntakeBee"],
  [new RegExp(["Event", "Bee"].join(""), "g"), "ScheduleBee"],
  [new RegExp(["Order", "Bee"].join(""), "g"), "FollowUpBee"],
  [new RegExp(["Used", "Books", "Bee"].join(""), "g"), "PolicyBee"],
  [/frontdeskbee/g, "intakebee"],
  [/eventbee/g, "schedulebee"],
  [/orderbee/g, "followupbee"],
  [new RegExp(["used", "books", "bee"].join(""), "g"), "policybee"],
];

function sanitizeDemoCopy(value: string) {
  return demoCopyReplacements.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  );
}

function sanitizeDemoData<T>(value: T): T {
  if (typeof value === "string") return sanitizeDemoCopy(value) as T;
  if (Array.isArray(value)) return value.map((item) => sanitizeDemoData(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        key === "id" || key.endsWith("_id") ? entry : sanitizeDemoData(entry),
      ]),
    ) as T;
  }
  return value;
}

export const getChippitDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const [employees, projects, approvals, tasks, inboxMessages, activityEvents, knowledgeSources] =
    await Promise.all([
      selectOrdered<ChippitEmployee>("chippit_ai_employees"),
      selectOrdered<ChippitProject>("chippit_projects"),
      selectOrdered<ChippitApproval>("chippit_approvals"),
      selectOrdered<ChippitTask>("chippit_project_tasks"),
      selectOrdered<ChippitInboxMessage>("chippit_inbox_messages"),
      selectOrdered<ChippitActivityEvent>("chippit_activity_events"),
      selectOrdered<ChippitKnowledgeSource>("chippit_knowledge_sources"),
    ]);

  return sanitizeDemoData({
    employees,
    projects,
    approvals,
    tasks,
    inboxMessages,
    activityEvents,
    knowledgeSources,
  });
});

export const getChippitProjects = createServerFn({ method: "GET" }).handler(async () => {
  const [projects, tasks] = await Promise.all([
    selectOrdered<ChippitProject>("chippit_projects"),
    selectOrdered<ChippitTask>("chippit_project_tasks"),
  ]);

  return sanitizeDemoData({ projects, tasks });
});

export const getChippitProject = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const admin = getInsforgeAdmin();
    const projectResult = await admin.database
      .from("chippit_projects")
      .select()
      .eq("id", data.id)
      .single();
    const tasksResult = await admin.database
      .from("chippit_project_tasks")
      .select()
      .eq("project_id", data.id)
      .order("sort_order", { ascending: true });
    const knowledgeSources = await selectOrdered<ChippitKnowledgeSource>(
      "chippit_knowledge_sources",
    );

    return sanitizeDemoData({
      project: requireData<ChippitProject>(projectResult, "Failed to load Chippit project"),
      tasks: requireData<ChippitTask[]>(tasksResult, "Failed to load Chippit project tasks"),
      knowledgeSources,
    });
  });

export const getChippitCall = createServerFn({ method: "GET" }).handler(async () => {
  const [lines, detections, agentActions, tasks] = await Promise.all([
    selectOrdered<ChippitCallLine>("chippit_call_lines"),
    selectOrdered<ChippitCallDetection>("chippit_call_detections"),
    selectOrdered<ChippitCallAgentAction>("chippit_call_agent_actions"),
    selectOrdered<ChippitTask>("chippit_project_tasks"),
  ]);

  return sanitizeDemoData({
    lines,
    detections,
    agentActions,
    actions: tasks.filter(
      (task) => task.project_id === "customer-follow-up" || task.project_id.includes("call"),
    ),
  });
});

export const getChippitApprovals = createServerFn({ method: "GET" }).handler(async () => {
  return sanitizeDemoData({
    approvals: await selectOrdered<ChippitApproval>("chippit_approvals"),
  });
});

export const approveChippitApproval = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const admin = getInsforgeAdmin();
    const result = await admin.database
      .from("chippit_approvals")
      .update({ status: "Auto-approved", updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .select()
      .single();

    return sanitizeDemoData(
      requireData<ChippitApproval>(result, "Failed to approve Chippit approval"),
    );
  });
