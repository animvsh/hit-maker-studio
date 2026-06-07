import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, Square } from "lucide-react";
import { StatusPill } from "@/components/chippit/AppShell";

export const Route = createFileRoute("/app/call")({
  component: LiveCall,
});

const lines = [
  { who: "Client", text: "We need the landing page live by Friday." },
  { who: "Client", text: "Sarah has the brand assets." },
  { who: "Client", text: "Mike needs to approve the hero copy." },
  { who: "Client", text: "Also make sure the page mentions emergency dental appointments." },
  { who: "Client", text: "Can you send us a recap after this?" },
];

const detections = [
  { label: "Deadline detected", value: "Friday", t: 1 },
  { label: "Owner detected", value: "Sarah → brand assets", t: 2 },
  { label: "Approval detected", value: "Mike → hero copy approval", t: 3 },
  { label: "Scope change detected", value: "Add emergency dental appointments", t: 4 },
  { label: "Risk detected", value: "Friday launch blocked by assets + copy approval", t: 5 },
];

const agentActions = [
  { name: "OpsBee", text: "Captured 5 action items from the call.", t: 5 },
  { name: "ResearchBee", text: "Found Acme brand guidelines and landing page brief.", t: 5 },
  { name: "PMBee", text: "Updated project board and created 3 tasks.", t: 6 },
  { name: "ClientBee", text: "Drafted recap email.", t: 6 },
  { name: "QABee", text: "Added emergency appointments to launch checklist.", t: 6 },
  { name: "OpsBee", text: "External recap requires human approval.", t: 7 },
];

const actions = [
  { action: "Collect brand assets from Sarah", owner: "ClientBee", status: "Needs approval" },
  { action: "Get hero copy approved by Mike", owner: "PMBee", status: "Blocked" },
  { action: "Add emergency dental messaging", owner: "PMBee", status: "Active" },
  { action: "Draft recap email", owner: "ClientBee", status: "Needs approval" },
  { action: "Update launch checklist", owner: "QABee", status: "Working" },
];

function LiveCall() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => Math.min(t + 1, 8)), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl">Live Call: Acme Dental Weekly Check-in</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-medium text-destructive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" /> LIVE
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Participants: You, Acme Client, OpsBee · Recording & Listening</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-destructive-foreground">
          <Square className="h-4 w-4" /> End Call
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Transcript */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Transcript</p>
            <Mic className="h-4 w-4 text-accent animate-pulse" />
          </div>
          {/* Waveform */}
          <div className="mt-3 flex h-10 items-end gap-1">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-1 rounded-full bg-accent" style={{ height: `${30 + Math.abs(Math.sin(i + tick)) * 60}%` }} />
            ))}
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {lines.slice(0, tick + 1).map((l, i) => (
              <p key={i} className="animate-fade-in">
                <span className="font-medium text-primary">{l.who}:</span> <span className="text-foreground">{l.text}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Real-time intelligence */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-sm font-medium">Real-time intelligence</p>
          {detections.filter((d) => d.t <= tick).map((d) => (
            <div key={d.label} className="animate-fade-in rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-accent">{d.label}</p>
              <p className="mt-1 text-sm">{d.value}</p>
            </div>
          ))}
        </div>

        {/* Agent activity */}
        <div className="lg:col-span-3 rounded-2xl bg-surface p-5 text-surface-foreground">
          <p className="text-sm font-medium">AI Employee activity</p>
          <div className="mt-3 space-y-3">
            {agentActions.filter((a) => a.t <= tick).map((a, i) => (
              <div key={i} className="animate-fade-in flex items-start gap-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">{a.name[0]}</div>
                <div>
                  <p className="text-xs font-medium">{a.name}</p>
                  <p className="text-xs text-surface-foreground/70">{a.text}</p>
                </div>
              </div>
            ))}
            {tick < 7 && (
              <div className="flex items-center gap-2 text-xs text-surface-foreground/60">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> thinking…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions table */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-medium">Actions created</p>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2">Action</th><th className="px-4 py-2">Owner</th><th className="px-4 py-2">Status</th></tr>
            </thead>
            <tbody>
              {actions.slice(0, Math.max(0, tick - 3)).map((a) => (
                <tr key={a.action} className="border-t border-border animate-fade-in">
                  <td className="px-4 py-3">{a.action}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-accent/30 px-2 py-0.5 text-xs text-primary">{a.owner}</span></td>
                  <td className="px-4 py-3"><StatusPill status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tick >= 8 && (
          <div className="mt-4 rounded-xl bg-accent/20 p-4 text-sm">
            <p className="font-medium">Call processed.</p>
            <p className="text-muted-foreground">5 actions created · 2 blockers found · 1 approval needed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
