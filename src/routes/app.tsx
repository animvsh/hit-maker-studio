import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/chippit/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Chippit Workspace" }] }),
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
