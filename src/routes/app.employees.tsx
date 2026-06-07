import { createFileRoute, Link } from "@tanstack/react-router";
import { employees, StatusPill } from "@/components/chippit/AppShell";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl">AI Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, manage, and supervise the AI employees working across your business.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Create AI Employee
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground text-lg font-semibold">{e.name[0]}</div>
              <div className="flex-1">
                <p className="font-medium text-lg">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.role}</p>
              </div>
              <StatusPill status={e.status} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{e.desc}</p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Autonomy</span><span>{e.autonomy}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Project</span><span className="truncate ml-2">{e.project}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tools</span><span>{e.tools.join(", ")}</span></div>
            </div>
            <Link to="/app/employees" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              View Employee
            </Link>
          </div>
        ))}

        {/* Create card */}
        <button className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-left transition hover:border-primary">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary"><Plus className="h-5 w-5" /></div>
          <p className="mt-4 font-medium">Create new AI Employee</p>
          <p className="mt-1 text-sm text-muted-foreground">Choose from SalesBee, SupportBee, OpsBee, ClientBee, or build a custom role.</p>
        </button>
      </div>
    </div>
  );
}
