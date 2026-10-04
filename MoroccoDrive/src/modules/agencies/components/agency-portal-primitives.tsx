export type IconType = "car" | "plus" | "menu" | "close" | "check" | "chart" | "search" | "image" | "logout";

export function Icon({ type }: { type: IconType }) {
  const paths: Record<IconType, string> = { car: "m4 12 2-5h12l2 5M3 12h18v5H3M7 17h.01M17 17h.01", plus: "M12 5v14M5 12h14", menu: "M4 7h16M4 12h16M4 17h16", close: "M6 6l12 12M18 6 6 18", check: "M5 12l4 4L19 6", chart: "M4 19V5M4 19h17M7 15l3-4 3 2 5-7", search: "m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z", image: "m4 16 4-4 3 3 3-4 6 6M4 19h16V5H4v14ZM8 9h.01", logout: "M9 7V5h10v14H9v-2M12 12H3m0 0 3-3m-3 3 3 3" };
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24"><path d={paths[type]} /></svg>;
}

export function Stat({ label, value, detail, icon, tone }: { label: string; value: string | number; detail: string; icon: "car" | "check" | "chart"; tone: string }) {
  return <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.04)]"><div className="flex items-start justify-between"><p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#6b7280]">{label}</p><span className={"flex h-8 w-8 items-center justify-center rounded-md " + tone}><Icon type={icon} /></span></div><p className="mt-4 font-[family-name:var(--font-jakarta)] text-[28px] font-semibold tracking-[-.04em] text-[#111827]">{value}</p><p className="mt-1 text-xs text-[#6b7280]">{detail}</p></div>;
}
