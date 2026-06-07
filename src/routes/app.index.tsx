import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  ListChecks,
  MessageSquare,
  Plug,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import {
  createChippitEmployee,
  getChippitDashboard,
  type ChippitActivityEvent,
  type ChippitApproval,
  type ChippitEmployee,
  type ChippitInboxMessage,
  type ChippitKnowledgeSource,
  type ChippitProject,
  type ChippitTask,
} from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/")({
  validateSearch: (search) => ({
    idea: typeof search.idea === "string" ? search.idea : undefined,
  }),
  loader: () => getChippitDashboard(),
  component: OnboardingWorkspace,
});

type Phase =
  | "welcome"
  | "basics"
  | "tools"
  | "permissions"
  | "context"
  | "understanding"
  | "build"
  | "test"
  | "command";

const workflows = [
  "Customer calls",
  "Lead intake",
  "Customer follow-ups",
  "Scheduling",
  "Staff tasks",
  "Daily summaries",
];

const toolCards = [
  ["Gmail", "For customer replies, order follow-ups, and drafts."],
  ["Slack", "For staff updates and internal coordination."],
  ["Google Calendar", "For store events, author talks, and scheduling."],
  ["Google Drive", "For policies, SOPs, event docs, and store information."],
  ["Google Sheets", "For order trackers, event lists, and staff checklists."],
  ["Calls / LiveKit", "For customer call transcripts and live call handling."],
  ["Knowledge Base", "For indexed company context."],
];

const permissionRows = [
  ["Gmail", "Draft customer replies", "Send customer emails"],
  ["Slack", "Post internal summaries", "Mention customers publicly"],
  ["Calendar", "Read events", "Create or change events"],
  ["Drive", "Read docs", "Edit docs"],
  ["Sheets", "Read rows", "Modify rows"],
  ["Calls", "Summarize calls", "Speak to customers live"],
];

const contextSources = [
  "Company FAQ.pdf",
  "Service Catalog.pdf",
  "Customer Policy.pdf",
  "Operations SOP.pdf",
  "Team Handoff Notes.pdf",
  "Customer Call Examples.txt",
];

const contextSteps = [
  "Reading documents...",
  "Extracting policies...",
  "Finding workflows...",
  "Creating company memory...",
  "Context ready.",
];

const learned = [
  "Your business has customer questions, follow-ups, internal tasks, and approval-sensitive work.",
  "Availability, pricing, and scope should not be promised without confirmation.",
  "Customer requests should be routed to the right workflow before anyone replies.",
  "Customer-facing messages require approval.",
  "Internal staff updates can be posted automatically.",
];

const employees = [
  {
    name: "IntakeBee",
    title: "AI Intake Employee",
    uses: "Calls, Gmail, Knowledge Base",
    works: "Customer questions and routing",
    approval: "Required before sending replies",
    status: "Monitoring requests",
  },
  {
    name: "ScheduleBee",
    title: "AI Scheduling Employee",
    uses: "Calendar, Drive, Slack",
    works: "Availability, booking, and calendar tasks",
    approval: "Required before changing schedules",
    status: "Checking availability",
  },
  {
    name: "FollowUpBee",
    title: "AI Follow-up Employee",
    uses: "Gmail, Sheets, Knowledge Base",
    works: "Customer follow-ups and next steps",
    approval: "Required before customer replies",
    status: "Draft ready",
  },
  {
    name: "PolicyBee",
    title: "AI Policy Employee",
    uses: "Drive, Gmail, Knowledge Base",
    works: "Policy checks and risk review",
    approval: "Required before policy responses",
    status: "Waiting approval",
  },
  {
    name: "OpsBee",
    title: "AI Operations Employee",
    uses: "Slack, Tasks, Calendar",
    works: "Staff tasks and internal updates",
    approval: "Internal tasks automatic",
    status: "Created staff tasks",
  },
  {
    name: "ManagerBee",
    title: "AI Manager",
    uses: "Reviews, Logs, Gmail, Slack",
    works: "Risk review and daily summaries",
    approval: "Controls risky actions",
    status: "1 review waiting",
  },
];

function employeeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const buildLog = [
  "Connected tools detected.",
  "Company context loaded.",
  "Creating employee roles.",
  "Mapping tools to employees.",
  "Creating permissions.",
  "Creating review rules.",
  "Creating test workflow.",
  "Workspace ready.",
];

const testLog = [
  "IntakeBee detected 3 customer intents.",
  "ScheduleBee checked availability context.",
  "FollowUpBee prepared customer guidance.",
  "PolicyBee checked the review policy.",
  "OpsBee created staff tasks.",
  "ManagerBee requested review before customer response.",
];

const onboardingSteps: Phase[] = [
  "welcome",
  "basics",
  "tools",
  "permissions",
  "context",
  "understanding",
  "build",
  "test",
];

