import { createServerFn } from "@tanstack/react-start";
import { readFileSync } from "node:fs";
import { z } from "zod";

type MiniMaxChoice = {
  message?: {
    content?: string;
  };
};

type MiniMaxResponse = {
  choices?: MiniMaxChoice[];
};

const fallbackRevision = [
  "Thanks so much for talking with Chippit today. We are excited to help your team turn busy customer conversations into organized, approval-safe work.",
  "Chippit can listen to calls, create tasks, monitor inbox follow-ups, and draft customer responses while keeping humans in control of external messages.",
  "Next, we will prepare a simple setup plan for SupportBee, InboxBee, ProjectBee, PolicyBee, OpsBee, and ManagerBee so you can review exactly what each AI employee is allowed to do.",
];

function readLocalEnv(name: string) {
  try {
    const text = readFileSync(".env.local", "utf8");
    const line = text.split(/\r?\n/).find((entry) => entry.trim().startsWith(`${name}=`));
    return line?.slice(name.length + 1).trim();
  } catch {
    return undefined;
  }
}

function splitDraft(content: string) {
  return content
    .split(/\n{2,}|\n-\s+|\n\d+\.\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export const generateChippitRevision = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string().min(1),
      risk: z.string().min(1),
      draft: z.array(z.string()).min(1),
      instruction: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.MINIMAX_API_KEY ?? readLocalEnv("MINIMAX_API_KEY");
    const model = process.env.MINIMAX_MODEL ?? readLocalEnv("MINIMAX_MODEL") ?? "MiniMax-M2.7";

    if (!apiKey) {
      return { draft: fallbackRevision, provider: "fallback" };
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const abortController = new AbortController();
      timeout = setTimeout(() => abortController.abort(), 15000);
      const response = await fetch("https://api.minimax.io/v1/text/chatcompletion_v2", {
        method: "POST",
        signal: abortController.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              name: "Chippit",
              content:
                "You are ProjectBee in Chippit. Rewrite approval-gated customer follow-up drafts. Keep it concise, warm, accurate, and do not promise scope, timing, or sending without human approval.",
            },
            {
              role: "user",
              name: "operator",
              content: [
                `Approval: ${data.title}`,
                `Risk: ${data.risk}`,
                `Instruction: ${data.instruction}`,
                "Draft:",
                data.draft.join("\n\n"),
                "Return 2-4 short paragraphs only.",
              ].join("\n"),
            },
          ],
          temperature: 0.4,
          max_tokens: 500,
        }),
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return { draft: fallbackRevision, provider: "fallback" };
      }

      const payload = (await response.json()) as MiniMaxResponse;
      const content = payload.choices?.[0]?.message?.content;
      const draft = content ? splitDraft(content) : [];

      return { draft: draft.length ? draft : fallbackRevision, provider: "minimax" };
    } catch {
      if (timeout) clearTimeout(timeout);
      return { draft: fallbackRevision, provider: "fallback" };
    }
  });
