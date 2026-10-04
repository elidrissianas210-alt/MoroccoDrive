import Link from "next/link";
import { Icon } from "./agency-portal-primitives";

export function FleetHeader({ onOpenNavigation, onAddVehicle }: { onOpenNavigation: () => void; onAddVehicle: () => void }) {
  return <header className="sticky top-0 z-20 border-b border-[#e5e7eb]/90 bg-white/95 backdrop-blur-xl"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"><button className="lg:hidden" onClick={onOpenNavigation} type="button" aria-label="Open navigation"><Icon type="menu" /></button><div><p className="text-sm font-semibold">Fleet</p><p className="hidden text-xs text-[#6b7280] sm:block">Manage your vehicle inventory</p></div><div className="flex items-center gap-3"><Link className="hidden text-xs font-medium text-[#6b7280] hover:text-[#0d766e] sm:block" href="/">View marketplace</Link><button className="inline-flex items-center gap-2 rounded-md bg-[#0d9488] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/25" onClick={onAddVehicle} type="button"><Icon type="plus" />Add vehicle</button></div></div></header>;
}
