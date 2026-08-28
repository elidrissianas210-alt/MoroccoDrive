import type { ReactNode } from "react";

type LoadingStateProps = {
  label?: ReactNode;
};

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div
      aria-label={typeof label === "string" ? label : "Loading"}
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-24 flex-col items-center justify-center gap-3 text-sm text-slate-400"
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-6 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400"
      />
      <span>{label}</span>
    </div>
  );
}
