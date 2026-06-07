import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, Play, Send, Sparkles, Wrench } from "lucide-react";
import { getChippitDashboard, type ChippitEmployee } from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/employees/$employeeId")({
  loader: () => getChippitDashboard(),
  component: EmployeeWorkScreen,
});

type StreamItem = {
  label: "Context" | "Tool" | "Task" | "Draft" | "Approval" | "Done";
  body: string;
  time: string;
};

const fallbackEmployee: ChippitEmployee = {
  id: "custombee",
  name: "CustomBee",
  role: "Custom AI Employee",
  description: "Builds a focused workflow from your business context and connected tools.",
  status: "Working",
  autonomy: "Medium",
  current_project: "Custom workflow build",
  tools: ["Knowledge Base", "Gmail", "Calendar", "Tasks"],
  sort_order: 99,
};

const supportBeeEmployee: ChippitEmployee = {
  id: "supportbee",
  name: "SupportBee",
  role: "Customer Support AI Employee",
  description:
    "Handles customer support questions using company context, drafts replies, creates support tasks, and escalates uncertain answers.",
  status: "Ready",
  autonomy: "Medium",
  current_project: "Testing support response for order timing and policy follow-up",
  tools: ["Knowledge Base", "Gmail", "Slack", "Calls", "Tasks", "Approval Inbox"],
  sort_order: 0,
};

const workByRole: Record<string, { task: string; summary: string; output: string }> = {
  intake: {
    task: "Building an intake triage workflow",
    summary:
      "This employee is reading customer messages, classifying intent, and routing each request to the right workflow.",
    output: "A triage workspace with routing rules, labels, and escalation notes.",
  },
  schedule: {
    task: "Building a scheduling assistant",
    summary:
      "This employee is mapping availability, calendar read access, schedule-change rules, and safe handoff paths.",
    output: "A scheduling workflow with availability checks and confirmation drafts.",
  },
  follow: {
    task: "Building a follow-up system",
    summary:
      "This employee is drafting customer follow-ups, next steps, and reminders while keeping external sends gated.",
    output: "A follow-up queue with drafted replies and task ownership.",
  },
  policy: {
    task: "Building a policy review lane",
    summary:
      "This employee is checking customer-facing work against business rules before promises or sensitive replies.",
    output: "A review console with policy checks, risk notes, and safe response drafts.",
  },
  ops: {
    task: "Building an operations task runner",
    summary:
      "This employee is turning internal messages into tasks, owners, due dates, and status updates.",
    output: "A task board with owners, due labels, and operating notes.",
  },
  manager: {
    task: "Building a manager workroom",
    summary:
      "This employee is coordinating the AI team, summarizing progress, and surfacing anything that needs attention.",
    output: "A manager brief with active work, completed tasks, and review requests.",
  },
  support: {
    task: "Testing support response for order timing and policy follow-up",
    summary:
      "SupportBee is using company context to answer customer support questions, draft replies, create follow-up tasks, and escalate uncertain answers for review.",
    output: "A customer support workflow with drafted response, review item, and support tasks.",
  },
};

const baseStream: StreamItem[] = [
  { time: "10:14", label: "Context", body: "Read workspace context and active customer workflows" },
  {
    time: "10:15",
    label: "Tool",
    body: "Checked Knowledge Base, Gmail, Calendar, and Tasks access",
  },
  { time: "10:15", label: "Task", body: "Created the first workflow outline and owner map" },
  { time: "10:16", label: "Draft", body: "Wrote the first customer-safe response pattern" },
  { time: "10:17", label: "Approval", body: "Added review rules for customer-facing actions" },
  { time: "10:18", label: "Done", body: "Generated the first working preview" },
];

