import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const autonomy = [
  { level: "Low", meaning: "Draft only, never acts" },
  { level: "Medium", meaning: "Internal actions auto, external actions require approval" },
  { level: "High", meaning: "Can execute approved workflows" },
  { level: "Locked", meaning: "Paused / read-only" },
];

const rules = [
  { rule: "Client-facing messages", policy: "Approval required" },
  { rule: "Pricing changes", policy: "Blocked" },
  { rule: "Launch date promises", policy: "Approval required" },
  { rule: "Internal task creation", policy: "Automatic" },
  { rule: "Slack internal updates", policy: "Automatic" },
];

const tools = ["Calls", "Slack", "Gmail", "Calendar", "Docs", "CRM", "Project board"];

function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl">Settings & Governance</h1>
      <p className="mt-1 text-sm text-muted-foreground">Define how AI employees are allowed to act on your behalf.</p>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg">Autonomy levels</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {autonomy.map((a) => (
            <div key={a.level} className="rounded-xl bg-background p-4">
              <p className="font-medium">{a.level}</p>
              <p className="mt-1 text-sm text-muted-foreground">{a.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg">Approval rules</h2>
        <div className="mt-4 space-y-2">
          {rules.map((r) => (
            <div key={r.rule} className="flex items-center justify-between rounded-lg bg-background px-4 py-3 text-sm">
              <span>{r.rule}</span>
              <span className="text-xs text-muted-foreground">{r.policy}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg">Tool access</h2>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          {tools.map((t) => (
            <label key={t} className="flex cursor-pointer items-center justify-between rounded-lg bg-background px-4 py-3 text-sm">
              <span>{t}</span>
              <span className="relative h-5 w-9 rounded-full bg-primary">
                <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-primary-foreground" />
              </span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