const phaseKicker: Record<Phase, string> = {
  welcome: "Start",
  basics: "Business",
  tools: "Tools",
  permissions: "Permissions",
  context: "Context",
  understanding: "Understanding",
  build: "Build",
  test: "Test",
  command: "Command",
};

function summarizeBusiness(idea: string) {
  const cleaned = idea.trim().replace(/[.?!]+$/, "") || "I run a growing local business";
  const withoutLead = cleaned.replace(/^i\s+(have|run|own|operate|manage)\s+/i, "");
  const title = withoutLead.charAt(0).toUpperCase() + withoutLead.slice(1);
  return {
    idea: cleaned,
    name: title || "Growing local business",
    type: "Custom workspace",
    description: `${cleaned}. Chippit should understand the tools, policies, customer requests, internal tasks, and approval rules before creating AI employees.`,
  };
}

function OnboardingWorkspace() {
  const routeIdea = Route.useSearch().idea ?? "";
  const dashboard = Route.useLoaderData();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [businessIdea, setBusinessIdea] = useState(routeIdea || "I run a growing local business");
  const [connected, setConnected] = useState<string[]>([]);
  const [contextTick, setContextTick] = useState(0);
  const [buildTick, setBuildTick] = useState(0);
  const [testTick, setTestTick] = useState(0);
  const [direction, setDirection] = useState("");
  const [chatNote, setChatNote] = useState(
    "IntakeBee is monitoring customer requests. ManagerBee has one approval waiting.",
  );
  const business = summarizeBusiness(businessIdea);
  const isOnboarding =
    Boolean(routeIdea) || businessIdea !== "I run a growing local business" || phase !== "welcome";

  useEffect(() => {
    if (phase !== "context") return;
    const id = window.setInterval(
      () => setContextTick((tick) => Math.min(tick + 1, contextSteps.length)),
      700,
    );
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "build") return;
    const id = window.setInterval(
      () => setBuildTick((tick) => Math.min(tick + 1, buildLog.length)),
      700,
    );
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "test") return;
    const id = window.setInterval(
      () => setTestTick((tick) => Math.min(tick + 1, testLog.length)),
      850,
    );
    return () => window.clearInterval(id);
  }, [phase]);

  function connectTool(tool: string) {
    setConnected((items) => (items.includes(tool) ? items : [...items, tool]));
  }

  function sendDirection() {
    if (!direction.trim()) return;
    setChatNote(
      "Updated. ManagerBee will require approval for all customer-facing actions, and PolicyBee will stay read-only for sensitive customer guidance.",
    );
    setDirection("");
  }

  function enterPlatform() {
    setPhase("welcome");
    setBusinessIdea("I run a growing local business");
    void navigate({ to: "/app", search: {} });
  }

  const activeIndex = Math.max(0, onboardingSteps.indexOf(phase));
  const progress = Math.round(((activeIndex + 1) / onboardingSteps.length) * 100);

  function goBack() {
    const previous = onboardingSteps[Math.max(0, activeIndex - 1)];
    if (previous) setPhase(previous);
  }

  if (!isOnboarding) {
    return <WorkingRoom dashboard={dashboard} />;
  }

  return (
    <div className="typeform-stage bg-background px-4 py-4 sm:px-6 sm:py-6">
      {phase !== "command" && (
        <div className="smooth-page mx-auto w-full max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={activeIndex === 0}
              className="smooth-action inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {phaseKicker[phase]} · Step {activeIndex + 1} of {onboardingSteps.length}
              </p>
              <div className="mx-auto mt-2 h-2 max-w-md overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Link
              to="/app/employees"
              className="smooth-action rounded-full bg-secondary px-3 py-2 text-sm font-medium"
            >
              Skip
            </Link>
          </div>
        </div>
      )}

      {phase === "welcome" && (
        <Centered>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/25 px-3 py-1 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Chippit onboarding
              </div>
              <h1 className="mt-5 max-w-3xl text-5xl leading-tight md:text-6xl">
                Create AI employees that work inside your business.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                Connect your tools, add company context, and Chippit will create AI employees that
                can answer questions, use your systems, and complete work with your approval.
              </p>
              <div className="mt-6 rounded-2xl border border-border bg-background p-2 shadow-inner">
                <p className="px-4 pt-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  What you do
                </p>
                <input
                  value={businessIdea}
                  onChange={(event) => setBusinessIdea(event.target.value)}
                  placeholder="What do you do?"
                  className="w-full rounded-xl bg-transparent px-4 py-4 text-base outline-none"
                />
              </div>
              <button
                onClick={() => setPhase("basics")}
                className="smooth-action mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                Set up workspace <ArrowRight className="h-4 w-4" />
              </button>
            </section>
            <Panel title="Best demo line">
              <p className="text-2xl leading-snug">
                Before we create AI employees, Chippit connects to the business itself.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                The tools, docs, workflows, and approval rules come first. Then Chippit builds
                employees that can actually work.
              </p>
            </Panel>
          </div>
        </Centered>
      )}

      {phase === "basics" && (
        <Centered>
          <Panel title="Business basics">
            <h1 className="max-w-3xl text-4xl md:text-5xl">What business are we setting up?</h1>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Business" value={business.name} />
              <Field label="Business type" value={business.type} />
            </div>
            <p className="mt-6 text-sm font-medium">What should Chippit help with?</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <label
                  key={workflow}
                  className="clickable-card flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm"
                >
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                  {workflow}
                </label>
              ))}
            </div>
            <button
              onClick={() => setPhase("tools")}
              className="smooth-action mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Continue
            </button>
          </Panel>
        </Centered>
      )}

      {phase === "tools" && (
        <Centered wide>
          <h1 className="max-w-4xl text-4xl md:text-5xl">
            Connect the tools your AI employees will use.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Chippit uses Composio-style connections to connect AI employees to the apps where your
            business already works.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {toolCards.map(([tool, description]) => (
              <div
                key={tool}
                className="clickable-card smooth-card rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <Plug className="h-5 w-5 text-primary" />
                  <span className="rounded-full bg-secondary px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Recommended
                  </span>
                </div>
                <p className="mt-4 font-medium">{tool}</p>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                <p className="mt-3 text-xs text-muted-foreground">Used by future employees</p>
                <button
                  onClick={() => connectTool(tool)}
                  className="smooth-action mt-4 w-full rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                >
                  {connected.includes(tool)
                    ? `${tool} connected`
                    : tool === "Knowledge Base"
                      ? "Create Knowledge Base"
                      : "Connect with Composio"}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase("permissions")}
            className="smooth-action mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Continue to permissions
          </button>
        </Centered>
      )}

      {phase === "permissions" && (
        <Centered wide>
          <Panel title="Tool permissions">
            <h1 className="max-w-4xl text-4xl md:text-5xl">Set tool permissions</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Chippit employees can prepare work automatically, but important actions need approval.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Tool</th>
                    <th className="px-4 py-3">Allowed automatically</th>
                    <th className="px-4 py-3">Needs approval</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionRows.map(([tool, auto, approval]) => (
                    <tr key={tool} className="smooth-pop border-t border-border">
                      <td className="px-4 py-3 font-medium">{tool}</td>
                      <td className="px-4 py-3 text-muted-foreground">{auto}</td>
                      <td className="px-4 py-3 text-muted-foreground">{approval}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 rounded-xl bg-accent/20 p-4 text-sm">
              Customer-facing actions require approval. Internal summaries and tasks can happen
              automatically.
            </div>
            <button
              onClick={() => {
                setContextTick(0);
                setPhase("context");
              }}
              className="smooth-action mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Looks good
            </button>
          </Panel>
        </Centered>
      )}

      {phase === "context" && (
        <Centered wide>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Panel title="Company context">
              <h1 className="max-w-4xl text-4xl md:text-5xl">Add company context</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Give Chippit the information your AI employees should understand before they start
                working.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  "Upload documents",
                  "Import from Drive",
                  "Paste website",
                  "Add business rules",
                  "Add sample customer calls",
                ].map((item) => (
                  <div
                    key={item}
                    className="clickable-card smooth-card rounded-xl border border-border bg-background p-4"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm font-medium">Workspace context sources</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contextSources.map((source) => (
                  <span
                    key={source}
                    className="smooth-pop rounded-full bg-secondary px-3 py-1 text-xs"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel title="Indexing">
              <div className="space-y-2">
                {contextSteps.slice(0, contextTick).map((step) => (
                  <div
                    key={step}
                    className="smooth-pop flex items-center gap-2 rounded-lg bg-background p-3 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {step}
                  </div>
                ))}
              </div>
              {contextTick >= contextSteps.length && (
                <>
                  <p className="mt-5 text-sm font-medium">Chippit learned</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {learned.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setPhase("understanding")}
                    className="smooth-action mt-5 w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Review understanding
                  </button>
                </>
              )}
            </Panel>
          </div>
        </Centered>
      )}

      {phase === "understanding" && (
        <Centered wide>
          <Panel title="Company understanding">
            <h1 className="max-w-4xl text-4xl md:text-5xl">
              Here’s what Chippit understands about your business
            </h1>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <InfoBlock title="Business" items={[business.description]} />
              <InfoBlock title="Workflows detected" items={workflows} />
              <InfoBlock
                title="Risks detected"
                items={[
                  "Do not promise availability, pricing, or scope without approval.",
                  "Do not send customer-facing messages without approval.",
                  "Do not change company policies.",
                  "Do not modify schedules or external systems without approval.",
                ]}
              />
              <InfoBlock
                title="Recommended employees"
                items={employees.map((employee) => employee.name)}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setBuildTick(0);
                  setPhase("build");
                }}
                className="smooth-action rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Build these employees
              </button>
              <button className="smooth-action rounded-full bg-secondary px-5 py-2.5 text-sm font-medium">
                Edit understanding
              </button>
              <button className="smooth-action rounded-full border border-border px-5 py-2.5 text-sm font-medium">
                Add another workflow
              </button>
            </div>
          </Panel>
        </Centered>
      )}

      {phase === "build" && (
        <Centered wide>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)_330px]">
            <Panel title="Builder chat">
              <ChatBubble who="Chippit">
                I’ll create 6 AI employees for {business.name} using your connected tools and
                company context.
              </ChatBubble>
              <ChatBubble who="You">
                Make ManagerBee strict. Anything customer-facing needs approval.
              </ChatBubble>
              <ChatBubble who="Chippit">
                Updated. ManagerBee will require approval for all customer-facing actions.
              </ChatBubble>
            </Panel>
            <Panel title="Employee preview">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {employees
                  .slice(0, Math.max(1, Math.min(employees.length, buildTick - 1)))
                  .map((employee) => (
                    <EmployeeCard key={employee.name} employee={employee} />
                  ))}
              </div>
            </Panel>
            <Panel title="Build log">
              <div className="space-y-2">
                {buildLog.slice(0, buildTick).map((item) => (
                  <div
                    key={item}
                    className="smooth-pop flex items-center gap-2 rounded-lg bg-background p-3 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {item}
                  </div>
                ))}
              </div>
              {buildTick >= buildLog.length && (
                <button
                  onClick={() => {
                    setTestTick(0);
                    setPhase("test");
                  }}
                  className="smooth-action mt-4 w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Run test workflow
                </button>
              )}
            </Panel>
          </div>
        </Centered>
      )}

      {phase === "test" && (
        <Centered wide>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Panel title="Test your AI employees">
              <h1 className="text-4xl">Test your AI employees</h1>
              <div className="mt-5 rounded-xl bg-secondary p-4 text-sm">
                <p className="font-medium">Sample customer call</p>
                <p className="mt-2 text-muted-foreground">
                  Hi, I’m calling about a customer request with a few moving pieces. I need a
                  follow-up, a scheduling check, and confirmation on what your team can promise
                  before anything is sent.
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {testLog.slice(0, testTick).map((item) => (
                  <WorkMessage key={item} body={item} />
                ))}
              </div>
            </Panel>
            <Panel title="Test result">
              {testTick >= testLog.length ? (
                <>
                  <p className="text-2xl font-medium">Test passed.</p>
                  <div className="mt-4 space-y-2 text-sm">
                    {[
                      "4 tasks created",
                      "1 customer response drafted",
                      "1 approval required",
                      "5 tools used",
                      "6 employees coordinated",
                    ].map((item) => (
                      <div key={item} className="rounded-lg bg-background p-3">
                        {item}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={enterPlatform}
                    className="smooth-action mt-5 w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Enter Command Center
                  </button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chippit is testing the team against a real customer workflow.
                </p>
              )}
            </Panel>
          </div>
        </Centered>
      )}

      {phase === "command" && (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main>
            <div className="smooth-card rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Ask Chippit</p>
              <div className="mt-3 flex gap-2">
                <input
                  value={direction}
                  onChange={(event) => setDirection(event.target.value)}
                  placeholder="What are my employees doing?"
                  className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <button
                  onClick={sendDirection}
                  className="smooth-action grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <ChatBubble who="Chippit">{chatNote}</ChatBubble>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {employees.map((employee) => (
                <EmployeeCard key={employee.name} employee={employee} />
              ))}
            </div>
          </main>
          <aside className="space-y-4">
            <Panel title="Needs attention">
              <div className="rounded-xl bg-accent/20 p-4 text-sm">
                <p className="font-medium">Customer response review</p>
                <p className="mt-1 text-muted-foreground">
                  ManagerBee is waiting for review before any customer-facing response is sent.
                </p>
                <Link
                  to="/app/inbox"
                  className="smooth-action mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                >
                  Review
                </Link>
              </div>
            </Panel>
            <Panel title="Live logs">
              {[
                "Customer call received",
                "IntakeBee detected 3 intents",
                "ScheduleBee checked Calendar",
                "PolicyBee checked Drive policy",
                "ManagerBee requested approval",
              ].map((item) => (
                <div key={item} className="smooth-pop mb-2 rounded-lg bg-background p-3 text-xs">
                  {item}
                </div>
              ))}
            </Panel>
          </aside>
        </div>
      )}
    </div>
  );
}

