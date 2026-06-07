import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { approvals, StatusPill } from "@/components/beevr/AppShell";
import { X, Check, Edit3 } from "lucide-react";

export const Route = createFileRoute("/app/approvals")({
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const [selected, setSelected] = useState<string | null>("a1");
  const item = approvals.find((a) => a.id === selected);
  const [approved, setApproved] = useState(false);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <h1 className="text-3xl">Approval Inbox</h1>
      <p className="mt-1 text-sm text-muted-foreground">Review actions your AI employees prepared before they affect clients, deadlines, pricing, or external tools.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-3">
          {approvals.map((a) => (
            <button key={a.id} onClick={() => { setSelected(a.id); setApproved(false); }} className={`w-full text-left rounded-2xl border bg-card p-5 transition ${selected === a.id ? "border-primary" : "border-border hover:border-primary/50"}`}>
              <div className="flex items-center justify-between">
                <p className="font-medium">{a.title}</p>
                <StatusPill status={a.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Prepared by {a.agent}</p>
              <p className="mt-2 text-xs text-muted-foreground">Risk: {a.risk}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {item && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Draft</p>
                  <h2 className="mt-1 text-2xl">{item.title}</h2>
                </div>
                <StatusPill status={item.status} />
              </div>

              <div className="mt-6 rounded-xl bg-background p-5 text-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Subject</p>
                <p className="mt-1 font-medium">Acme Landing Page Recap</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Body</p>
                <div className="mt-2 space-y-3 text-foreground">
                  <p>Thanks for the call today. We captured that the landing page is targeting Friday, pending brand assets from Sarah and hero copy approval from Mike.</p>
                  <p>We'll also update the page to mention emergency dental appointments.</p>
                  <p className="font-medium">Next steps:</p>
                  <ol className="ml-5 list-decimal space-y-1">
                    <li>Sarah sends brand assets.</li>
                    <li>Mike approves hero copy.</li>
                    <li>Northstar updates the launch checklist.</li>
                  </ol>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Context used</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Acme call transcript", "Client Follow-up SOP", "Landing Page Brief"].map((c) => (
                    <span key={c} className="rounded-full bg-secondary px-3 py-1 text-xs">{c}</span>
                  ))}
                </div>
              </div>

              {approved ? (
                <div className="mt-6 rounded-xl bg-accent/20 p-4 text-sm">
                  <p className="font-medium">Approved.</p>
                  <p className="text-muted-foreground">ClientBee marked the recap as ready to send.</p>
                </div>
              ) : (
                <div className="mt-6 flex gap-2">
                  <button onClick={() => setApproved(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium">
                    <Edit3 className="h-4 w-4" /> Edit draft
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground">
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
