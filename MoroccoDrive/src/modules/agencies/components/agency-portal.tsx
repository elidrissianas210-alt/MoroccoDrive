"use client";

import { useMemo, useState, type FormEvent } from "react";
import { createVehicle, deleteVehicle, updateVehicle } from "../actions/manage-vehicles";
import type { Agency, CarImage, Vehicle } from "@/db/schema";
import type { VehicleInput } from "../validators";
import { VehicleImageManager } from "./vehicle-image-manager";
import { AgencySidebar } from "./agency-sidebar";
import { FleetHeader } from "./fleet-header";
import { FleetFilters } from "./fleet-filters";
import { VehicleGrid } from "./vehicle-grid";
import { VehicleFormDialog, initialVehicle } from "./vehicle-form-dialog";
import { Stat } from "./agency-portal-primitives";

export function AgencyPortal({ agency, vehicles, initialImages }: { agency: Agency; vehicles: Vehicle[]; initialImages: Record<string, CarImage[]> }) {
  const [items, setItems] = useState(vehicles);
  const [images, setImages] = useState(initialImages);
  const [activeGalleryVehicleId, setActiveGalleryVehicleId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...initialVehicle });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All vehicles");
  const [sort, setSort] = useState("Recently added");
  const available = items.filter((item) => item.isAvailable).length;
  const average = items.length ? Math.round(items.reduce((sum, item) => sum + item.dailyPriceMad, 0) / items.length) : 0;
  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesQuery = (item.make + " " + item.model + " " + item.registrationNumber).toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All vehicles" || (filter === "Available" ? item.isAvailable : !item.isAvailable));
  }).sort((a, b) => sort === "Price: low to high" ? a.dailyPriceMad - b.dailyPriceMad : sort === "Price: high to low" ? b.dailyPriceMad - a.dailyPriceMad : 0), [filter, items, query, sort]);
  const set = (key: keyof VehicleInput, value: string | number | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const closeDrawer = () => { setDrawer(false); setEditingId(null); setForm({ ...initialVehicle }); setMessage(""); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const result = editingId ? await updateVehicle(editingId, form) : await createVehicle(form);
    if (!result.success) { setMessage(result.message ?? "The request could not be completed."); return; }
    if (result.data) setItems((current) => editingId ? current.map((item) => item.id === editingId ? result.data as Vehicle : item) : [result.data as Vehicle, ...current]);
    setMessage(editingId ? "Vehicle updated successfully." : "Vehicle added successfully.");
    if (!editingId) closeDrawer();
  }
  function edit(vehicle: Vehicle) {
    setEditingId(vehicle.id); setForm({ make: vehicle.make, model: vehicle.model, year: vehicle.year, category: vehicle.category as VehicleInput["category"], transmission: vehicle.transmission as VehicleInput["transmission"], fuelType: vehicle.fuelType as VehicleInput["fuelType"], seats: vehicle.seats, dailyPriceMad: vehicle.dailyPriceMad, registrationNumber: vehicle.registrationNumber, imageUrl: vehicle.imageUrl ?? "", isAvailable: vehicle.isAvailable }); setDrawer(true);
  }
  async function remove(id: string) {
    if (!window.confirm("Remove this vehicle from your fleet?")) return;
    const result = await deleteVehicle(id);
    if (result.success) setItems((current) => current.filter((item) => item.id !== id)); else setMessage(result.message ?? "The request could not be completed.");
  }

  return <div className="flex min-h-screen bg-[#fbfbfa] text-[#111827] lg:-mx-8 lg:-my-6">
    <AgencySidebar agency={agency} mobileNav={mobileNav} onClose={() => setMobileNav(false)} />
    <main className="min-w-0 flex-1"><FleetHeader onOpenNavigation={() => setMobileNav(true)} onAddVehicle={() => { setEditingId(null); setForm({ ...initialVehicle }); setDrawer(true); }} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><div className="mb-7"><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#0d766e]">{agency.name}</p><h1 className="mt-2 font-[family-name:var(--font-jakarta)] text-3xl font-bold tracking-[-.045em] sm:text-4xl">Fleet</h1><p className="mt-2 text-sm text-[#6b7280]">Manage your vehicle inventory, registrations, and availability.</p></div>
        <section aria-label="Fleet summary" className="grid gap-4 sm:grid-cols-3"><Stat label="Total vehicles" value={items.length} detail="Vehicles in your fleet" icon="car" tone="bg-[#e6f5f2] text-[#0d766e]" /><Stat label="Available now" value={available} detail="Ready to receive bookings" icon="check" tone="bg-[#ecfdf5] text-[#059669]" /><Stat label="Average daily rate" value={average.toLocaleString("en-MA") + " MAD"} detail="Across your current listings" icon="chart" tone="bg-[#fffbeb] text-[#b45309]" /></section>
        <section className="mt-8"><div className="flex flex-col gap-4 border-b border-[#e5e7eb] pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#6b7280]">Vehicle inventory</p><h2 className="mt-1 font-[family-name:var(--font-jakarta)] text-xl font-semibold">Your vehicles <span className="text-sm font-medium text-[#9ca3af]">({filteredItems.length})</span></h2></div><FleetFilters query={query} filter={filter} sort={sort} onQueryChange={setQuery} onFilterChange={setFilter} onSortChange={setSort} /></div>
          {items.length > 0 && filteredItems.length === 0 ? <div className="mt-5 rounded-lg border border-[#e5e7eb] bg-white px-6 py-16 text-center text-sm text-[#6b7280]">No vehicles match your current search.</div> : <VehicleGrid items={filteredItems} images={images} onAddFirst={() => setDrawer(true)} onOpenGallery={setActiveGalleryVehicleId} onEdit={edit} onDelete={remove} />}
          {activeGalleryVehicleId && <VehicleImageManager vehicleId={activeGalleryVehicleId} images={images[activeGalleryVehicleId] ?? []} coverImageUrl={items.find((item) => item.id === activeGalleryVehicleId)?.imageUrl} onClose={() => setActiveGalleryVehicleId(null)} onImagesChange={(nextImages) => setImages((current) => ({ ...current, [activeGalleryVehicleId]: nextImages }))} />}
        </section></div></main>
    <VehicleFormDialog open={drawer} editing={Boolean(editingId)} form={form} message={message} onSet={set} onSubmit={submit} onClose={closeDrawer} />
  </div>;
}
