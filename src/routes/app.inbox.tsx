import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hash } from "lucide-react";

export const Route = createFileRoute("/app/inbox")({
  component: InboxPage,
});

const channels = ["general", "client-updates", "acme-launch", "approvals", "agent-activity"];

const messages = [
  { agent: "OpsBee", time: "2:36 PM", text: "I captured 5 action items from the Acme client call.\n\nFriday launch is possible, but currently blocked on:\n1. Sarah sending brand assets\n2. Mike approving hero copy\n\nClient recap is drafted and waiting for approval.", actions: ["View project", "Approve recap", "Assign blockers"] },
  { agent: "PMBee", time: "2:37 PM", text: "I updated the Acme launch board. Project status changed from On Track to At Risk." },
  { agent: "ClientBee", time: "2:38 PM", text: "I drafted a client follow-up. Approval required before sending.", actions: ["Review draft"] },
  { agent: "QABee", time: "2:40 PM", text: "Launch checklist updated — 3 items still open." },
];

function InboxPage() {
  const [active, setActive] = useState("acme-launch");
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Channels */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
        <div className="px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Channels</p>
        </div>
        <div className="space-y-0.5 px-2">
          {channels.map((c) => (
            <button key={c} onClick={() => setActive(c)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${active === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <Hash className="h-4 w-4" /> {c}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-2 text-lg font-medium"><Hash className="h-4 w-4" /> {active}</div>
          <p className="text-xs text-muted-foreground">AI employees post updates here in real time.</p>
        </header>

        <div className="space-y-5 p-6">
          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground text-sm font-semibold">{m.agent[0]}</div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-medium">{m.agent}</p>
                  <span className="text-xs text-muted-foreground">{m.time}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm">{m.text}</p>
                {m.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <button key={a} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80">{a}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background p-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            Message #{active}
          </div>
        </div>
      </main>
    </div>
  );
}
