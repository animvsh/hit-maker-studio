import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/chippit/onboarding")({
  validateSearch: (search) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/app",
      search: { idea: search.q || "I have a business" },
    });
  },
});
