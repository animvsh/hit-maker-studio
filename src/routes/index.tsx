import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Star, Factory, Cog, ShieldCheck, Sparkles, Sun, Settings2, Wrench, BarChart3, CheckCircle2 } from "lucide-react";
import heroFactory from "@/assets/hero-factory.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prodmach — The Future of Manufacturing" },
      { name: "description", content: "Optimized efficiency and boosted productivity for modern manufacturing. Plans, services, and integrations built for scale." },
      { property: "og:title", content: "Prodmach — The Future of Manufacturing" },
      { property: "og:description", content: "Optimized efficiency and boosted productivity for modern manufacturing." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Services />
        <Plans />
        <Integrations />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  const links = ["Home", "About", "Services", "Pricing", "Contact"];
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
          <Factory className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Prodmach</span>
      </Link>
      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <a key={l} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {l}
          </a>
        ))}
      </nav>
      <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
        Sign Up
      </button>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-20">
      <div className="text-center">
        <h1 className="mx-auto max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          The Future of Manufacturing<br />
          <span className="italic text-muted-foreground">with Latest Technology</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground md:text-base">
          Expert-led services and intelligent automation that scale with your operation — from prototype to full production.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
            Get Started <ArrowUpRight className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="font-medium">5.0</span>
            <span className="text-muted-foreground">· 2k+ reviews</span>
          </div>
        </div>
      </div>

      {/* Hero cards row */}
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-4 overflow-hidden rounded-3xl">
          <img
            src={heroFactory}
            alt="Modern manufacturing facility interior with golden hour light"
            width={1024}
            height={1024}
            className="h-72 w-full object-cover md:h-full"
          />
        </div>
        <StatCard
          className="md:col-span-3 bg-secondary"
          value="100+"
          label="Pro Equipment Operators and Engineers"
        />
        <StatCard
          className="md:col-span-3 bg-accent/30"
          value="6+"
          label="Years of Industry Experience"
          sub="1951+ Projects Delivered"
        />
        <div className="md:col-span-2 flex flex-col justify-between rounded-3xl bg-surface p-6 text-surface-foreground">
          <Sparkles className="h-5 w-5 text-accent" />
          <p className="text-sm leading-snug">
            Achieve Optimal Efficiency and Boost Productivity
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
  sub,
  className = "",
}: {
  value: string;
  label: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col justify-between rounded-3xl p-6 ${className}`}>
      <div className="text-5xl font-display text-primary" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </div>
      <div className="mt-8">
        <p className="text-sm text-primary/80">{label}</p>
        {sub && <p className="mt-2 text-xs font-medium text-primary">{sub}</p>}
      </div>
    </div>
  );
}

function Services() {
  const items = [
    { icon: Sun, title: "Production and Assembly", desc: "End-to-end assembly lines built around your product's specifications and throughput targets." },
    { icon: Settings2, title: "Custom Manufacturing", desc: "Bespoke fabrication and tooling for unique components and short-run projects." },
    { icon: Wrench, title: "Quality Control", desc: "Rigorous inspection, testing, and documentation at every stage of production." },
    { icon: Cog, title: "Process Engineering", desc: "Lean methodology and continuous improvement applied to your existing workflows." },
    { icon: ShieldCheck, title: "Compliance & Safety", desc: "Certified processes meeting ISO, OSHA, and industry-specific regulatory standards." },
    { icon: BarChart3, title: "Analytics & Reporting", desc: "Real-time dashboards tracking yield, downtime, and operational KPIs." },
  ];
  return (
    <section className="bg-surface text-surface-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl">Efficient and Integrated<br />Manufacturing Services</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-surface-foreground/70">
            Solutions assembled to fit your distinct production needs and goals.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-surface-foreground/10 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-surface p-8 transition hover:bg-surface-foreground/5">
              <Icon className="h-6 w-6 text-accent" />
              <h3 className="mt-6 text-xl text-surface-foreground">{title}</h3>
              <p className="mt-3 text-sm text-surface-foreground/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Plans() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      tagline: "For small operations getting started.",
      features: ["Up to 5 users", "Basic production tracking", "Standard reporting", "Email support"],
      featured: false,
    },
    {
      name: "Enterprise",
      price: "$99",
      tagline: "For scaling production teams.",
      features: ["Unlimited users", "Advanced automation", "Real-time analytics", "Dedicated manager", "Priority support"],
      featured: true,
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl">Tailored Plans for Your<br />Manufacturing Scale</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
          Choose a plan that fits your team size and production complexity.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-8 ${
              p.featured
                ? "bg-surface text-surface-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl">{p.name}</h3>
              <div>
                <span className="text-4xl font-display" style={{ fontFamily: "var(--font-display)" }}>{p.price}</span>
                <span className={`text-sm ${p.featured ? "text-surface-foreground/60" : "text-muted-foreground"}`}>/mo</span>
              </div>
            </div>
            <p className={`mt-2 text-sm ${p.featured ? "text-surface-foreground/70" : "text-muted-foreground"}`}>
              {p.tagline}
            </p>
            <ul className="mt-8 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className={`h-4 w-4 ${p.featured ? "text-accent" : "text-primary"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-8 w-full rounded-full py-3 text-sm font-medium transition ${
                p.featured
                  ? "bg-accent text-accent-foreground hover:opacity-90"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Integrations() {
  const logos = ["Siemens", "Bosch", "Honeywell", "ABB", "Fanuc", "Rockwell"];
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl md:text-5xl">Empowering Top Companies with Seamless Integrations</h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Connect with the tools and platforms your teams already use. Our system integrates with industry-leading hardware and software.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-3">
            {logos.map((l) => (
              <div key={l} className="grid h-28 place-items-center bg-card text-sm font-semibold tracking-tight text-muted-foreground transition hover:text-foreground">
                {l}
              </div>
            ))}
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
        <h2 className="mx-auto max-w-2xl text-4xl md:text-6xl">From Idea to Production in Days</h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-surface-foreground/70">
          Ready to transform your manufacturing? Talk to our team about your next project.
        </p>
        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition">
          Start a Project <ArrowUpRight className="h-4 w-4" />
        </button>
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
            <Factory className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold">Prodmach</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Prodmach. All rights reserved.</p>
      </div>
    </footer>
  );
}
