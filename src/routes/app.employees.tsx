import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { StatusPill } from "@/components/chippit/AppShell";
import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { getChippitDashboard } from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/employees")({
  loader: () => getChippitDashboard(),
  component: EmployeesLayout,
});

function EmployeesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/app/employees") return <Outlet />;
  return <EmployeesPage />;
}

function EmployeesPage() {
  const { employees } = Route.useLoaderData();
  const [created, setCreated] = useState(false);
  const steps = [
    "Reading Chippit workspace",
    "Parsing approval policy",
    "Indexing project context",
    "Creating permissions",
    "Chippit AI team ready",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl">AI Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage, and supervise the business AI employees working across the day.
          </p>
        </div>
        <button
          onClick={() => setCreated(true)}
          className="smooth-action inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Create AI Employee
        </button>
      </div>

      {created && (
        <div className="smooth-card mt-6 rounded-2xl bg-surface p-5 text-surface-foreground">
          <p className="text-sm font-medium">Create AI Team complete</p>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-5">
            {steps.map((step) => (
              <div
                key={step}
                className="flex items-center gap-2 rounded-xl bg-surface-foreground/5 px-3 py-2 text-xs"
              >
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((e) => (
          <Link
            key={e.id}
            to="/app/employees/$employeeId"
            params={{ employeeId: e.id }}
            className="clickable-card rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground text-lg font-semibold">
                {e.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.role}</p>
              </div>
              <StatusPill status={e.status} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{e.description}</p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Autonomy</span>
                <span>{e.autonomy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project</span>
                <span className="truncate ml-2">{e.current_project}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tools</span>
                <span>{e.tools.join(", ")}</span>
              </div>
            </div>
            <div className="smooth-action mt-5 inline-flex w-full items-center justify-center rounded-full bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80">
              Open Work Screen
            </div>
          </Link>
        ))}

        <button
          onClick={() => setCreated(true)}
          className="clickable-card rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-left transition hover:border-primary"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary">
            <Plus className="h-5 w-5" />
          </div>
          <p className="mt-4 font-medium">Create another AI Employee</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add InventoryBee, SchoolInboxBee, or build a custom business role.
          </p>
        </button>
      </div>
    </div>
  );
}
