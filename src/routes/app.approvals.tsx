import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StatusPill } from "@/components/chippit/AppShell";
import {
  approveChippitApproval,
  ChippitApproval,
  getChippitApprovals,
} from "@/lib/api/chippit.functions";
import { generateChippitRevision } from "@/lib/api/minimax.functions";
import { Check, Edit3, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/app/approvals")({
  loader: () => getChippitApprovals(),
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const loaderData = Route.useLoaderData();
  const firstPendingApproval =
    loaderData.approvals.find((approval) => approval.status === "Needs approval") ??
    loaderData.approvals[0];
  const [approvalItems, setApprovalItems] = useState<ChippitApproval[]>(loaderData.approvals);
  const [selected, setSelected] = useState<string | null>(firstPendingApproval?.id ?? null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [revised, setRevised] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string[] | null>(null);
  const [revisionProvider, setRevisionProvider] = useState<string | null>(null);
  const item = approvalItems.find((a) => a.id === selected);
  const draft = item ? (revised ? (generatedDraft ?? item.revised_draft) : item.draft) : [];

  async function approveSelected() {
    if (!item) return;
    setIsApproving(true);
    try {
      const updated = await approveChippitApproval({ data: { id: item.id } });
      setApprovalItems((items) =>
        items.map((approval) => (approval.id === updated.id ? updated : approval)),
      );
    } finally {
      setIsApproving(false);
    }
  }

  async function reviseSelected() {
    if (!item) return;
    setIsRevising(true);
    try {
      const result = await generateChippitRevision({
        data: {
          title: item.title,
          risk: item.risk,
          draft: item.draft,
          instruction: item.revision_prompt,
        },
      });
      setGeneratedDraft(result.draft);
      setRevisionProvider(result.provider);
      setRevised(true);
    } finally {
      setIsRevising(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-3xl">Approval Inbox</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review work your AI employees prepared before they make customer promises, change scope, or
        send external messages.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {approvalItems.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setSelected(a.id);
                setRevised(false);
                setGeneratedDraft(null);
                setRevisionProvider(null);
              }}
              className={`clickable-card w-full rounded-2xl border bg-card p-5 text-left transition ${
                selected === a.id ? "border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
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
            <div className="smooth-card rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Approval needed
                  </p>
                  <h2 className="mt-1 text-2xl">{item.title}</h2>
                </div>
                <StatusPill status={item.status} />
              </div>

              <div className="mt-5 rounded-xl bg-accent/20 p-4 text-sm">
                <p className="font-medium">Why approval is needed</p>
                <p className="mt-1 text-muted-foreground">{item.risk}</p>
              </div>

              <div className="mt-6 rounded-xl bg-background p-5 text-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Draft response
                </p>
                <div className="mt-3 space-y-3 text-foreground">
                  {draft.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Context used
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.context_sources.map((c) => (
                    <span key={c} className="rounded-full bg-secondary px-3 py-1 text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {revised && item.status !== "Auto-approved" && (
                <div className="mt-5 rounded-xl border border-border bg-card p-4 text-sm">
                  <p className="font-medium">Revision request</p>
                  <p className="mt-1 text-muted-foreground">{item.revision_prompt}</p>
                  {revisionProvider && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Generated by {revisionProvider === "minimax" ? "MiniMax" : "local fallback"}
                    </p>
                  )}
                </div>
              )}

              {item.status === "Auto-approved" ? (
                <div className="mt-6 rounded-xl bg-accent/20 p-4 text-sm">
                  <p className="font-medium">Approved.</p>
                  <p className="text-muted-foreground">
                    SupportBee marked the follow-up as ready and OpsBee posted the internal update.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                  <button
                    onClick={approveSelected}
                    disabled={isApproving}
                    className="smooth-action inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
                  >
                    <Check className="h-4 w-4" /> {isApproving ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={reviseSelected}
                    disabled={isRevising}
                    className="smooth-action inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium"
                  >
                    <Sparkles className="h-4 w-4" />{" "}
                    {isRevising ? "ProjectBee is revising..." : "Ask ProjectBee to revise"}
                  </button>
                  <button className="smooth-action inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium">
                    <Edit3 className="h-4 w-4" /> Edit
                  </button>
                  <button className="smooth-action inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground">
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
