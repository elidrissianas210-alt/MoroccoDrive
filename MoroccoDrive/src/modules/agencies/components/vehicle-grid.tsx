import type { CarImage, Vehicle } from "@/db/schema";
import { Icon } from "./agency-portal-primitives";
import { VehicleCard } from "./vehicle-card";

export function VehicleGrid({ items, images, onAddFirst, onOpenGallery, onEdit, onDelete }: { items: Vehicle[]; images: Record<string, CarImage[]>; onAddFirst: () => void; onOpenGallery: (vehicleId: string) => void; onEdit: (vehicle: Vehicle) => void; onDelete: (vehicleId: string) => void }) {
  if (items.length === 0) return <div className="mt-5 rounded-lg border border-dashed border-[#d1d5db] bg-white px-6 py-20 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#e6f5f2] text-[#0d766e]"><Icon type="car" /></div><h3 className="mt-4 font-semibold">Your fleet is empty</h3><p className="mx-auto mt-2 max-w-xs text-sm text-[#6b7280]">Add your first vehicle to start receiving bookings.</p><button className="mt-5 text-sm font-semibold text-[#0d766e] underline underline-offset-4" onClick={onAddFirst} type="button">Add your first vehicle</button></div>;
  return <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} galleryImages={images[vehicle.id] ?? []} onOpenGallery={() => onOpenGallery(vehicle.id)} onEdit={() => onEdit(vehicle)} onDelete={() => onDelete(vehicle.id)} />)}</div>;
}
