import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusPill } from "@/components/chippit/AppShell";
import { getChippitProject } from "@/lib/api/chippit.functions";
import { FileText, PhoneCall, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/projects/$id")({
  loader: ({ params }) => getChippitProject({ data: { id: params.id } }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const { project, tasks, knowledgeSources } = Route.useLoaderData();
  const approvalTasks = tasks.filter((task) => task.requires_approval);
  const team = project.team.length ? project.team : ["ProjectBee", "SupportBee", "PolicyBee"];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to="/app/projects" className="text-xs text-muted-foreground hover:text-foreground">
        Back to tasks
      </Link>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chippit workflow · Source: live call · Due: {project.deadline}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <StatusPill status={project.status} />
            <span className="text-xs text-muted-foreground">Project ID: {id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/app/call"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            <PhoneCall className="h-4 w-4" /> Replay call
          </Link>
          <Link
            to="/app/inbox"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"
          >
            <Sparkles className="h-4 w-4" /> Review work
          </Link>
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b border-border">
        {["Board", "Call", "Docs", "Reviews", "Activity", "AI Team"].map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 text-sm ${i === 0 ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-surface p-6 text-surface-foreground">
            <p className="text-xs uppercase tracking-wider text-surface-foreground/60">Goal</p>
            <p className="mt-2">{project.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-surface-foreground/60">
              Current risk
            </p>
            <p className="mt-2 text-sm">
              {approvalTasks[0]?.reason ?? "No active approval risk is blocking this workflow."}
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-surface-foreground/60">
              Next best action
            </p>
            <p className="mt-2 text-sm">{project.next_action}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-medium">Progress</p>
            <div className="mt-4 space-y-3 text-sm">
              {tasks.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
                >
                  <span>{s.title}</span>
                  <span className="text-xs capitalize text-muted-foreground">{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">AI Team</p>
            <div className="mt-3 space-y-2">
              {team.map((n) => (
                <div key={n} className="flex items-center gap-2 text-sm">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {n[0]}
                  </div>
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Context used</p>
            <div className="mt-3 space-y-2 text-sm">
              {knowledgeSources.slice(0, 5).map((d) => (
                <div key={d.id} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" /> {d.source}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