type WorkingRoomProps = {
  dashboard: {
    employees: ChippitEmployee[];
    projects: ChippitProject[];
    approvals: ChippitApproval[];
    tasks: ChippitTask[];
    inboxMessages: ChippitInboxMessage[];
    activityEvents: ChippitActivityEvent[];
    knowledgeSources: ChippitKnowledgeSource[];
  };
};

function WorkingRoom({ dashboard }: WorkingRoomProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [supportFlow, setSupportFlow] = useState<"idle" | "plan" | "building" | "ready" | "test">(
    "idle",
  );
  const [gmailConnected, setGmailConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPersistingSupportBee, setIsPersistingSupportBee] = useState(false);
  const [createdEmployeeName, setCreatedEmployeeName] = useState<string | null>(null);
  const supportBeeVisible = supportFlow !== "idle" && supportFlow !== "plan";
  const supportBeeStatus =
    supportFlow === "building" ? "Connecting tools" : supportFlow === "test" ? "Testing" : "Ready";
  const supportBeeLastAction =
    supportFlow === "building"
      ? "Creating review rules"
      : supportFlow === "test"
        ? "Drafted test support response"
        : "Created support workflow";
  const supportProgress =
    supportFlow === "plan"
      ? 20
      : supportFlow === "building"
        ? 80
        : supportFlow === "test"
          ? 90
          : 100;
  const supportCreationStatus =
    supportFlow === "plan"
      ? "Planning"
      : supportFlow === "building"
        ? "Setting permissions"
        : supportFlow === "test"
          ? "Running test workflow"
          : "Ready";
  const liveLogs = [
    ...(supportBeeVisible
      ? [
          "User requested customer support employee",
          "Chippit generated SupportBee plan",
          "SupportBee mapped tools and review rules",
        ]
      : []),
    "IntakeBee triaged 4 customer messages",
    "OpsBee converted a Slack thread into 3 tasks",
    "PolicyBee blocked one external promise",
    "ManagerBee prepared the daily operating brief",
  ];
  const recentTasks = [
    ...(supportBeeVisible ? [["Done", "Created customer support workflow", "SupportBee"]] : []),
    ["Done", "Drafted customer follow-up", "FollowUpBee"],
    ["Done", "Updated task owners from inbox", "OpsBee"],
    ["Done", "Indexed new policy note", "PolicyBee"],
  ];
  const attention = [
    "Customer-facing response needs review",
    "Schedule change is waiting on a human",
    "New task has no AI employee assigned",
  ];

  const supportBuildSteps = [
    "Understanding customer support needs",
    "Checking connected tools",
    "Finding support context",
    "Creating role instructions",
    "Mapping tools",
    "Setting review rules",
    "Creating test workflow",
    "SupportBee is ready",
  ];
  const supportTools = [
    [
      "Gmail",
      "draft customer replies",
      gmailConnected ? "Connected through Composio" : "Not connected",
    ],
    ["Slack", "internal support updates", "Connected"],
    ["Knowledge Base", "answer support questions", "Connected"],
    ["Calls", "voice support conversations", "Connected"],
    ["Tasks", "create follow-up tasks", "Connected"],
  ];
  const supportPlanSteps = [
    ["Understanding request", supportFlow === "plan" ? "done" : "done"],
    ["Checking company context", supportFlow === "plan" ? "active" : "done"],
    ["Finding required tools", supportFlow === "plan" ? "waiting" : "done"],
    [
      "Creating employee role",
      supportFlow === "building" ? "active" : supportFlow === "plan" ? "waiting" : "done",
    ],
    [
      "Setting permissions",
      supportFlow === "building" ? "active" : supportFlow === "plan" ? "waiting" : "done",
    ],
    [
      "Running test workflow",
      supportFlow === "test" ? "active" : supportFlow === "ready" ? "done" : "waiting",
    ],
  ];
  const supportLiveEvents =
    supportFlow === "plan"
      ? [
          ["Context", "Found business workspace and support workflows"],
          ["Context", "Found docs: FAQ, customer policy, support SOP, staff handoff notes"],
          ["Tool", "Checking Gmail, Slack, Knowledge Base, Calls, and Tasks"],
          ...(gmailConnected
            ? [
                ["Tool", "Gmail connected through Composio"],
                ["Tool", "Knowledge Base, Slack, Calls, and Tasks ready"],
              ]
            : []),
        ]
      : supportFlow === "building"
        ? [
            [
              "Context",
              "Found support workflows: customer questions, order timing, policy follow-up",
            ],
            [
              "Tool",
              gmailConnected
                ? "Gmail connected through Composio"
                : "Gmail ready for drafts inside Chippit until connected",
            ],
            ["Tool", "Slack, Knowledge Base, Calls, and Tasks connected"],
            ["Role", "Created employee name: SupportBee"],
            ["Role", "Assigned role: Customer Support AI Employee"],
            ["Permission", "Draft replies and create internal tasks automatically"],
            ["Approval", "Customer-facing sends require review"],
            ["Blocked", "Refunds, policy changes, cancellations, and deletion blocked"],
          ]
        : supportFlow === "test"
          ? [
              ["SupportBee", "Detected 2 support issues"],
              ["SupportBee", "Issue 1: order timing"],
              ["SupportBee", "Issue 2: policy follow-up"],
              ["Tool", "Searching support policies"],
              ["Draft", "Creating customer response"],
              ["Approval", "Customer-facing response requires review"],
            ]
          : [
              ["Done", "SupportBee ready"],
              ["Done", "Test workflow completed"],
              ["Approval", "Draft response moved to review"],
            ];

  function submitCommand() {
    if (!prompt.trim()) return;
    const normalized = prompt.toLowerCase();
    if (
      normalized.includes("customer support") ||
      normalized.includes("support employee") ||
      normalized.includes("supportbee")
    ) {
      setSupportFlow("plan");
    } else {
      setSupportFlow("plan");
    }
    setPrompt("");
  }

  async function persistSupportBee(nextFlow: "building" | "ready" = "building") {
    setIsPersistingSupportBee(true);
    try {
      const employee = await createChippitEmployee({
        data: {
          name: "SupportBee",
          role: "Customer Support AI Employee",
          description:
            "SupportBee answers customer support questions, drafts replies, creates support tasks, summarizes conversations, and pauses for review before customer-facing actions.",
          currentProject: "Customer support workflow",
          tools: ["Gmail", "Slack", "Knowledge Base", "Calls", "Tasks"],
          source: "working-room",
        },
      });
      setCreatedEmployeeName(employee.name);
      setSupportFlow(nextFlow);
      await router.invalidate();
    } finally {
      setIsPersistingSupportBee(false);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const commandBar = (
    <div className="fixed inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-4xl rounded-2xl border border-border bg-card/95 p-2 shadow-2xl shadow-primary/15 backdrop-blur supports-[backdrop-filter]:bg-card/85 md:bottom-5">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitCommand();
          }}
          placeholder="Ask Chippit to create a custom AI employee, assign work, or check progress..."
          className="min-w-0 flex-1 rounded-xl bg-background px-4 py-3 text-sm outline-none"
        />
        <button
          onClick={submitCommand}
          aria-label="Create AI employee"
          className="smooth-action grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-48 pt-5 sm:px-6 sm:pt-8 md:pb-32">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Working Room</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Your AI employees at work</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Watch live work, assign tasks, and create custom AI employees from one command bar.
          </p>
        </div>
        <Link
          to="/app/projects"
          className="smooth-action inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <ListChecks className="h-4 w-4" />
          Open Tasks
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {supportBeeVisible && (
          <Link
            to="/app/employees/$employeeId"
            params={{ employeeId: "supportbee" }}
            className="clickable-card rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-lg shadow-primary/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-medium">SupportBee</p>
                <p className="text-xs text-muted-foreground">Customer Support AI Employee</p>
              </div>
              <span className="shrink-0 rounded-full bg-accent/25 px-2.5 py-1 text-xs text-primary">
                {supportBeeStatus}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {supportFlow === "ready"
                ? "Waiting for first support task"
                : supportFlow === "test"
                  ? "Testing a customer support response"
                  : "Preparing customer support workflows"}
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-background/70 px-3 py-2 text-xs text-muted-foreground">
              <Wrench className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">Knowledge Base, Gmail, Slack, Calls, Tasks</span>
            </div>
            <div className="mt-3 rounded-xl bg-accent/10 px-3 py-2 text-xs text-primary">
              Last action: {supportBeeLastAction}
            </div>
          </Link>
        )}
        {employees.map((employee) => (
          <Link
            key={employee.name}
            to="/app/employees/$employeeId"
            params={{ employeeId: employeeSlug(employee.name) }}
            className="clickable-card rounded-2xl border border-border bg-card/90 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-medium">{employee.name}</p>
                <p className="text-xs text-muted-foreground">{employee.title}</p>
              </div>
              <span className="shrink-0 rounded-full bg-accent/25 px-2.5 py-1 text-xs text-primary">
                {employee.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{employee.works}</p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-background/70 px-3 py-2 text-xs text-muted-foreground">
              <Wrench className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{employee.uses}</span>
            </div>
          </Link>
        ))}
      </div>

      {supportFlow === "plan" && (
        <section className="smooth-card mt-5 rounded-2xl border border-primary/30 bg-card/95 p-5 shadow-lg shadow-primary/10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Chippit</p>
              <h2 className="mt-2 text-2xl">I’ll create a Customer Support AI Employee.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                This employee will answer customer support questions, use company context, draft
                customer replies, create support tasks, escalate risky questions, and ask for review
                before sending customer-facing messages.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => void persistSupportBee("building")}
                disabled={isPersistingSupportBee}
                className="smooth-action rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {isPersistingSupportBee ? "Creating..." : "Create SupportBee"}
              </button>
              <button className="smooth-action rounded-full bg-secondary px-4 py-2 text-sm font-medium">
                Edit plan
              </button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-xl bg-background/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Creating AI Employee
                  </p>
                  <p className="mt-3 text-lg font-medium">SupportBee</p>
                  <p className="text-sm text-muted-foreground">Customer Support AI Employee</p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                  {supportCreationStatus}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${supportProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{supportProgress}% complete</p>
              <div className="mt-4 grid gap-2">
                {supportPlanSteps.map(([step, state]) => (
                  <div key={step} className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        state === "done"
                          ? "text-accent"
                          : state === "active"
                            ? "text-primary"
                            : "text-muted-foreground"
                      }
                    >
                      {state === "done" ? "✓" : state === "active" ? "→" : "○"}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {[
                  "Answer common customer questions",
                  "Read company policies and FAQs",
                  "Draft customer replies",
                  "Create support tasks",
                  "Escalate unclear or sensitive questions",
                  "Summarize support conversations",
                ].map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4">
              <div className="rounded-xl bg-background/70 p-4">
                <p className="text-sm font-medium">Live builder stream</p>
                <div className="mt-3 space-y-2">
                  {supportLiveEvents.map(([label, body]) => (
                    <div key={`${label}-${body}`} className="rounded-xl bg-card/80 p-3 text-sm">
                      <span className="mr-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-primary">
                        {label}
                      </span>
                      <span className="text-muted-foreground">{body}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-background/70 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Recommended Tools
                </p>
                <div className="mt-3 space-y-2">
                  {supportTools.map(([tool, use, status]) => (
                    <div key={tool} className="flex items-center justify-between gap-3 text-sm">
                      <span>
                        <span className="font-medium">{tool}</span>
                        <span className="block text-xs text-muted-foreground">{use}</span>
                      </span>
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setGmailConnected(true)}
                    className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium"
                  >
                    {gmailConnected ? "Gmail connected" : "Connect Gmail with Composio"}
                  </button>
                  {!gmailConnected && (
                    <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
                      Skip for now
                    </button>
                  )}
                </div>
                {gmailConnected && (
                  <div className="mt-3 rounded-xl bg-accent/10 p-3 text-sm text-primary">
                    Connecting Gmail through Composio... Authenticating... Gmail connected.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {(supportFlow === "building" || supportFlow === "ready" || supportFlow === "test") && (
        <section className="smooth-card mt-5 rounded-2xl border border-primary/30 bg-card/95 p-5 shadow-lg shadow-primary/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Creating AI Employee
              </p>
              <h2 className="mt-2 text-2xl">SupportBee</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Status: {supportCreationStatus}. SupportBee can work better with Gmail connected. No
                problem if you skip it: SupportBee will draft responses inside Chippit until Gmail
                is connected.
              </p>
              <div className="mt-4 max-w-xl">
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${supportProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{supportProgress}% complete</p>
              </div>
            </div>
            {supportFlow !== "building" && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSupportFlow("test")}
                  className="smooth-action rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Test SupportBee
                </button>
                <Link
                  to="/app/employees/$employeeId"
                  params={{ employeeId: "supportbee" }}
                  className="smooth-action rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                >
                  Open employee
                </Link>
                <Link
                  to="/app/projects"
                  className="smooth-action rounded-full bg-secondary px-4 py-2 text-sm font-medium"
                >
                  Assign first task
                </Link>
              </div>
            )}
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.85fr]">
            <div className="rounded-xl bg-background/70 p-4">
              <p className="text-sm font-medium">Live build stream</p>
              <div className="mt-3 grid gap-2">
                {supportLiveEvents.map(([label, body]) => (
                  <div key={`${label}-${body}`} className="rounded-xl bg-card/80 p-3 text-sm">
                    <span className="mr-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-primary">
                      {label}
                    </span>
                    <span className="text-muted-foreground">{body}</span>
                  </div>
                ))}
                {supportBuildSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        supportFlow === "building" && index > 6
                          ? "text-muted-foreground"
                          : "text-accent"
                      }`}
                    />
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
                {createdEmployeeName && (
                  <div className="rounded-xl bg-accent/10 p-3 text-sm text-primary">
                    {createdEmployeeName} was saved to the Chippit backend and will stay available
                    after refresh.
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-background/70 p-4">
              <p className="text-sm font-medium">Recommended tools</p>
              <div className="mt-3 space-y-2">
                {supportTools.map(([tool, use, status]) => (
                  <div key={tool} className="rounded-xl bg-card/80 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{tool}</span>
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        {status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Use: {use}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl bg-background/70 p-4">
              <p className="text-sm font-medium">Generated role</p>
              <p className="mt-2 text-sm text-muted-foreground">
                SupportBee manages customer support using company context, drafts customer
                responses, creates internal support tasks, summarizes conversations, and escalates
                risky or uncertain questions.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
                  Looks good
                </button>
                <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
                  Edit role
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-background/70 p-4">
              <p className="text-sm font-medium">SupportBee permissions</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>
                  Can do automatically: read docs, summarize questions, draft replies, create tasks.
                </p>
                <p>
                  Needs review: send messages, promise availability, give policy-sensitive answers.
                </p>
                <p>Blocked: issue refunds, change policies, cancel orders, delete data.</p>
              </div>
            </div>
          </div>
          {supportFlow === "building" && (
            <button
              onClick={() => void persistSupportBee("ready")}
              disabled={isPersistingSupportBee}
              className="smooth-action mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {isPersistingSupportBee ? "Saving..." : "Finish setup"}
            </button>
          )}
          {supportFlow === "test" && (
            <div className="mt-5 rounded-xl bg-background/70 p-4">
              <p className="text-sm font-medium">Test workflow</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-xl bg-card/80 p-3">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="mt-1">
                    Hi, I have a question about my order timing and whether someone can help me with
                    a policy question.
                  </p>
                </div>
                <div className="rounded-xl bg-card/80 p-3">
                  <p className="text-xs text-muted-foreground">SupportBee</p>
                  <p className="mt-1">
                    I’ll split this into two support issues: order timing and policy follow-up.
                  </p>
                </div>
                <div className="rounded-xl bg-accent/10 p-3 text-primary">
                  Draft response ready. Customer-facing response requires review.
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="smooth-action rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
                  Approve response
                </button>
                <button className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium">
                  Edit
                </button>
                <Link
                  to="/app/employees/$employeeId"
                  params={{ employeeId: "supportbee" }}
                  className="smooth-action rounded-full bg-secondary px-3 py-2 text-xs font-medium"
                >
                  Ask SupportBee to revise
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <Panel title="Live logs">
          <div className="space-y-2">
            {dashboard.activityEvents.slice(-4).map((event) => (
              <div
                key={event.id}
                className="smooth-pop flex items-center gap-3 rounded-xl bg-background/70 p-3 text-sm"
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
                <span>
                  {event.actor} {event.description}
                </span>
              </div>
            ))}
            {liveLogs.map((log) => (
              <div
                key={log}
                className="smooth-pop flex items-center gap-3 rounded-xl bg-background/70 p-3 text-sm"
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Recent completed tasks">
          <div className="space-y-2">
            {recentTasks.map(([status, task, owner]) => (
              <div
                key={task}
                className="clickable-card rounded-xl border border-border bg-background/70 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{task}</p>
                  <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] text-primary">
                    {status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{owner}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Needs your attention">
          <div className="space-y-2">
            {attention.map((item) => (
              <div
                key={item}
                className="clickable-card rounded-xl border border-border bg-background/70 p-3"
              >
                <TriangleAlert className="mb-2 h-4 w-4 text-accent" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {mounted && createPortal(commandBar, document.body)}
    </div>
  );
}

function Centered({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`typeform-question mx-auto w-full ${wide ? "max-w-7xl" : "max-w-5xl"} py-6`}>
      {children}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="smooth-card rounded-2xl border border-border bg-card/90 p-4 shadow-sm shadow-primary/5 sm:p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        readOnly
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-background p-4">
      <p className="font-medium">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

function ChatBubble({ who, children }: { who: string; children: ReactNode }) {
  return (
    <div className="mt-3 rounded-xl bg-background p-3 text-sm">
      <p className="font-medium text-primary">{who}</p>
      <div className="mt-1 text-muted-foreground">{children}</div>
    </div>
  );
}

function EmployeeCard({ employee }: { employee: (typeof employees)[number] }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{employee.name}</p>
          <p className="text-xs text-muted-foreground">{employee.title}</p>
        </div>
        <span className="rounded-full bg-accent/30 px-2 py-1 text-[10px] text-primary">
          {employee.status}
        </span>
      </div>
      <div className="mt-3 space-y-2 text-xs text-muted-foreground">
        <p>
          <Wrench className="mr-1 inline h-3.5 w-3.5 text-primary" />
          Uses: {employee.uses}
        </p>
        <p>
          <Bot className="mr-1 inline h-3.5 w-3.5 text-primary" />
          Works on: {employee.works}
        </p>
        <p>
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-primary" />
          Approval: {employee.approval}
        </p>
      </div>
    </div>
  );
}

function WorkMessage({ body }: { body: string }) {
  return (
    <div className="flex animate-fade-in gap-3 rounded-xl border border-border bg-card p-4">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/30 text-primary">
        <MessageSquare className="h-4 w-4" />
      </div>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
