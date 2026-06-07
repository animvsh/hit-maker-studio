import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/app/knowledge")({
  component: KnowledgePage,
});

const docs = [
  { source: "Acme Brand Guidelines", type: "PDF", used: ["ResearchBee", "PMBee"] },
  { source: "Landing Page Brief", type: "PDF", used: ["PMBee", "QABee"] },
  { source: "Client Follow-up SOP", type: "Doc", used: ["ClientBee"] },
  { source: "Northstar Services", type: "PDF", used: ["SalesBee"] },
  { source: "Acme Call Transcript", type: "Call", used: ["OpsBee"] },
];

function KnowledgePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl">Knowledge Base</h1>
      <p className="mt-1 text-sm text-muted-foreground">Business context your AI employees can use.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Source</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Used by</th><th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.source} className="border-t border-border">
                  <td className="px-4 py-3 font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{d.source}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.type}</td>
                  <td className="px-4 py-3">{d.used.join(", ")}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-accent/30 px-2 py-0.5 text-xs text-primary">Indexed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Extracted facts</p>
          <p className="mt-1 text-sm font-medium">Acme Brand Guidelines</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-lg bg-background p-3">Acme prefers warm, professional copy.</li>
            <li className="rounded-lg bg-background p-3">Emergency dental appointments should be highlighted.</li>
            <li className="rounded-lg bg-background p-3">Do not promise launch dates without client approval.</li>
            <li className="rounded-lg bg-background p-3">Client recaps should include next steps and owners.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
