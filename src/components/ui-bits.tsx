import type { ReactNode } from "react";

export function StatusPill({
  tone = "neutral",
  children,
  pulse = false,
}: {
  tone?: "neutral" | "success" | "warn" | "danger" | "ai" | "honey";
  children: ReactNode;
  pulse?: boolean;
}) {
  const map: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground border-border",
    success: "bg-success/15 text-success border-success/30",
    warn: "bg-warm/15 text-warm border-warm/30",
    danger: "bg-danger/15 text-danger border-danger/30",
    ai: "bg-ai/15 text-ai border-ai/30",
    honey: "bg-honey/15 text-honey border-honey/30",
  };
  const dotMap: Record<string, string> = {
    neutral: "bg-muted-foreground",
    success: "bg-success",
    warn: "bg-warm",
    danger: "bg-danger",
    ai: "bg-ai",
    honey: "bg-honey",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium border rounded-full ${map[tone]}`}>
      {pulse && <span className={`h-1.5 w-1.5 rounded-full ${dotMap[tone]} animate-pulse`} />}
      {!pulse && <span className={`h-1.5 w-1.5 rounded-full ${dotMap[tone]}`} />}
      {children}
    </span>
  );
}

export function Avatar({ name, tone = "honey", size = 32 }: { name: string; tone?: "honey" | "ai" | "success" | "warm" | "danger"; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const grad: Record<string, string> = {
    honey: "from-honey to-warm",
    ai: "from-ai to-honey",
    success: "from-success to-honey",
    warm: "from-warm to-danger",
    danger: "from-danger to-warm",
  };
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`shrink-0 rounded-full grid place-items-center font-bold text-primary-foreground bg-gradient-to-br ${grad[tone]}`}
    >
      {initials}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface ${className}`}>{children}</div>
  );
}
