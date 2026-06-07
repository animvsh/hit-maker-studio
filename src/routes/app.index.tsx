import { createFileRoute, Link } from "@tanstack/react-router";
import { employees, projects, approvals, StatusPill } from "@/components/chippit/AppShell";
import { TrendingUp, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: CommandCenter,
});

function CommandCenter() {
  const stats = [
    { label: "AI Employees", value: "5", sub: "active", trend: "+1 this week" },
    { label: "Active Projects", value: "3", sub: "in flight", trend: "1 at risk" },
    { label: "Pending Approvals", value: "4", sub: "to review", trend: "2 client-facing" },
    { label: "Calls Processed", value: "2", sub: "today", trend: "+4 since last call" },
    { label: "Tasks Created", value: "12", sub: "today", trend: "8 auto" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div>
        <h1 className="text-3xl">Command Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything your AI team is doing right now.</p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.sub}</span>
            </div>
            <p className="mt-2 text-xs text-primary/70">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Three columns */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Employees */}
        <section className="lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">AI Employee Roster</h2>
            <Link to="/app/employees" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          <div className="space-y-3">
            {employees.map((e) => (
              <div key={e.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground font-semibold">{e.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{e.name}</p>
                      <StatusPill status={e.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">{e.role}</p>
                    <p className="mt-2 text-xs"><span className="text-muted-foreground">On:</span> {e.project}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="lg:col-span-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Active Projects</h2>
            <Link to="/app/projects" className="text-xs text-muted-foreground hover:text-foreground">Board →</Link>
          </div>
          <div className="space-y-3">
            {projects.map((p) => (
              <Link key={p.id} to="/app/projects/$id" params={{ id: p.id }} className="block rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Deadline: {p.deadline}</p>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {p.team.map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{t}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> {p.blockers} blockers</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.approvals} approvals</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Approvals */}
        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Approval Inbox</h2>
            <Link to="/app/approvals" className="text-xs text-muted-foreground hover:text-foreground">All →</Link>
          </div>
          <div className="space-y-3">
            {approvals.map((a) => (
              <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.agent} · {a.risk}</p>
                <div className="mt-3 flex items-center justify-between">
                  <StatusPill status={a.status} />
                  {a.status === "Needs approval" && (
                    <div className="flex gap-1">
                      <button className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Approve</button>
                      <button className="rounded-full bg-secondary px-3 py-1 text-xs">Edit</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
