import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/chippit/")({
  head: () => ({
    meta: [
      { title: "Chippit — AI Employees for Your Business" },
      { name: "description", content: "Describe your business. Chippit builds an AI employee workspace around your tools, context, and workflows." },
      { property: "og:title", content: "Chippit — AI Employees for Your Business" },
      { property: "og:description", content: "One prompt. A full AI workspace." },
    ],
  }),
  component: ChippitLanding,
});

const examples = [
  "I run a bookstore with customer calls, events, online orders, and used-book questions.",
  "I run a home services business that needs help booking jobs and following up with customers.",
  "I run a marketing agency and need AI employees for client calls, project tasks, and follow-ups.",
  "I run a SaaS company and need support, sales, and onboarding employees.",
];

const quickStarts = ["Customer Support", "Sales", "Operations", "Voice Agent"];

function ChippitLanding() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const submit = (text: string) => {
    const v = text.trim();
    if (!v) return;
    navigate({ to: "/chippit/onboarding", search: { q: v } as never });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/chippit" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Chippit</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {["Product", "Use cases", "Pricing", "Docs"].map((l) => (
            <a key={l} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
          ))}
        </nav>
        <Link to="/app" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
          Open Workspace
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> One prompt. A full AI workspace.
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            What is your <span className="italic text-muted-foreground">business?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
            Describe your business in plain English. Chippit will build an AI employee workspace around your tools, context, and workflows.
          </p>
        </div>

        {/* Prompt input */}
        <form
          onSubmit={(e) => { e.preventDefault(); submit(value); }}
          className="mt-10 rounded-3xl border border-border bg-card p-3 shadow-sm focus-within:border-primary transition"
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Example: I run a bookstore with events, online orders, used-book questions, and customer calls..."
            rows={4}
            className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-2">
            <p className="text-xs text-muted-foreground">
              Chippit will create: AI employees · Tool connections · Company memory · Workflows · Approval rules
            </p>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
              disabled={!value.trim()}
            >
              Build workspace <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Examples */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Try one</p>
          <div className="mt-3 grid gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setValue(ex)}
                className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground hover:border-primary hover:text-foreground transition"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        {/* Quick starts */}
        <div className="mt-10 rounded-2xl bg-secondary p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Quick starts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickStarts.map((q) => (
              <button
                key={q}
                onClick={() => submit(`Set up Chippit for a ${q.toLowerCase()} team.`)}
                className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm hover:border-primary transition"
              >
                {q} <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          No setup needed yet. Chippit will recommend tools, employees, and approval rules after understanding your business.
        </p>
      </section>
    </div>
  );
}
