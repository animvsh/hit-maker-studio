import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Database,
  FileText,
  Inbox,
  MessageSquare,
  PhoneCall,
  Plug,
  Search,
  Sheet,
  Sparkles,
} from "lucide-react";
import { getChippitDashboard } from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/knowledge")({
  loader: () => getChippitDashboard(),
  component: KnowledgePage,
});

const platforms = [
  ["Gmail", "Customer replies and follow-ups", "Connected", Inbox],
  ["Slack", "Internal coordination", "Connected", MessageSquare],
  ["Google Drive", "Policies and operating docs", "Connected", FileText],
  ["Google Calendar", "Scheduling and reminders", "Connected", CalendarDays],
  ["Google Sheets", "Trackers and customer lists", "Connected", Sheet],
  ["LiveKit", "Call transcripts and voice workflows", "Connected", PhoneCall],
  ["Notion", "Team wiki and project docs", "Ready", BookOpen],
  ["Airtable", "Operations database", "Ready", Database],
  ["Intercom", "Support inbox", "Ready", MessageSquare],
  ["HubSpot", "CRM and lead context", "Ready", Plug],
  ["Linear", "Engineering tasks", "Ready", CheckCircle2],
  ["Zendesk", "Ticket history", "Ready", Inbox],
] as const;

function KnowledgePage() {
  const { knowledgeSources } = Route.useLoaderData();
  const facts = knowledgeSources.filter((source) => source.extracted_fact).slice(0, 5);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Knowledge Base
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl">Connections and company memory</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Fake demo connections that make the platform feel wired into the tools your AI employees
            would actually use.
          </p>
        </div>
        <div className="smooth-card flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          Search memory, tools, policies...
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {platforms.map(([name, description, status, Icon]) => (
          <div key={name} className="clickable-card rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                  status === "Connected"
                    ? "bg-accent/30 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="mt-4 font-medium">{name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="smooth-card rounded-3xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Indexed sources</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {knowledgeSources.map((source) => (
              <div key={source.id} className="clickable-card rounded-2xl bg-background p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <p className="font-medium">{source.source}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{source.source_type}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {source.used_by.map((employee) => (
                    <span
                      key={employee}
                      className="rounded-full bg-secondary px-2 py-1 text-[10px]"
                    >
                      {employee}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="smooth-card rounded-3xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Chippit learned</p>
          <div className="mt-4 space-y-3">
            {facts.map((fact) => (
              <div key={fact.id} className="rounded-2xl bg-background p-4 text-sm">
                <Sparkles className="mb-3 h-4 w-4 text-accent" />
                {fact.extracted_fact}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
