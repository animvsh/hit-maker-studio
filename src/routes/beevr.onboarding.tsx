import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Sparkles, Upload, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/beevr/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Beevr" }] }),
  component: Onboarding,
});

function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/beevr" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Beevr</span>
        </Link>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`h-1.5 w-12 rounded-full ${n <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && <Step2 onNext={() => setStep(3)} />}
        {step === 3 && <Step3 onNext={() => setStep(4)} />}
        {step === 4 && <Step4 onDone={() => navigate({ to: "/app" })} />}
      </main>
    </div>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  const types = [
    { name: "Marketing Agency", desc: "Client calls, campaigns, follow-ups" },
    { name: "Home Services", desc: "Leads, bookings, job summaries" },
    { name: "SaaS Company", desc: "Sales calls, support, docs" },
    { name: "Consulting Firm", desc: "Client projects, recaps, tasks" },
    { name: "Custom", desc: "Build your own" },
  ];
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">What business are you running?</h1>
      <p className="mt-3 text-muted-foreground">We'll tailor your AI employees to your workflow.</p>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {types.map((t, i) => (
          <button
            key={t.name}
            onClick={onNext}
            className={`text-left rounded-2xl border border-border bg-card p-6 transition hover:border-primary ${i === 0 ? "ring-2 ring-accent" : ""}`}
          >
            <p className="text-lg">{t.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({ onNext }: { onNext: () => void }) {
  const pains = ["Missed follow-ups", "Client calls create too many tasks", "Slack is messy", "Need better project tracking", "Need approvals before client communication"];
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">Tell us about your business</h1>
      <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6">
        <Field label="Business Name" defaultValue="Northstar Studio" />
        <Field label="Team size" defaultValue="6" />
        <div>
          <label className="text-sm font-medium">What does your team do?</label>
          <textarea defaultValue="We build landing pages, ads, and brand campaigns for clients." className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm" rows={3} />
        </div>
        <div>
          <label className="text-sm font-medium">Main pain points</label>
          <div className="mt-3 space-y-2">
            {pains.map((p, i) => (
              <label key={p} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm">
                <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4 accent-primary" />
                {p}
              </label>
            ))}
          </div>
        </div>
      </div>
      <button onClick={onNext} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step3({ onNext }: { onNext: () => void }) {
  const [uploaded, setUploaded] = useState<string[]>([]);
  const docs = ["Acme Brand Guidelines", "Landing Page Brief", "Client Follow-up SOP", "Agency Services Doc"];
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">Add business context</h1>
      <p className="mt-3 text-muted-foreground">Your AI employees will use this knowledge to do work.</p>
      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        {docs.map((d) => {
          const done = uploaded.includes(d);
          return (
            <button key={d} onClick={() => setUploaded((u) => (u.includes(d) ? u : [...u, d]))} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary">
              <div className="flex items-center gap-3">
                {done ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                <div>
                  <p className="text-sm font-medium">{d}</p>
                  <p className="text-xs text-muted-foreground">{done ? "Indexed" : "Click to upload"}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl bg-secondary p-5 text-sm">
        <p className="font-medium">Connect your tools</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Slack", "Gmail", "Calendar", "Notion"].map((t) => (
            <span key={t} className="rounded-full bg-card px-3 py-1.5 text-xs">{t} · Connected</span>
          ))}
        </div>
      </div>
      <button onClick={onNext} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Step4({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const stages = ["Designing roles…", "Setting permissions…", "Connecting tools…", "Creating approval rules…", "Your AI employees are ready."];
  if (stage < stages.length - 1) {
    setTimeout(() => setStage((s) => s + 1), 900);
  }
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">Generate your AI team</h1>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <label className="text-sm font-medium">What should your AI employees help with?</label>
        <textarea defaultValue="Create an AI operations team for my agency. They should join client calls, extract tasks, track blockers, draft follow-ups, and ask me before sending anything to clients." className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm" rows={4} />
      </div>
      <div className="mt-6 space-y-2 rounded-2xl bg-surface p-6 text-surface-foreground">
        {stages.slice(0, stage + 1).map((s, i) => (
          <div key={s} className="flex items-center gap-3 text-sm">
            {i === stage && i < stages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <Check className="h-4 w-4 text-accent" />}
            {s}
          </div>
        ))}
      </div>
      {stage === stages.length - 1 && (
        <button onClick={onDone} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Enter Command Center <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input defaultValue={defaultValue} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm" />
    </div>
  );
}