const labelTone: Record<StreamItem["label"], string> = {
  Context: "bg-secondary text-primary",
  Tool: "bg-accent/25 text-primary",
  Task: "bg-secondary text-foreground",
  Draft: "bg-primary/10 text-primary",
  Approval: "bg-accent/30 text-primary",
  Done: "bg-primary text-primary-foreground",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getWorkProfile(employee: ChippitEmployee) {
  const key = `${employee.id} ${employee.name} ${employee.role}`.toLowerCase();
  if (key.includes("support")) return workByRole.support;
  if (key.includes("intake")) return workByRole.intake;
  if (key.includes("schedule")) return workByRole.schedule;
  if (key.includes("follow")) return workByRole.follow;
  if (key.includes("policy")) return workByRole.policy;
  if (key.includes("ops")) return workByRole.ops;
  if (key.includes("manager")) return workByRole.manager;
  return {
    task: employee.current_project || "Building a focused business workflow",
    summary: employee.description,
    output: "A working preview with tasks, tools, and safe next steps.",
  };
}

function EmployeeWorkScreen() {
  const { employeeId } = Route.useParams();
  const { employees } = Route.useLoaderData();
  const employee =
    employees.find((item) => item.id === employeeId || slugify(item.name) === employeeId) ??
    (employeeId === "supportbee" ? supportBeeEmployee : undefined) ??
    fallbackEmployee;
  const profile = useMemo(() => getWorkProfile(employee), [employee]);
  const [started, setStarted] = useState(false);
  const [steer, setSteer] = useState("");
  const [styleNote, setStyleNote] = useState("Warm, concise, helpful");
  const [extraStream, setExtraStream] = useState<StreamItem[]>([]);
  const [workDraft, setWorkDraft] = useState(false);
  const [messages, setMessages] = useState([
    {
      who: "You",
      body: `Build a focused workflow for ${employee.current_project || "my business operations"}.`,
    },
    {
      who: employee.name,
      body: `I’ll build this as a focused Chippit workflow, use the connected tools, and keep customer-facing actions behind review.`,
    },
  ]);

  function sendSteer() {
    if (!steer.trim()) return;
    const request = steer.trim();
    const lowerRequest = request.toLowerCase();
    const isSupportWork =
      employee.id === "supportbee" &&
      (lowerRequest.includes("handle this customer question") ||
        lowerRequest.includes("customer question"));
    const supportReply = isSupportWork
      ? "I’ll handle this as a support request."
      : employee.id === "supportbee" && lowerRequest.includes("warmer")
        ? "Updated. I’ll keep customer replies warmer, shorter, and more helpful."
        : employee.id === "supportbee" &&
            (lowerRequest.includes("policy") || lowerRequest.includes("confidently"))
          ? "Updated. I’ll treat policy-sensitive questions as review-sensitive and offer staff follow-up when needed."
          : `Updated. I’ll steer this toward: ${request}`;
    if (isSupportWork) {
      setWorkDraft(true);
      setExtraStream((items) => [
        ...items,
        { time: "10:28", label: "Task", body: "Intent: order timing" },
        { time: "10:28", label: "Task", body: "Intent: policy follow-up" },
        { time: "10:29", label: "Tool", body: "Searching support policies" },
        { time: "10:29", label: "Draft", body: "Creating customer response" },
        { time: "10:30", label: "Approval", body: "Sending response requires review" },
      ]);
    }
    if (employee.id === "supportbee" && lowerRequest.includes("warmer")) {
      setStyleNote("Warmer, shorter, helpful");
      setExtraStream((items) => [
        ...items,
        { time: "10:26", label: "Task", body: "Updated customer response tone" },
        {
          time: "10:26",
          label: "Draft",
          body: "SupportBee style changed: warmer, shorter, helpful",
        },
      ]);
    }
    if (employee.id === "supportbee" && lowerRequest.includes("policy")) {
      setExtraStream((items) => [
        ...items,
        { time: "10:27", label: "Approval", body: "Updated policy-sensitive support rule" },
        { time: "10:27", label: "Approval", body: "Policy-sensitive responses now require review" },
      ]);
    }
    setMessages((items) => [
      ...items,
      { who: "You", body: request },
      { who: employee.name, body: supportReply },
    ]);
    setSteer("");
  }

  const tools = employee.tools.length
    ? employee.tools
    : ["Knowledge Base", "Gmail", "Calendar", "Tasks"];
  const tasks = [
    ["Create instructions", started ? "Done" : "Ready"],
    ["Connect support workflows", started ? "Done" : "Ready"],
    ["Add review rules", started ? "Done" : "Ready"],
    ["Generate preview", started ? "In progress" : "Waiting"],
    ["Prepare handoff", "Waiting"],
  ];
  const supportStream: StreamItem[] = [
    { time: "10:20", label: "Task", body: "Created customer support role" },
    { time: "10:21", label: "Tool", body: "Connected Knowledge Base" },
    { time: "10:21", label: "Tool", body: "Gmail ready for customer reply drafts" },
    { time: "10:22", label: "Tool", body: "Slack ready for internal support updates" },
    { time: "10:22", label: "Approval", body: "Created review rules" },
    { time: "10:23", label: "Task", body: "Ran test support workflow" },
    { time: "10:24", label: "Draft", body: "Drafted test response" },
    { time: "10:24", label: "Approval", body: "Sent test response to review" },
    { time: "10:25", label: "Done", body: "Employee ready" },
  ];
  const visibleStream =
    employee.id === "supportbee"
      ? [...supportStream, ...extraStream]
      : started
        ? [...baseStream, ...extraStream]
        : baseStream.slice(0, 2);
  const progress = workDraft ? 100 : started ? 72 : 28;
  const builderName =
    employee.id === "supportbee" ? "VoiceAgentBuilderBee" : `${employee.name}BuilderBee`;
  const buildTitle =
    employee.id === "supportbee" ? "Customer Support Agent Builder" : `${employee.name} Builder`;
  const previewTitle =
    employee.id === "supportbee" ? "Customer Support Voice Agent" : profile.output;
  const buildSteps = [
    ["Reading company context", started || visibleStream.length > 1 ? "Done" : "Active"],
    ["Creating employee instructions", started ? "Done" : "Waiting"],
    ["Connecting tools", started ? "Done" : "Waiting"],
    ["Generating platform preview", started ? "Active" : "Waiting"],
    ["Adding approval rules", workDraft ? "Done" : started ? "Active" : "Waiting"],
    ["Preparing publish handoff", workDraft ? "Done" : "Waiting"],
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      <header className="flex flex-col gap-3 border-b border-border bg-card/85 px-4 py-3 backdrop-blur sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/app"
            aria-label="Back to Working Room"
            className="smooth-action grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Chippit</span>
              <span>/</span>
              <span>{buildTitle}</span>
            </div>
            <h1 className="truncate text-xl font-medium tracking-tight md:text-2xl">
              {builderName} is building {previewTitle}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent/25 px-3 py-1.5 text-xs font-medium text-primary">
            {workDraft ? "Ready for review" : started ? "Building..." : "Preview: Live"}
          </span>
          <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
            Stop
          </button>
          <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
            Share
          </button>
          <button className="smooth-action rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
            Publish
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="flex min-h-[72vh] flex-col border-b border-border bg-card/70 xl:border-b-0 xl:border-r">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Builder chat
              </p>
              <h2 className="mt-1 text-lg font-medium">{builderName}</h2>
            </div>
            <Bot className="h-5 w-5 text-primary" />
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.who}-${index}`}
                className={`smooth-pop rounded-2xl p-3 text-sm ${
                  message.who === "You"
                    ? "ml-8 bg-primary text-primary-foreground"
                    : "mr-8 bg-background"
                }`}
              >
                <p className="text-xs font-medium opacity-80">{message.who}</p>
                <p className="mt-1 leading-6">{message.body}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <p className="font-medium">Build Plan</p>
              </div>
              <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground">Goal:</span> {profile.task}
                </p>
                <p>
                  <span className="text-foreground">Business:</span> Your Chippit workspace
                </p>
                <p>
                  <span className="text-foreground">Workflows:</span> intake, task routing,
                  follow-up, review, and handoff
                </p>
                <p>
                  <span className="text-foreground">Tools:</span> {tools.join(", ")}
                </p>
                <p>
                  <span className="text-foreground">Output:</span> {profile.output}
                </p>
              </div>
              <button
                onClick={() => setStarted(true)}
                className="smooth-action mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Play className="h-4 w-4" />
                Start build
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Live Work Stream
              </p>
              <div className="mt-3 space-y-2">
                {visibleStream.map((item) => (
                  <div key={`${item.time}-${item.body}`} className="smooth-pop text-sm">
                    <div className="flex items-start gap-2">
                      <span className="w-11 shrink-0 text-xs text-muted-foreground">
                        {item.time}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${labelTone[item.label]}`}
                      >
                        {item.label}
                      </span>
                      <p className="min-w-0 leading-5">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {workDraft && (
              <div className="rounded-2xl border border-primary/20 bg-accent/10 p-4">
                <p className="text-sm font-medium text-primary">Draft response ready</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Hi! We can help with your order timing and policy question. I can prepare the
                  right next steps and have a staff member follow up with the details before
                  anything customer-facing is sent.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="smooth-action rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
                    Approve
                  </button>
                  <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
                    Edit
                  </button>
                  <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-card p-3">
            <div className="flex gap-2">
              <input
                value={steer}
                onChange={(event) => setSteer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendSteer();
                }}
                placeholder={
                  employee.id === "supportbee"
                    ? "Message SupportBee..."
                    : `Steer ${employee.name}...`
                }
                className="min-w-0 flex-1 rounded-xl bg-background px-4 py-3 text-sm outline-none"
              />
              <button
                onClick={sendSteer}
                aria-label={`Steer ${employee.name}`}
                className="smooth-action grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <main className="min-w-0 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Live preview
                </p>
                <h2 className="mt-2 text-3xl md:text-5xl">{previewTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {profile.summary}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-sm">
                <p className="text-muted-foreground">Progress</p>
                <p className="mt-1 text-2xl font-medium">{progress}%</p>
              </div>
            </div>

            <div className="smooth-card overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
              <div className="border-b border-border p-4 sm:p-5">
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {buildSteps.map(([step, status]) => (
                    <div key={step} className="rounded-xl bg-background/80 p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span>{step}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            status === "Done"
                              ? "bg-primary text-primary-foreground"
                              : status === "Active"
                                ? "bg-accent/30 text-primary"
                                : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section className="min-h-[520px] bg-background p-4 sm:p-6">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                          Generated platform
                        </p>
                        <h3 className="mt-2 text-3xl">{previewTitle}</h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                          Built for your Chippit workspace. The agent can use connected tools, draft
                          customer-safe outputs, and route anything risky to review.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-accent/20 px-4 py-3 text-sm">
                        <p className="text-muted-foreground">Status</p>
                        <p className="mt-1 font-medium">
                          {workDraft ? "Live" : started ? "Generating..." : "Ready to build"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        ["Phone", started ? "872 666 9131" : "Generating..."],
                        ["Tools", tools.slice(0, 4).join(", ")],
                        ["Current step", started ? "Generating platform preview" : profile.task],
                        ["Review rule", "Customer-facing output needs approval"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-secondary p-4">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {label}
                          </p>
                          <p className="mt-2 text-sm font-medium">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl bg-surface p-5 text-surface-foreground">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-accent" />
                        <p className="font-medium">Can help with</p>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          "Customer questions",
                          "Order timing",
                          "Policy follow-up",
                          "Internal support tasks",
                          "Staff escalation",
                          "Approval-safe replies",
                        ].map((item) => (
                          <div key={item} className="rounded-xl bg-white/10 p-3 text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {workDraft && (
                      <div className="mt-5 rounded-2xl border border-primary/20 bg-accent/10 p-4">
                        <p className="font-medium text-primary">Draft response ready</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Hi! We can help with your order timing and policy question. I can prepare
                          the right next steps and have a staff member follow up with the details
                          before anything customer-facing is sent.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <aside className="border-t border-border bg-card/70 p-4 lg:border-l lg:border-t-0">
                  <div className="space-y-4">
                    <section>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Tools Used
                      </p>
                      <div className="mt-3 space-y-2">
                        {tools.map((tool, index) => (
                          <div key={tool} className="rounded-xl bg-background/80 p-3 text-sm">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium">{tool}</span>
                              <span className="rounded-full bg-accent/25 px-2 py-0.5 text-[10px] text-primary">
                                {started || index < 2 ? "Used" : "Ready"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Tasks Created
                      </p>
                      <div className="mt-3 space-y-2">
                        {tasks.map(([task, status]) => (
                          <div
                            key={task}
                            className="flex items-center justify-between gap-3 rounded-xl bg-background/80 p-3 text-sm"
                          >
                            <span>{task}</span>
                            <span className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                              {status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {employee.id === "supportbee" && (
                      <section className="rounded-xl bg-background/80 p-3 text-sm">
                        <p className="text-muted-foreground">Style</p>
                        <p className="mt-1 font-medium">{styleNote}</p>
                      </section>
                    )}

                    <section className="rounded-xl bg-background/80 p-3 text-sm">
                      <p className="font-medium">Permissions</p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Draft replies and create internal support tasks automatically. Sending
                        customer messages, promising availability, or giving policy-sensitive
                        answers requires review.
                      </p>
                    </section>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
