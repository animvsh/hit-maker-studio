import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode } from "react";
import {
  LayoutGrid,
  Users,
  ListChecks,
  Inbox,
  Activity,
  BookOpen,
  Settings,
  Search,
  Plus,
  Bell,
  Sparkles,
} from "lucide-react";

const nav = [
  { to: "/app", label: "Working Room", icon: LayoutGrid, exact: true },
  { to: "/app/employees", label: "AI Employees", icon: Users },
  { to: "/app/projects", label: "Tasks", icon: ListChecks },
  { to: "/app/inbox", label: "Inbox", icon: Inbox },
  { to: "/app/activity", label: "Activity Logs", icon: Activity },
  { to: "/app/knowledge", label: "Knowledge Base", icon: BookOpen },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mobileNav = nav.slice(0, 5);
  return (
    <div className="flex min-h-screen bg-background pb-20 text-foreground md:pb-0">
      {/* Sidebar */}
      <aside className="smooth-page hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Chippit</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`smooth-action flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="smooth-card rounded-xl bg-secondary p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Workspace</p>
            <p className="mt-1 text-sm font-medium">Chippit</p>
            <p className="text-xs text-muted-foreground">AI employee workspace</p>
          </div>
          <div className="mt-3 flex items-center gap-3 px-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Animesh</p>
              <p className="text-xs text-muted-foreground">Founder</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="smooth-page flex min-h-16 items-center gap-2 border-b border-border bg-card px-3 py-2 sm:gap-3 sm:px-6">
          <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground sm:flex">
            <Search className="h-4 w-4" />
            <span className="truncate">
              Steer Chippit... "Make ManagerBee stricter" "Revise the draft" "Show tool calls"
            </span>
          </div>
          <Link to="/app" className="smooth-action flex items-center gap-2 sm:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">Chippit</span>
          </Link>
          <Link
            to="/app/projects"
            className="smooth-action ml-auto inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-sm font-medium transition hover:bg-secondary/80 sm:ml-0 sm:px-4"
          >
            <Plus className="h-4 w-4" /> <span className="hidden lg:inline">New Task</span>
          </Link>
          <Link
            to="/app"
            className="smooth-action relative grid h-9 w-9 place-items-center rounded-full bg-secondary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              4
            </span>
          </Link>
        </header>
        <main className="smooth-page flex-1 overflow-auto">{children}</main>
      </div>
      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-border bg-card/95 p-1 shadow-2xl shadow-primary/10 backdrop-blur md:hidden">
        {mobileNav.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`smooth-action grid place-items-center gap-1 rounded-xl px-2 py-2 text-[10px] ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <n.icon className="h-4 w-4" />
              <span className="max-w-full truncate">{n.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export const employees = [
  {
    id: "supportbee",
    name: "SupportBee",
    role: "Customer support",
    desc: "Answers common questions and drafts customer-ready replies.",
    status: "Listening",
    autonomy: "Low",
    project: "Customer Follow-up Flow",
    tools: ["Calls", "FAQ", "Reviews"],
  },
  {
    id: "projectbee",
    name: "ProjectBee",
    role: "Project operations",
    desc: "Creates tasks, owners, deadlines, and follow-up plans from messy inputs.",
    status: "Waiting for review",
    autonomy: "Low",
    project: "Demo Workspace Setup",
    tools: ["Tasks", "Calendar", "Team chat"],
  },
  {
    id: "inboxbee",
    name: "InboxBee",
    role: "Inbox triage",
    desc: "Routes email, chat, and call follow-ups to the right workflow.",
    status: "Working",
    autonomy: "Medium",
    project: "Lead Follow-up",
    tools: ["Inbox", "FAQ", "Email"],
  },
  {
    id: "policybee",
    name: "PolicyBee",
    role: "Policy guardrails",
    desc: "Checks business rules before Chippit promises, sends, or changes anything.",
    status: "Active",
    autonomy: "Medium",
    project: "Review Guardrails",
    tools: ["Policies", "Reviews"],
  },
  {
    id: "opsbee",
    name: "OpsBee",
    role: "Workspace operations",
    desc: "Turns calls and team messages into tasks, updates, and owners.",
    status: "Active",
    autonomy: "Medium",
    project: "Daily Operating Brief",
    tools: ["Calls", "Team chat", "Tasks"],
  },
  {
    id: "managerbee",
    name: "ManagerBee",
    role: "Governance",
    desc: "Blocks risky promises and prepares daily summaries.",
    status: "Active",
    autonomy: "Low",
    project: "Morning Brief",
    tools: ["Reviews", "Policies", "Reports"],
  },
];

export const projects = [
  {
    id: "customer-follow-up",
    name: "Customer Follow-up + Approval Flow",
    status: "Waiting on Human",
    deadline: "Today",
    team: ["SupportBee", "InboxBee", "PolicyBee"],
    blockers: 1,
    approvals: 2,
  },
  {
    id: "demo-workspace",
    name: "Chippit Demo Workspace Setup",
    status: "At Risk",
    deadline: "Tomorrow",
    team: ["ProjectBee", "OpsBee", "ManagerBee"],
    blockers: 1,
    approvals: 1,
  },
  {
    id: "inbox-triage",
    name: "Inbox Triage Automation",
    status: "On Track",
    deadline: "Today",
    team: ["InboxBee", "SupportBee"],
    blockers: 0,
    approvals: 0,
  },
];

export const approvals = [
  {
    id: "a1",
    title: "Send customer follow-up draft",
    agent: "SupportBee + InboxBee",
    risk: "External customer message",
    status: "Needs approval",
  },
  {
    id: "a2",
    title: "Confirm proposed onboarding scope",
    agent: "ProjectBee",
    risk: "Scope commitment",
    status: "Needs approval",
  },
  {
    id: "a3",
    title: "Post internal workspace update",
    agent: "OpsBee",
    risk: "Internal",
    status: "Auto-approved",
  },
  {
    id: "a4",
    title: "Send policy approval guidance",
    agent: "PolicyBee",
    risk: "Customer-facing policy message",
    status: "Needs approval",
  },
];

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "At Risk": "bg-destructive/15 text-destructive",
    "On Track": "bg-accent/30 text-primary",
    "Waiting on Client": "bg-secondary text-primary",
    "Waiting on Human": "bg-secondary text-primary",
    Active: "bg-accent/30 text-primary",
    Listening: "bg-accent/30 text-primary",
    Working: "bg-accent/30 text-primary",
    "Waiting for approval": "bg-secondary text-primary",
    Blocked: "bg-destructive/15 text-destructive",
    "Needs approval": "bg-accent/40 text-primary",
    "Auto-approved": "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-secondary text-foreground"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
