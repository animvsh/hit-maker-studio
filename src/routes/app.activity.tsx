import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/activity")({
  component: ActivityPage,
});

const events = [
  { t: "2:31 PM", who: "OpsBee", text: "joined Acme client call." },
  { t: "2:32 PM", who: "OpsBee", text: "detected deadline: Friday." },
  { t: "2:33 PM", who: "ResearchBee", text: "retrieved Acme Brand Guidelines." },
  { t: "2:34 PM", who: "PMBee", text: "created task: Get hero copy approved by Mike." },
  { t: "2:35 PM", who: "ClientBee", text: "drafted recap email." },
  { t: "2:36 PM", who: "ClientBee", text: "requested approval from Animesh." },
  { t: "2:37 PM", who: "Animesh", text: "approved recap." },
];

function ActivityPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl">Activity Logs</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every AI employee action, decision, and tool use is recorded.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Employee", "Project", "Action type", "Needs approval", "Completed", "Failed"].map((f) => (
          <button key={f} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs">{f}</button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <ol className="relative space-y-5 border-l-2 border-border pl-6">
          {events.map((e, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{e.who[0]}</span>
              <p className="text-xs text-muted-foreground">{e.t}</p>
              <p className="text-sm"><span className="font-medium">{e.who}</span> {e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
