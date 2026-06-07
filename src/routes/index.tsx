import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Inbox,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chippit" },
      {
        name: "description",
        content:
          "Create AI employees that work inside your business with tools, approvals, and a live work stream.",
      },
      { property: "og:title", content: "Chippit" },
      {
        property: "og:description",
        content: "Create AI employees that work inside your business.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setShowSplash(false), 1650);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showSplash && <SplashScreen />}
      <Nav />
      <main>
        <Hero />
        <Memory />
        <Employees />
        <LiveMoment />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="chippit-splash fixed inset-0 z-50 grid place-items-center bg-background">
      <div className="text-center">
        <div className="chippit-pulse mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="h-8 w-8" />
        </div>
        <p className="mt-5 text-4xl font-display text-primary">Chippit</p>
        <p className="mt-2 text-sm text-muted-foreground">AI employees waking up</p>
      </div>
    </div>
  );
}

function Nav() {
  const links = [
    { label: "Demo", href: "#demo" },
    { label: "AI Team", href: "#team" },
    { label: "Memory", href: "#memory" },
    { label: "Governance", href: "#governance" },
  ];
  return (
    <header className="smooth-page mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <Link to="/" className="smooth-action flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Chippit</span>
      </Link>
      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="smooth-action text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <Link
        to="/app"
        className="smooth-action rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Open platform
      </Link>
    </header>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const prompts = ["I run a clinic", "I have an agency", "I run an ecommerce brand"];

  function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = idea.trim() || "I have a business";
    void navigate({ to: "/app", search: { idea: trimmed } });
  }

  return (
    <section id="demo" className="mx-auto max-w-7xl px-6 pt-8 pb-20">
      <div className="smooth-page text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Chippit
        </p>
        <h1 className="mx-auto max-w-5xl text-5xl leading-[1.05] md:text-7xl">
          Create AI employees that work inside your business
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground md:text-base">
          Connect your tools, add company context, and Chippit will create AI employees that can
          answer questions, use your systems, and complete work with your approval.
        </p>
        <form
          onSubmit={submitIdea}
          className="smooth-card mx-auto mt-9 max-w-3xl rounded-[1.75rem] border border-border bg-card p-2 shadow-2xl shadow-primary/10"
        >
          <label className="sr-only" htmlFor="business-idea">
            What do you do?
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.35rem] bg-background px-4 py-3 text-left">
              <Sparkles className="h-5 w-5 shrink-0 text-accent" />
              <input
                id="business-idea"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="What do you do?"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="smooth-action inline-flex items-center justify-center gap-2 rounded-[1.35rem] bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Build my AI team <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </form>
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setIdea(prompt)}
              className="smooth-action rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="smooth-card smooth-delay-1 rounded-3xl bg-surface p-6 text-surface-foreground md:col-span-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-surface-foreground/60">
              Live workspace
            </p>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              Active
            </span>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            {["Call captured", "Tasks created", "Draft ready", "Approval requested"].map((item) => (
              <div key={item} className="smooth-pop rounded-xl bg-surface-foreground/5 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="smooth-card smooth-delay-2 flex flex-col justify-between rounded-3xl bg-secondary p-6 md:col-span-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div className="mt-10">
            <p
              className="text-4xl font-display text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Chippit
            </p>
            <p className="mt-2 text-sm text-primary/80">AI employee command center</p>
          </div>
        </div>
        <StatCard
          value="3m"
          label="AI employees created for calls, projects, inbox, policy requests, ops, and approvals"
        />
        <div className="smooth-card smooth-delay-3 flex flex-col justify-between rounded-3xl bg-surface p-6 text-surface-foreground md:col-span-2">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <p className="text-sm leading-snug">
            Human approval protects customer replies, scope promises, and external actions.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="smooth-card smooth-delay-2 flex flex-col justify-between rounded-3xl bg-accent/30 p-6 md:col-span-3">
      <div
        className="text-5xl font-display text-primary"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <p className="mt-8 text-sm text-primary/80">{label}</p>
    </div>
  );
}

function Memory() {
  const sources = [
    "Product FAQ",
    "Company context",
    "Project context",
    "Approval policy",
    "Inbox workflows",
    "Team SOP",
  ];
  return (
    <section id="memory" className="bg-surface text-surface-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl md:text-5xl">
              Connect the workspace memory before the AI team acts
            </h2>
            <p className="mt-4 max-w-lg text-sm text-surface-foreground/70">
              Chippit indexes policies first, then creates permissions for each employee so the
              system knows when to act and when to ask.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "Reading Chippit workspace...",
                "Parsing approval policies...",
                "Indexing project context...",
                "Creating employee permissions...",
                "Chippit AI team is ready.",
              ].map((step, i) => (
                <div
                  key={step}
                  className="smooth-card flex items-center gap-3 rounded-xl bg-surface-foreground/5 px-4 py-3 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>{step}</span>
                  <span className="ml-auto text-xs text-surface-foreground/50">{i + 1}/5</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-background p-6 text-foreground">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Memory Map</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sources.map((source) => (
                <div
                  key={source}
                  className="smooth-card rounded-2xl border border-border bg-card p-4"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-sm font-medium">{source}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Indexed and permission-aware</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Employees() {
  const team = [
    ["SupportBee", "Customer calls", "Drafts customer-ready replies."],
    ["ProjectBee", "Projects", "Creates tasks, owners, and deadlines."],
    ["InboxBee", "Inbox", "Routes follow-ups and message queues."],
    ["PolicyBee", "Policies", "Checks approval rules before action."],
    ["OpsBee", "Internal ops", "Creates team tasks and updates."],
    ["ManagerBee", "Governance", "Blocks risky promises until humans approve."],
  ];
  return (
    <section id="team" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl">Hire the Chippit AI team</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Each employee has a role, tool access, and approval boundary. It feels like a team, not a
          loose chatbot.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-border md:grid-cols-3">
        {team.map(([name, role, desc]) => (
          <div key={name} className="smooth-card bg-card p-8 transition hover:bg-secondary/70">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground font-semibold">
              {name[0]}
            </div>
            <h3 className="mt-6 text-xl">{name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{role}</p>
            <p className="mt-4 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LiveMoment() {
  const detections = [
    ["Intent 1", "Customer follow-up"],
    ["Intent 2", "Project task creation"],
    ["Intent 3", "Policy check"],
    ["Risk", "External message needs approval"],
  ];
  return (
    <section id="governance" className="bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl md:text-5xl">One messy call becomes managed work</h2>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              A customer asks for setup help, a follow-up email, and a scope commitment in one
              breath. Chippit routes it to the right employees.
            </p>
            <div className="smooth-card mt-8 rounded-3xl bg-card p-6">
              <PhoneCall className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm leading-6">
                "Can Chippit join our calls, turn the notes into tasks, draft the follow-up, and
                confirm what we can promise before anything goes to the customer?"
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {detections.map(([label, value]) => (
              <div key={label} className="smooth-card rounded-2xl border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-wider text-accent">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
              </div>
            ))}
            <div className="smooth-card rounded-2xl bg-surface p-5 text-surface-foreground">
              <Inbox className="h-5 w-5 text-accent" />
              <p className="mt-4 font-medium">Approval needed</p>
              <p className="mt-1 text-sm text-surface-foreground/70">
                ManagerBee blocks any customer-facing promise until a human approves the scope.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="rounded-[2rem] bg-surface p-12 text-center text-surface-foreground md:p-20">
        <h2 className="mx-auto max-w-3xl text-4xl md:text-6xl">
          Chippit turns every call, message, and policy into managed work
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-surface-foreground/70">
          Open the command center to run the live call, review the customer reply, and read the
          daily operating brief.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/app"
            className="smooth-action inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Open platform <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/app/inbox"
            className="smooth-action inline-flex items-center gap-2 rounded-full bg-surface-foreground/10 px-6 py-3 text-sm font-medium transition hover:bg-surface-foreground/15"
          >
            Review work <ClipboardList className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold">Chippit</span>
        </div>
        <p className="text-xs text-muted-foreground">
          AI employees for the real operating work inside Chippit.
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Users className="h-4 w-4" />
          <CalendarDays className="h-4 w-4" />
          <BookOpen className="h-4 w-4" />
        </div>
      </div>
    </footer>
  );
}
