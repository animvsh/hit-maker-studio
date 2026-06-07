import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Sparkles, Loader2, CheckCircle2, Mail, MessageSquare, Calendar, HardDrive, Phone, BookOpen, Upload, FileText, Globe, Shield, PhoneCall } from "lucide-react";

type Search = { q?: string };

export const Route = createFileRoute("/beevr/onboarding")({
  validateSearch: (s: Record<string, unknown>): Search => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({ meta: [{ title: "Setting up — Chippit" }] }),
  component: Onboarding,
});

const STEPS = ["Understand", "Tools", "Context", "Employees"] as const;

function Onboarding() {
  const { q } = Route.useSearch();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const description = q ?? "Bookshop Santa Cruz is an independent bookstore. We need help with customer calls, event questions, online order pickup, used-book drop-off questions, staff tasks, and daily summaries.";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/beevr" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Chippit</span>
        </Link>
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                <span>{i + 1}</span>
                <span className="hidden md:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px w-6 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {step === 0 && <Understand description={description} onNext={() => setStep(1)} />}
        {step === 1 && <Tools onNext={() => setStep(2)} />}
        {step === 2 && <Context onNext={() => setStep(3)} />}
        {step === 3 && <Employees onDone={() => navigate({ to: "/app" })} />}
      </main>
    </div>
  );
}

/* ---------------- Step 1: Understand (chat + preview) ---------------- */

const setupStream = [
  "Reading business description",
  "Detecting business type",
  "Finding workflows",
  "Recommending tools",
  "Drafting approval rules",
];

const detected = {
  type: "Bookstore",
  workflows: ["Customer calls", "Event questions", "Online order pickup", "Used-book drop-off", "Staff tasks", "Daily summaries"],
  employees: ["FrontDeskBee", "EventBee", "OrderBee", "UsedBooksBee", "OpsBee", "ManagerBee"],
  rules: [
    "Customer-facing messages require approval",
    "Event availability promises require approval",
    "Policy-sensitive answers require approval",
  ],
};

