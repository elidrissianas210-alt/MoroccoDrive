import { useId, type ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <section
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-6 py-12 text-center"
    >
      <h2 id={titleId} className="text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {description ? (
        <p id={descriptionId} className="max-w-md text-sm leading-6 text-slate-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </section>
  );
}