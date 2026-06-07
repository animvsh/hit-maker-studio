import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode } from "react";
import {
  LayoutGrid, Users, Workflow, PhoneCall, CheckSquare, Inbox, Activity, BookOpen, Settings, Search, Plus, Phone, Bell, Sparkles,
} from "lucide-react";

const nav = [
  { to: "/app", label: "Command Center", icon: LayoutGrid, exact: true },
  { to: "/app/employees", label: "AI Employees", icon: Users },
  { to: "/app/projects", label: "Projects", icon: Workflow },
  { to: "/app/call", label: "Live Calls", icon: PhoneCall },
  { to: "/app/approvals", label: "Approvals", icon: CheckSquare },
  { to: "/app/inbox", label: "Inbox", icon: Inbox },
  { to: "/app/activity", label: "Activity Logs", icon: Activity },
  { to: "/app/knowledge", label: "Knowledge Base", icon: BookOpen },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Beevr</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="rounded-xl bg-secondary p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Workspace</p>
            <p className="mt-1 text-sm font-medium">Northstar Studio</p>
            <p className="text-xs text-muted-foreground">Demo Workspace</p>
          </div>
          <div className="mt-3 flex items-center gap-3 px-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">A</div>
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
        <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-6">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span className="truncate">Ask Beevr anything… "What's blocked?" "Create a client follow-up" "Summarize today's calls"</span>
          </div>
          <Link to="/app/employees" className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition">
            <Plus className="h-4 w-4" /> New AI Employee
          </Link>
          <Link to="/app/call" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
            <Phone className="h-4 w-4" /> Start Live Call
          </Link>
          <Link to="/app/approvals" className="relative grid h-9 w-9 place-items-center rounded-full bg-secondary">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">4</span>
          </Link>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export const employees = [
  { id: "opsbee", name: "OpsBee", role: "Operations AI Employee", desc: "Turns calls and Slack into tasks.", status: "Listening", autonomy: "Medium", project: "Acme Dental Launch", tools: ["Calls", "Slack", "Projects"] },
  { id: "clientbee", name: "ClientBee", role: "Client Communications", desc: "Drafts client follow-ups and recaps.", status: "Waiting for approval", autonomy: "Low", project: "Acme Dental Launch", tools: ["Email", "Slack", "Docs"] },
  { id: "pmbee", name: "PMBee", role: "Project Manager", desc: "Tracks projects, deadlines, and blockers.", status: "Working", autonomy: "Medium", project: "Acme Dental Launch", tools: ["Projects", "Calendar"] },
  { id: "researchbee", name: "ResearchBee", role: "Research & Context", desc: "Pulls relevant docs and client context.", status: "Active", autonomy: "Medium", project: "BrightSmiles Campaign", tools: ["Docs", "Knowledge"] },
  { id: "qabee", name: "QABee", role: "Quality & Launch Readiness", desc: "Checks launch readiness and missing items.", status: "Active", autonomy: "Medium", project: "Acme Dental Launch", tools: ["Projects", "Checklists"] },
];

export const projects = [
  { id: "acme", name: "Acme Dental Landing Page", status: "At Risk", deadline: "Friday", team: ["PMBee", "ClientBee", "QABee"], blockers: 2, approvals: 1 },
  { id: "bright", name: "BrightSmiles Ad Campaign", status: "On Track", deadline: "Next Wednesday", team: ["PMBee", "ResearchBee"], blockers: 0, approvals: 0 },
  { id: "peak", name: "Peak Fitness Rebrand", status: "Waiting on Client", deadline: "June 14", team: ["ClientBee", "PMBee"], blockers: 1, approvals: 0 },
];

export const approvals = [
  { id: "a1", title: "Send Acme recap email", agent: "ClientBee", risk: "External client message", status: "Needs approval" },
  { id: "a2", title: "Ask Sarah for brand assets", agent: "ClientBee", risk: "Client-facing message", status: "Needs approval" },
  { id: "a3", title: "Post Acme update to Slack", agent: "OpsBee", risk: "Internal", status: "Auto-approved" },
  { id: "a4", title: "Confirm Friday launch with Mike", agent: "PMBee", risk: "Deadline commitment", status: "Needs approval" },
];

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "At Risk": "bg-destructive/15 text-destructive",
    "On Track": "bg-accent/30 text-primary",
    "Waiting on Client": "bg-secondary text-primary",
    Active: "bg-accent/30 text-primary",
    Listening: "bg-accent/30 text-primary",
    Working: "bg-accent/30 text-primary",
    "Waiting for approval": "bg-secondary text-primary",
    Blocked: "bg-destructive/15 text-destructive",
    "Needs approval": "bg-accent/40 text-primary",
    "Auto-approved": "bg-secondary text-muted-foreground",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-secondary text-foreground"}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{status}
  </span>;
}
