import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusPill } from "@/components/chippit/AppShell";
import { PhoneCall, Sparkles, FileText, CheckSquare } from "lucide-react";

export const Route = createFileRoute("/app/projects/$id")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to="/app/projects" className="text-xs text-muted-foreground hover:text-foreground">← Projects</Link>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-3xl">Acme Dental Landing Page</h1>
          <p className="mt-1 text-sm text-muted-foreground">Client: Acme Dental · Deadline: Friday</p>
          <div className="mt-3 flex items-center gap-2">
            <StatusPill status="At Risk" />
            <span className="text-xs text-muted-foreground">Project ID: {id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/app/call" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"><PhoneCall className="h-4 w-4" /> Start client call</Link>
          <button className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"><Sparkles className="h-4 w-4" /> Ask project</button>
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b border-border">
        {["Board", "Calls", "Docs", "Approvals", "Activity", "AI Team"].map((t, i) => (
          <button key={t} className={`px-4 py-2 text-sm ${i === 0 ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-surface p-6 text-surface-foreground">
            <p className="text-xs uppercase tracking-wider text-surface-foreground/60">Goal</p>
            <p className="mt-2">Launch Acme Dental's landing page by Friday.</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-surface-foreground/60">Current risk</p>
            <p className="mt-2 text-sm">Launch is at risk because brand assets and hero copy approval are still missing.</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-surface-foreground/60">Next best action</p>
            <p className="mt-2 text-sm">Ask Sarah for brand assets and ask Mike to approve hero copy today.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-medium">Progress</p>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { name: "Scope confirmed", state: "done" },
                { name: "Assets collected", state: "blocked" },
                { name: "Copy approved", state: "blocked" },
                { name: "Launch checklist", state: "in progress" },
                { name: "Client recap", state: "approval needed" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                  <span>{s.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{s.state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">AI Team</p>
            <div className="mt-3 space-y-2">
              {["PMBee", "ClientBee", "OpsBee", "ResearchBee", "QABee"].map((n) => (
                <div key={n} className="flex items-center gap-2 text-sm">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">{n[0]}</div>
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Context used</p>
            <div className="mt-3 space-y-2 text-sm">
              {["Acme Brand Guidelines", "Landing Page Brief", "Acme Call Transcript", "Client Follow-up SOP"].map((d) => (
                <div key={d} className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> {d}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
