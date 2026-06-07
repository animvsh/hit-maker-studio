import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/beevr/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Beevr Workspace" }] }),
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