function Understand({ description, onNext }: { description: string; onNext: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= setupStream.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [stage]);
  const ready = stage >= setupStream.length;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      {/* Left: chat */}
      <div className="md:col-span-3 rounded-3xl border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Setup chat</p>

        <div className="mt-5 space-y-4">
          <div className="ml-auto max-w-md rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground">
            {description}
          </div>

          <div className="max-w-md rounded-2xl bg-secondary px-4 py-3 text-sm">
            <p>I'll set up Chippit for your business.</p>
            <p className="mt-2 text-muted-foreground">I found these workflows:</p>
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">
              {detected.workflows.map((w) => <li key={w}>{w}</li>)}
            </ul>
            <p className="mt-2">Next, I'll connect the tools your AI employees need.</p>
          </div>

          <div className="rounded-2xl bg-surface p-4 text-surface-foreground">
            <p className="text-xs uppercase tracking-wider text-surface-foreground/60">Live setup stream</p>
            <div className="mt-3 space-y-2 text-sm">
              {setupStream.map((s, i) => {
                const done = i < stage;
                const active = i === stage;
                return (
                  <div key={s} className="flex items-center gap-3">
                    {done ? <Check className="h-4 w-4 text-accent" /> : active ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <span className="h-4 w-4 rounded-full border border-surface-foreground/30" />}
                    <span className={done || active ? "" : "text-surface-foreground/40"}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground">
          <span>Steer setup…</span>
        </div>
      </div>

      {/* Right: workspace preview */}
      <div className="md:col-span-2 space-y-4">
        <Panel title="Business detected">
          <p className="text-lg">{detected.type}</p>
        </Panel>
        <Panel title="Workflows">
          <div className="flex flex-wrap gap-2">
            {detected.workflows.map((w) => (
              <span key={w} className="rounded-full bg-secondary px-3 py-1 text-xs">{w}</span>
            ))}
          </div>
        </Panel>
        <Panel title="Recommended AI employees">
          <div className="space-y-2">
            {detected.employees.map((e) => (
              <div key={e} className="flex items-center gap-2 text-sm">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">{e[0]}</div>
                {e}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Approval rules">
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {detected.rules.map((r) => (
              <li key={r} className="flex gap-2"><Shield className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />{r}</li>
            ))}
          </ul>
        </Panel>
        <button
          onClick={onNext}
          disabled={!ready}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
        >
          Continue to tools <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* ---------------- Step 2: Tools ---------------- */

const tools = [
  { name: "Gmail", desc: "Customer replies and follow-ups", icon: Mail, via: "Composio" },
  { name: "Slack", desc: "Internal updates and staff coordination", icon: MessageSquare, via: "Composio" },
  { name: "Google Calendar", desc: "Events and scheduling", icon: Calendar, via: "Composio" },
  { name: "Google Drive", desc: "Policies, SOPs, and business docs", icon: HardDrive, via: "Composio" },
  { name: "Calls", desc: "Voice workflows and call transcripts", icon: Phone, via: "Chippit" },
  { name: "Knowledge Base", desc: "Indexed docs and FAQs", icon: BookOpen, via: "Chippit" },
];

function Tools({ onNext }: { onNext: () => void }) {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const toggle = (n: string) => setConnected((c) => ({ ...c, [n]: !c[n] }));

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-4xl">Which tools should your AI employees use?</h2>
        <p className="mt-3 text-muted-foreground">Connect the tools your team already uses. Chippit will scope permissions per AI employee.</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {tools.map((t) => {
          const on = connected[t.name];
          return (
            <div key={t.name} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{t.name}</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">via {t.via}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
              <button
                onClick={() => toggle(t.name)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${on ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground hover:opacity-90"}`}
              >
                {on ? "Connected" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
      <button
        onClick={onNext}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
      >
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------- Step 3: Context ---------------- */

const contextCards = [
  { name: "Upload docs", icon: Upload },
  { name: "Import from Drive", icon: HardDrive },
  { name: "Paste website", icon: Globe },
  { name: "Add business rules", icon: Shield },
  { name: "Add sample calls", icon: PhoneCall },
];

const demoDocs = ["Bookshop FAQ", "Events Schedule", "Online Orders Policy", "Used Books Policy", "Staff SOP"];

function Context({ onNext }: { onNext: () => void }) {
  const [added, setAdded] = useState<string[]>([]);
  const toggle = (n: string) => setAdded((a) => (a.includes(n) ? a.filter((x) => x !== n) : [...a, n]));

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-4xl">Add company context</h2>
        <p className="mt-3 text-muted-foreground">Give your AI employees the docs, policies, and examples they should use while working.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        {contextCards.map((c) => (
          <button key={c.name} className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary transition">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">{c.name}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Demo context</p>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          {demoDocs.map((d) => {
            const on = added.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggle(d)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${on ? "border-primary bg-secondary" : "border-border bg-background hover:border-primary"}`}
              >
                <span className="flex items-center gap-3">
                  {on ? <CheckCircle2 className="h-4 w-4 text-accent" /> : <FileText className="h-4 w-4 text-muted-foreground" />}
                  {d}
                </span>
                <span className="text-xs text-muted-foreground">{on ? "Indexed" : "Add"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
      >
        Create AI employees <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------- Step 4: Employees ---------------- */

const creationStream = [
  "Read business description",
  "Detected bookstore workflows",
  "Connected tools",
  "Indexed company context",
  "Creating FrontDeskBee",
  "Creating EventBee",
  "Creating OrderBee",
  "Creating UsedBooksBee",
  "Creating OpsBee",
  "Creating ManagerBee",
];

const finalEmployees = [
  { name: "FrontDeskBee", role: "Handles customer calls" },
  { name: "EventBee", role: "Handles event questions" },
  { name: "OrderBee", role: "Handles order pickup" },
  { name: "UsedBooksBee", role: "Handles used-book questions" },
  { name: "OpsBee", role: "Creates staff tasks" },
  { name: "ManagerBee", role: "Reviews approvals" },
];

function Employees({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= creationStream.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), 500);
    return () => clearTimeout(t);
  }, [stage]);
  const ready = stage >= creationStream.length;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      <div className="md:col-span-3 rounded-3xl bg-surface p-6 text-surface-foreground">
        <p className="text-xs uppercase tracking-wider text-surface-foreground/60">Creating your AI employee team…</p>
        <div className="mt-5 space-y-2 text-sm">
          {creationStream.map((s, i) => {
            const done = i < stage;
            const active = i === stage;
            return (
              <div key={s} className="flex items-center gap-3">
                {done ? <Check className="h-4 w-4 text-accent" /> : active ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <span className="h-4 w-4 rounded-full border border-surface-foreground/30" />}
                <span className={done || active ? "" : "text-surface-foreground/40"}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2 space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">AI Employees</p>
        {finalEmployees.map((e, i) => {
          const visible = stage > 3 + i;
          return (
            <div key={e.name} className={`flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition ${visible ? "opacity-100" : "opacity-30"}`}>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">{e.name[0]}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.role}</p>
              </div>
              {visible && <CheckCircle2 className="h-4 w-4 text-accent" />}
            </div>
          );
        })}
        <button
          onClick={onDone}
          disabled={!ready}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
        >
          Enter Command Center <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
