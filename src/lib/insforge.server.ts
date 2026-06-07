import { readFileSync } from "node:fs";
import process from "node:process";

import { createAdminClient } from "@insforge/sdk";

type ProjectConfig = {
  oss_host?: string;
  api_key?: string;
};

function readLinkedProject(): ProjectConfig {
  try {
    return JSON.parse(readFileSync(".insforge/project.json", "utf8")) as ProjectConfig;
  } catch {
    return {};
  }
}

export function getInsforgeAdmin() {
  const linkedProject = readLinkedProject();
  const baseUrl = process.env.INSFORGE_URL ?? linkedProject.oss_host;
  const apiKey = process.env.INSFORGE_API_KEY ?? linkedProject.api_key;

  if (!baseUrl || !apiKey) {
    throw new Error("Missing INSFORGE_URL or INSFORGE_API_KEY for Chippit backend access.");
  }

  return createAdminClient({ baseUrl, apiKey });
}
