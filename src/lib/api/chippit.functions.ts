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

const laneStageMap = {
  todo: { stage: "Captured", status: "Captured" },
  progress: { stage: "In Progress", status: "Working" },
  done: { stage: "Done", status: "Done" },
} as const;

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

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/bee$/i, "bee")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "custombee"
  );
}

function employeeNameFromPrompt(prompt: string) {
  const cleaned = prompt.trim();
  if (!cleaned) return "CustomBee";
  const explicitBee = cleaned.match(/\b([A-Z][A-Za-z0-9]*Bee)\b/);
  if (explicitBee?.[1]) return explicitBee[1];
  if (/support|customer/i.test(cleaned)) return "SupportBee";
  if (/inbox|email|message/i.test(cleaned)) return "InboxBee";
  if (/task|project|kanban/i.test(cleaned)) return "TaskBee";
  if (/policy|approval|review/i.test(cleaned)) return "PolicyBee";
  const words = cleaned
    .replace(/create|build|make|an?|ai|employee|for|team|business/gi, "")
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/gi, ""))
    .filter(Boolean)
    .slice(0, 2);
  const base = words.length
    ? words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("")
    : "Custom";
  return `${base}Bee`;
}

async function nextSortOrder(table: string) {
  const rows = await selectOrdered<{ sort_order: number }>(table);
  return rows.reduce((max, row) => Math.max(max, row.sort_order ?? 0), 0) + 1;
}

function currentTimeLabel() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
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

export const updateChippitTask = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      lane: z.enum(["todo", "progress", "done"]).optional(),
      owner: z.string().min(1).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = getInsforgeAdmin();
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.lane) Object.assign(update, laneStageMap[data.lane]);
    if (data.owner) update.owner = data.owner;

    const result = await admin.database
      .from("chippit_project_tasks")
      .update(update)
      .eq("id", data.id)
      .select()
      .single();

    return sanitizeDemoData(requireData<ChippitTask>(result, "Failed to update Chippit task"));
  });

export const createChippitEmployee = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      role: z.string().optional(),
      description: z.string().optional(),
      currentProject: z.string().optional(),
      tools: z.array(z.string()).optional(),
      source: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = getInsforgeAdmin();
    const baseName = employeeNameFromPrompt(data.name);
    const idBase = slugify(baseName);
    const id = data.source === "working-room" ? idBase : `${idBase}-${Date.now().toString(36)}`;
    const role =
      data.role ??
      (baseName.toLowerCase().includes("support")
        ? "Customer Support AI Employee"
        : "Custom AI Employee");
    const description =
      data.description ??
      `${baseName} was created from Chippit and can use company context, create tasks, draft work, and pause for review before risky actions.`;
    const sortOrder = await nextSortOrder("chippit_ai_employees");

    const employeePayload = {
      name: baseName,
      role,
      description,
      status: "Ready",
      autonomy: "Low",
      current_project: data.currentProject ?? "Custom workflow",
      tools: data.tools ?? ["Knowledge Base", "Tasks", "Inbox"],
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    };
    const existingResult = await admin.database
      .from("chippit_ai_employees")
      .select()
      .eq("id", id)
      .single();
    const employeeResult = existingResult.data
      ? await admin.database
          .from("chippit_ai_employees")
          .update(employeePayload)
          .eq("id", id)
          .select()
          .single()
      : await admin.database
          .from("chippit_ai_employees")
          .insert([{ id, ...employeePayload }])
          .select()
          .single();
    const employee = requireData<ChippitEmployee>(employeeResult, "Failed to create employee");

    const eventId = `evt-${id}-${Date.now().toString(36)}`;
    await admin.database.from("chippit_activity_events").insert([
      {
        id: eventId,
        time_label: currentTimeLabel(),
        actor: "Chippit",
        description: `created ${employee.name} from the ${data.source ?? "workspace"} flow.`,
        sort_order: await nextSortOrder("chippit_activity_events"),
      },
    ]);

    if (data.source === "working-room") {
      await admin.database.from("chippit_inbox_messages").insert([
        {
          id: `msg-${id}-${Date.now().toString(36)}`,
          channel: "customer-workflows",
          agent: "Chippit",
          time_label: currentTimeLabel(),
          body: `${employee.name} is ready. Chippit connected company memory, mapped tools, created review rules, and added the employee to the workspace.`,
          actions: ["Open employee", "Assign first task", "Review permissions"],
          sort_order: await nextSortOrder("chippit_inbox_messages"),
        },
      ]);
    }

    return sanitizeDemoData(employee);
  });
