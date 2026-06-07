import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { StatusPill } from "@/components/chippit/AppShell";

export const Route = createFileRoute("/app/projects")({
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/app/projects") return <Outlet />;
  return <ProjectsBoard />;
}

const columns = [
  {
    name: "Backlog",
    items: [
      { title: "Write Q3 client newsletter", owner: "ClientBee", source: "manual", deadline: "Next week", risk: "Low" },
    ],
  },
  {
    name: "In Progress",
    items: [
      { title: "Update page to mention emergency dental appointments", owner: "PMBee", source: "call", deadline: "Friday", risk: "Medium", confidence: 95 },
      { title: "Draft Acme recap email", owner: "ClientBee", source: "call", deadline: "Today", risk: "Medium", confidence: 92 },
    ],
  },
  {
    name: "Waiting on Human",
    items: [
      { title: "Collect brand assets from Sarah", owner: "ClientBee", source: "call", deadline: "Friday", risk: "High", confidence: 92, approval: true },
    ],
  },
  {
    name: "Blocked",
    items: [
      { title: "Get hero copy approved by Mike", owner: "PMBee", source: "call", deadline: "Thursday", risk: "High", confidence: 88, reason: "Mike approval required before launch" },
    ],
  },
  {
    name: "Done",
    items: [
      { title: "Set up Acme launch checklist", owner: "QABee", source: "manual", deadline: "—", risk: "Low" },
    ],
  },
];

function ProjectsBoard() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <h1 className="text-3xl">Projects</h1>
      <p className="mt-1 text-sm text-muted-foreground">All tasks across your AI team — sourced from calls, Slack, and docs.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {columns.map((col) => (
          <div key={col.name} className="rounded-2xl bg-secondary/60 p-3">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-sm font-medium">{col.name}</p>
              <span className="text-xs text-muted-foreground">{col.items.length}</span>
            </div>
            <div className="mt-2 space-y-2">
              {col.items.map((t) => (
                <div key={t.title} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-sm font-medium">{t.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-medium text-primary">{t.owner}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">src: {t.source}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Due {t.deadline}</span>
                    {"confidence" in t && t.confidence && <span>{t.confidence}% conf</span>}
                  </div>
                  {"reason" in t && t.reason && <p className="mt-2 rounded bg-destructive/10 p-1.5 text-[10px] text-destructive">{t.reason}</p>}
                  {"approval" in t && t.approval && <p className="mt-2 rounded bg-accent/30 p-1.5 text-[10px] text-primary">Approval required</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Projects</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { id: "acme", name: "Acme Dental Landing Page", status: "At Risk" },
            { id: "bright", name: "BrightSmiles Ad Campaign", status: "On Track" },
            { id: "peak", name: "Peak Fitness Rebrand", status: "Waiting on Client" },
          ].map((p) => (
            <Link key={p.id} to="/app/projects/$id" params={{ id: p.id }} className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
              <div className="flex items-center justify-between">
                <p className="font-medium">{p.name}</p>
                <StatusPill status={p.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
