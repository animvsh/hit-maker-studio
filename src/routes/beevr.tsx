import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles, Users, CheckCircle2, Workflow, PhoneCall, Inbox } from "lucide-react";

export const Route = createFileRoute("/beevr")({
  head: () => ({
    meta: [
      { title: "Beevr — Manage AI Employees for Your Business" },
      { name: "description", content: "Beevr lets SMBs create AI employees that join calls, watch Slack, manage projects, and draft follow-ups — with approvals built in." },
      { property: "og:title", content: "Beevr — AI Employees for SMBs" },
      { property: "og:description", content: "Create, supervise, and approve work done by your AI team." },
    ],
  }),
  component: BeevrLanding,
});

function BeevrLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/beevr" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Beevr</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {["Product", "Use cases", "Pricing", "Docs"].map((l) => (
            <a key={l} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
          ))}
        </nav>
        <Link to="/app" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
          Launch Demo
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> AI Employees for SMBs
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
            Create and manage<br />
            <span className="italic text-muted-foreground">AI employees</span> for your business.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground md:text-base">
            Beevr spins up AI employees that join calls, watch Slack, manage projects, and draft client follow-ups — and asks for approval before taking action.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/beevr/onboarding" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Launch Demo Workspace <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/app" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary transition">
              See How It Works
            </Link>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-border bg-surface p-4 text-surface-foreground shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-3 rounded-2xl bg-surface-foreground/5 p-5">
              <p className="text-xs uppercase tracking-wider text-surface-foreground/60">AI Employees</p>
              <div className="mt-4 space-y-3">
                {["OpsBee", "ClientBee", "PMBee", "ResearchBee", "QABee"].map((n) => (
                  <div key={n} className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">{n[0]}</div>
                    <div className="flex-1">
                      <p className="text-sm">{n}</p>
                      <p className="text-xs text-surface-foreground/60">Active</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-6 rounded-2xl bg-surface-foreground/5 p-5">
              <p className="text-xs uppercase tracking-wider text-surface-foreground/60">Live Call Transcript</p>
              <div className="mt-4 space-y-2 text-sm">
                <p><span className="text-accent">Client:</span> We need the landing page live by Friday.</p>
                <p><span className="text-accent">Client:</span> Sarah has the brand assets.</p>
                <p><span className="text-accent">Client:</span> Mike needs to approve the hero copy.</p>
                <p className="text-surface-foreground/60">OpsBee captured 5 action items…</p>
              </div>
            </div>
            <div className="md:col-span-3 rounded-2xl bg-accent/20 p-5">
              <p className="text-xs uppercase tracking-wider text-surface-foreground/60">Approvals</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-sm">Send Acme recap</p>
                  <p className="text-xs text-surface-foreground/60">ClientBee · needs review</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-sm">Ask Sarah for assets</p>
                  <p className="text-xs text-surface-foreground/60">ClientBee · needs review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three cards */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: Users, title: "Create employees", desc: "Spin up SalesBee, OpsBee, ClientBee, or build custom AI employees." },
            { icon: Workflow, title: "Connect work", desc: "Add calls, Slack, docs, projects, and client context." },
            { icon: CheckCircle2, title: "Approve actions", desc: "AI employees draft and prepare work — humans stay in control." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl bg-secondary p-8">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-6 text-2xl">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl md:text-4xl">Built for SMBs that move fast</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["Agencies", "Home Services", "SaaS Teams", "Consultants", "Real Estate", "Clinics"].map((u) => (
              <span key={u} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{u}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] bg-surface p-12 text-center text-surface-foreground md:p-20">
          <h2 className="mx-auto max-w-2xl text-4xl md:text-6xl">Turn conversations into completed work.</h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-surface-foreground/70">
            Launch a fully populated demo workspace in seconds.
          </p>
          <Link to="/beevr/onboarding" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition">
            Launch Demo Workspace <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold">Beevr</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Beevr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
