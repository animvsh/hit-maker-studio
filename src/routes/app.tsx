import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/chippit/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Chippit workspace" }] }),
  component: AppRouteShell,
});

function AppRouteShell() {
  const location = useRouterState({ select: (state) => state.location });
  const isFullScreenOnboarding = location.pathname === "/app" && Boolean(location.search.idea);

  if (isFullScreenOnboarding) {
    return <Outlet />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
