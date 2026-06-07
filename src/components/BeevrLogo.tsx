export function BeevrLogo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-md bg-gradient-to-br from-honey to-warm text-primary-foreground font-black ${className}`}
      aria-label="Beevr"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L19 6 L19 14 L12 22 L5 14 L5 6 Z" />
        <path d="M12 7 L12 17" />
        <path d="M7 9 L17 13" />
      </svg>
    </div>
  );
}
