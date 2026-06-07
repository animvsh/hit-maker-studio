import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid, Users, FolderKanban, PhoneCall, Inbox, ScrollText, BookOpen, Settings,
  Search, Plus, Radio, Bell, ChevronsUpDown,
} from "lucide-react";
import { type ReactNode } from "react";
import { BeevrLogo } from "./BeevrLogo";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  live?: boolean;
  badge?: number;
};
const nav: NavItem[] = [
  { to: "/app", label: "Command Center", icon: LayoutGrid },
  { to: "/app/employees", label: "AI Employees", icon: Users },
  { to: "/app/projects", label: "Projects", icon: FolderKanban },
  { to: "/app/call", label: "Live Calls", icon: PhoneCall, live: true },
  { to: "/app/approvals", label: "Approvals", icon: Bell, badge: 4 },
  { to: "/app/inbox", label: "Inbox", icon: Inbox },
  { to: "/app/activity", label: "Activity Logs", icon: ScrollText },
  { to: "/app/knowledge", label: "Knowledge Base", icon: BookOpen },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="w-64 shrink-0 border-r border-border bg-surface/60 backdrop-blur flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2">
          <BeevrLogo className="h-7 w-7" />
          <span className="font-semibold text-lg tracking-tight">Beevr</span>
        </div>

        <nav className="px-3 flex-1 space-y-0.5">
          {nav.map(({ to, label, icon: Icon, live, badge }) => {
            const active = pathname === to || (to !== "/app" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                {live && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-danger">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />
                    LIVE
                  </span>
                )}
                {badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-honey text-primary-foreground">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 p-3 rounded-lg border border-border bg-elevated/60">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-medium">Northstar Studio</div>
              <div className="text-xs text-muted-foreground">Demo Workspace</div>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-honey to-warm grid place-items-center text-[11px] font-bold text-primary-foreground">
              AN
            </div>
            <div className="text-xs">
              <div className="font-medium">Animesh</div>
              <div className="text-muted-foreground">Workspace owner</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 flex items-center gap-3 px-6">
          <div className="flex-1 max-w-2xl relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder='Ask Beevr anything — "What&apos;s blocked?" "Summarize today&apos;s calls"'
              className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-honey/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 rounded-md border border-border text-sm flex items-center gap-2 hover:bg-accent">
              <Radio className="h-4 w-4 text-danger" />
              Start Live Call
            </button>
            <button className="h-9 px-3 rounded-md bg-honey text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90">
              <Plus className="h-4 w-4" />
              New AI Employee
            </button>
            <button className="relative h-9 w-9 rounded-md border border-border grid place-items-center hover:bg-accent">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-honey" />
            </button>
          </div>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
