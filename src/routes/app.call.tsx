import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, RotateCcw, Square } from "lucide-react";
import { StatusPill } from "@/components/chippit/AppShell";
import { getChippitCall } from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/call")({
  loader: () => getChippitCall(),
  component: LiveCall,
});

function LiveCall() {
  const { lines, detections, agentActions, actions } = Route.useLoaderData();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => Math.min(t + 1, 8)), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl">Test Call: Customer Workflow</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-medium text-destructive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" /> LIVE
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Participants: Customer, IntakeBee, ScheduleBee, FollowUpBee, PolicyBee, ManagerBee
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTick(0)}
            className="smooth-action inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" /> Replay
          </button>
          <button className="smooth-action inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-destructive-foreground">
            <Square className="h-4 w-4" /> End Call
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="smooth-card rounded-2xl border border-border bg-card p-5 lg:col-span-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Transcript</p>
            <Mic className="h-4 w-4 animate-pulse text-accent" />
          </div>
          <div className="mt-3 flex h-10 items-end gap-1">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-accent"
                style={{ height: `${Math.round(28 + Math.abs(Math.sin(i + tick)) * 62)}%` }}
              />
            ))}
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {lines.slice(0, tick + 1).map((l, i) => (
              <p key={i} className="animate-fade-in">
                <span className="font-medium text-primary">{l.speaker}:</span>{" "}
                <span className="text-foreground">{l.line_text}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-3 lg:col-span-4">
          <p className="text-sm font-medium">Real-time intelligence</p>
          {detections
            .filter((d) => d.tick <= tick)
            .map((d) => (
              <div
                key={d.id}
                className="clickable-card animate-fade-in rounded-xl border border-border bg-card p-4"
              >
                <p className="text-xs uppercase tracking-wider text-accent">{d.label}</p>
                <p className="mt-1 text-sm">{d.value}</p>
              </div>
            ))}
        </div>

        <div className="smooth-card rounded-2xl bg-surface p-5 text-surface-foreground lg:col-span-3">
          <p className="text-sm font-medium">AI employee activity</p>
          <div className="mt-3 space-y-3">
            {agentActions
              .filter((a) => a.tick <= tick)
              .map((a, i) => (
                <div key={i} className="flex animate-fade-in items-start gap-2">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {a.agent[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{a.agent}</p>
                    <p className="text-xs text-surface-foreground/70">{a.body}</p>
                  </div>
                </div>
              ))}
            {tick < 7 && (
              <div className="flex items-center gap-2 text-xs text-surface-foreground/60">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />{" "}
                coordinating...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="smooth-card mt-6 overflow-hidden rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-medium">Customer Request: Follow-up + Scheduling + Policy</p>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Task</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {actions.slice(0, Math.max(0, tick - 2)).map((a) => (
                <tr key={a.id} className="animate-fade-in border-t border-border">
                  <td className="px-4 py-3">{a.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent/30 px-2 py-0.5 text-xs text-primary">
                      {a.owner}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tick >= 8 && (
          <div className="mt-4 rounded-xl bg-accent/20 p-4 text-sm">
            <p className="font-medium">Call processed.</p>
            <p className="text-muted-foreground">
              5 tasks created · 1 customer response drafted · schedule and policy promises waiting
              for approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
