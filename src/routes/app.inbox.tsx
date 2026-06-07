import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hash } from "lucide-react";
import { getChippitDashboard } from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/inbox")({
  loader: () => getChippitDashboard(),
  component: InboxPage,
});

function InboxPage() {
  const { inboxMessages } = Route.useLoaderData();
  const channels = Array.from(new Set(inboxMessages.map((message) => message.channel)));
  const [active, setActive] = useState(channels[0] ?? "customer-workflows");
  const visibleMessages = inboxMessages.filter((message) => message.channel === active);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Channels */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
        <div className="px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Channels</p>
        </div>
        <div className="space-y-0.5 px-2">
          {channels.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${active === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <Hash className="h-4 w-4" /> {c}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Hash className="h-4 w-4" /> {active}
          </div>
          <p className="text-xs text-muted-foreground">
            AI employees post updates here in real time.
          </p>
        </header>

        <div className="space-y-5 p-6">
          {visibleMessages.map((m) => (
            <div key={m.id} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground text-sm font-semibold">
                {m.agent[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-medium">{m.agent}</p>
                  <span className="text-xs text-muted-foreground">{m.time_label}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm">{m.body}</p>
                {m.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <button
                        key={a}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80"
                      >
                        {a}
                      </button>
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
