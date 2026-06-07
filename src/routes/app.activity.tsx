import { createFileRoute } from "@tanstack/react-router";
import { getChippitDashboard } from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/activity")({
  loader: () => getChippitDashboard(),
  component: ActivityPage,
});

function ActivityPage() {
  const { activityEvents } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl">Activity Logs</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every AI employee action, decision, and tool use is recorded.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Employee", "Project", "Action type", "Needs approval", "Completed", "Failed"].map(
          (f) => (
            <button
              key={f}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs"
            >
              {f}
            </button>
          ),
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <ol className="relative space-y-5 border-l-2 border-border pl-6">
          {activityEvents.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[31px] top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {e.actor[0]}
              </span>
              <p className="text-xs text-muted-foreground">{e.time_label}</p>
              <p className="text-sm">
                <span className="font-medium">{e.actor}</span> {e.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
