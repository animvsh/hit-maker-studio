import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CheckCircle2, MessageSquare, PhoneCall, Plug, Sparkles, Zap, ShieldCheck, Users } from "lucide-react";
import { BeevrLogo } from "@/components/BeevrLogo";
import { Avatar, StatusPill } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beevr — AI Employees for your business" },
      { name: "description", content: "Create and manage AI employees that join calls, watch Slack, manage projects, draft follow-ups, and ask for approval before taking action." },
      { property: "og:title", content: "Beevr — AI Employees for your business" },
      { property: "og:description", content: "Turn calls, Slack, and docs into completed work." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BeevrLogo className="h-7 w-7" />
          <span className="font-semibold text-lg tracking-tight">Beevr</span>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="#features">Product</a>
          <a className="hover:text-foreground" href="#use-cases">Use cases</a>
          <a className="hover:text-foreground" href="#preview">Preview</a>
          <a className="hover:text-foreground" href="#">Pricing</a>
        </nav>
        <Link
          to={"/app" as never}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-honey text-primary-foreground text-sm font-medium hover:opacity-90"
        >
          Launch Demo <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-honey/10 blur-[140px]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-honey" />
            Hire your first AI employee in 90 seconds
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
            Create and manage <span className="text-honey">AI employees</span> for your business.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            Beevr lets SMBs spin up AI employees that join calls, watch Slack, manage projects, draft
            follow-ups, and ask for approval before taking action.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to={"/app" as never} className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-honey text-primary-foreground font-medium hover:opacity-90 glow-honey">
              Launch Demo Workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#preview" className="inline-flex items-center gap-2 h-11 px-6 rounded-md border border-border bg-surface/60 hover:bg-accent">
              See How It Works
            </a>
          </div>
        </div>

        {/* Hero visual */}
        <div id="preview" className="relative mx-auto max-w-6xl px-6 pb-20">
          <DashboardPreview />
        </div>
      </section>

      {/* Three steps */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Users, title: "Create employees", body: "Spin up SalesBee, OpsBee, ClientBee, or custom AI employees with permissions you trust." },
            { icon: Plug, title: "Connect work", body: "Add calls, Slack, docs, projects, and client context. Beevr indexes everything." },
            { icon: ShieldCheck, title: "Approve actions", body: "AI employees draft and prepare work — humans approve anything client-facing." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-surface p-6">
              <div className="h-10 w-10 rounded-lg bg-honey/15 grid place-items-center text-honey mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Built for the teams who actually run the work</h2>
          <p className="mt-3 text-muted-foreground">Six industries already running on Beevr.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["Marketing agencies", "Home services", "SaaS teams", "Consultants", "Real estate teams", "Clinics & admin"].map((u) => (
            <div key={u} className="rounded-lg border border-border bg-surface p-5 text-sm font-medium hover:border-honey/40 transition-colors">
              {u}
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BeevrLogo className="h-5 w-5" />
            <span>Beevr</span>
          </div>
          <div>© 2026 Beevr — Turn business conversations into managed AI employee work.</div>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-border bg-surface overflow-hidden shadow-2xl">
      <div className="h-9 border-b border-border flex items-center gap-1.5 px-3 bg-elevated">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warm/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-3 text-xs text-muted-foreground">beevr.app / command-center</span>
      </div>
      <div className="grid grid-cols-12 min-h-[520px]">
        {/* Mini sidebar */}
        <div className="col-span-2 border-r border-border p-3 space-y-1 bg-surface">
          {["Command", "Employees", "Projects", "Live Call", "Approvals", "Inbox"].map((l, i) => (
            <div key={l} className={`px-2 py-1.5 rounded text-xs ${i === 0 ? "bg-accent text-foreground" : "text-muted-foreground"}`}>{l}</div>
          ))}
        </div>
        {/* Center */}
        <div className="col-span-7 p-5 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { l: "AI Employees", v: "5", tone: "honey" as const },
              { l: "Projects", v: "3", tone: "ai" as const },
              { l: "Approvals", v: "4", tone: "warm" as const },
              { l: "Calls today", v: "2", tone: "success" as const },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-border bg-elevated p-3">
                <div className="text-[10px] text-muted-foreground">{s.l}</div>
                <div className={`text-xl font-bold text-${s.tone}`}>{s.v}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-elevated p-4">
            <div className="flex items-center gap-2 mb-3">
              <PhoneCall className="h-3.5 w-3.5 text-danger" />
              <span className="text-xs font-medium">Live: Acme Dental Weekly Check-in</span>
              <StatusPill tone="danger" pulse>Recording</StatusPill>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Client:</span> We need the page live by Friday.</p>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Client:</span> Sarah has the brand assets.</p>
              <p className="text-muted-foreground"><span className="text-foreground font-medium">Client:</span> Mike needs to approve the hero copy.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { who: "OpsBee", what: "Captured 5 action items", tone: "honey" as const },
              { who: "PMBee", what: "Created 3 tasks on board", tone: "ai" as const },
              { who: "ClientBee", what: "Drafted recap email", tone: "success" as const },
              { who: "QABee", what: "Updated launch checklist", tone: "warm" as const },
            ].map((a) => (
              <div key={a.who} className="rounded-lg border border-border bg-elevated p-3 flex items-center gap-2">
                <Avatar name={a.who} tone={a.tone} size={28} />
                <div className="text-[11px]">
                  <div className="font-medium">{a.who}</div>
                  <div className="text-muted-foreground">{a.what}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right approvals */}
        <div className="col-span-3 border-l border-border p-4 bg-elevated">
          <div className="text-xs font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-honey" /> Approval Inbox
          </div>
          <div className="space-y-2">
            {[
              { t: "Send Acme recap email", who: "ClientBee", risk: "External" },
              { t: "Ask Sarah for brand assets", who: "ClientBee", risk: "Client" },
              { t: "Post Acme update to Slack", who: "OpsBee", risk: "Internal" },
            ].map((a) => (
              <div key={a.t} className="rounded-lg border border-border bg-surface p-3">
                <div className="text-xs font-medium mb-1">{a.t}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Bot className="h-3 w-3" /> {a.who} · {a.risk}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
