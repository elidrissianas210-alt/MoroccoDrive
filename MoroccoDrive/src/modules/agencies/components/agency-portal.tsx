"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { createVehicle, deleteVehicle, updateVehicle } from "../actions/manage-vehicles";
import { listVehicleImages } from "../actions/manage-images";
import type { Agency, CarImage, Vehicle } from "../types";
import type { VehicleInput } from "../validators";
import { VehicleImageManager } from "./vehicle-image-manager";

const initial: VehicleInput = { make: "", model: "", year: new Date().getFullYear(), category: "SUV", transmission: "Automatic", fuelType: "Petrol", seats: 5, dailyPriceMad: 300, registrationNumber: "", imageUrl: "", isAvailable: true };

function Glyph({ children }: { children: React.ReactNode }) {
  return <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-sm font-bold text-teal-700">{children}</span>;
}

export function AgencyPortal({ agency, vehicles }: { agency: Agency; vehicles: Vehicle[] }) {
  const [items, setItems] = useState(vehicles);
  const [images, setImages] = useState<Record<string, CarImage[]>>({});
  const [form, setForm] = useState({ ...initial });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all(items.map(async (vehicle) => [vehicle.id, await listVehicleImages(vehicle.id)] as const)).then((entries) => {
      if (active) setImages(Object.fromEntries(entries));
    });
    return () => { active = false; };
  }, [items]);

  const available = items.filter((item) => item.isAvailable).length;
  const averagePrice = items.length ? Math.round(items.reduce((total, item) => total + item.dailyPriceMad, 0) / items.length) : 0;
  const set = (key: string, value: string | number | boolean) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const result = editingId ? await updateVehicle(editingId, form) : await createVehicle(form);
    if (!result.success) { setMessage(result.message ?? "The request could not be completed."); return; }
    if (result.data) setItems((current) => editingId ? current.map((item) => item.id === editingId ? result.data as Vehicle : item) : [result.data as Vehicle, ...current]);
    setForm({ ...initial });
    setEditingId(null);
    setMessage(editingId ? "Vehicle updated successfully." : "Vehicle added successfully.");
  }

  function edit(vehicle: Vehicle) {
    setEditingId(vehicle.id);
    setForm({ make: vehicle.make, model: vehicle.model, year: vehicle.year, category: vehicle.category as VehicleInput["category"], transmission: vehicle.transmission as VehicleInput["transmission"], fuelType: vehicle.fuelType as VehicleInput["fuelType"], seats: vehicle.seats, dailyPriceMad: vehicle.dailyPriceMad, registrationNumber: vehicle.registrationNumber, imageUrl: vehicle.imageUrl ?? "", isAvailable: vehicle.isAvailable });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this vehicle from your fleet?")) return;
    const result = await deleteVehicle(id);
    if (result.success) setItems((current) => current.filter((item) => item.id !== id));
    else setMessage(result.message ?? "The request could not be completed.");
  }

  const nav = ["Overview", "Fleet", "Bookings", "Customers", "Analytics"];
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:w-64">
        <div className="mb-8 flex items-center gap-3 px-2"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">M</div><div><p className="font-semibold tracking-tight text-slate-900">MoroccoDrive</p><p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Agency portal</p></div></div>
        <nav aria-label="Agency navigation" className="space-y-1">{nav.map((label, index) => <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${index === 1 ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`} type="button"><Glyph>{["⌂", "▣", "◷", "♙", "↗"][index]}</Glyph>{label}{index > 1 && <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-300">Soon</span>}</button>)}</nav>
        <div className="mt-8 border-t border-slate-100 pt-5"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900" type="button"><Glyph>⚙</Glyph>Settings</button></div>
        <div className="mt-8 rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs font-medium text-teal-300">Need a hand?</p><p className="mt-1 text-sm leading-5 text-slate-300">Our support team is here for your agency.</p><button className="mt-3 text-xs font-semibold text-white underline underline-offset-4" type="button">Contact support</button></div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="mb-2 text-sm font-medium text-teal-700">Good morning, {agency.name}</p><h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">Your fleet, at a glance.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Keep your vehicles accurate and ready to welcome your next customer.</p></div><Link className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-teal-200 hover:text-teal-700" href="/">Back to marketplace <span aria-hidden="true">→</span></Link></header>
        <section aria-label="Fleet summary" className="mb-6 grid gap-3 sm:grid-cols-3">{[["Total vehicles", items.length, "In your fleet"], ["Available now", available, "Ready to book"], ["Average daily rate", `${averagePrice.toLocaleString("en-MA")} MAD`, "Across active listings"]].map(([label, value, detail], index) => <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md" key={String(label)}><div className="flex items-start justify-between"><p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500">{index === 0 ? "#" : index === 1 ? "✓" : "↗"}</span></div><p className={`mt-2 text-3xl font-semibold tracking-tight ${index === 1 ? "text-teal-700" : "text-slate-950"}`}>{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>)}</section>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-semibold text-slate-950">Fleet overview</h2><p className="mt-1 text-xs text-slate-500">Manage the vehicles visible on your marketplace profile.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{items.length} {items.length === 1 ? "listing" : "listings"}</span></div>{items.length === 0 ? <div className="p-12 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">▣</div><h3 className="mt-4 font-semibold text-slate-900">Your fleet is empty</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">Add your first vehicle to start receiving bookings.</p></div> : <div className="divide-y divide-slate-100">{items.map((vehicle) => <article key={vehicle.id} className="group p-5 transition hover:bg-slate-50/70 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4"><div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-inner bg-slate-100 text-slate-400">{vehicle.imageUrl ? <img alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" src={vehicle.imageUrl} /> : "▣"}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-slate-900">{vehicle.make} {vehicle.model}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${vehicle.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{vehicle.isAvailable ? "Available" : "Unavailable"}</span></div><p className="mt-1 text-xs text-slate-500">{vehicle.year} <span className="mx-1 text-slate-300">·</span> {vehicle.transmission} <span className="mx-1 text-slate-300">·</span> {vehicle.fuelType} <span className="mx-1 text-slate-300">·</span> {vehicle.seats} {vehicle.seats === 1 ? "seat" : "seats"}</p><p className="mt-1 text-[11px] text-slate-400">{vehicle.registrationNumber}</p></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><p className="font-semibold text-slate-900">{vehicle.dailyPriceMad.toLocaleString("en-MA")} <span className="text-xs font-normal text-slate-400">MAD/day</span></p><button className="text-sm font-medium text-teal-700 hover:text-teal-900" onClick={() => edit(vehicle)} type="button">Edit</button><button className="text-sm font-medium text-rose-600 hover:text-rose-800" onClick={() => remove(vehicle.id)} type="button">Delete</button></div></div><VehicleImageManager vehicleId={vehicle.id} images={images[vehicle.id] ?? []} /></article>)}</div>}</section>
          <form onSubmit={submit} className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-6"><div className="flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.14em] text-teal-700">Fleet management</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{editingId ? "Edit vehicle" : "Add a vehicle"}</h2></div><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">+</div></div>{message && <p className="mt-5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700" role="status">{message}</p>}<div className="mt-4 grid grid-cols-2 gap-2.5">{([[ "make", "Make" ], [ "model", "Model" ], [ "year", "Year" ], [ "seats", "Seats" ], [ "dailyPriceMad", "MAD per day" ], [ "registrationNumber", "Registration" ]] as const).map(([key, label]) => <label key={key} className="space-y-1.5 text-xs font-medium text-slate-600"><span>{label}</span><input required value={String(form[key])} onChange={(event) => set(key, ["year", "seats", "dailyPriceMad"].includes(key) ? Number(event.target.value) : event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" /></label>)}</div><label className="mt-3 block space-y-1.5 text-xs font-medium text-slate-600"><span>Category</span><select value={form.category} onChange={(event) => set("category", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"><option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Luxury</option><option>Electric</option><option>Van</option></select></label><div className="mt-2.5 grid grid-cols-2 gap-2.5"><label className="space-y-1.5 text-xs font-medium text-slate-600"><span>Transmission</span><select value={form.transmission} onChange={(event) => set("transmission", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"><option>Automatic</option><option>Manual</option></select></label><label className="space-y-1.5 text-xs font-medium text-slate-600"><span>Fuel type</span><select value={form.fuelType} onChange={(event) => set("fuelType", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select></label></div><label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600"><input className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" type="checkbox" checked={form.isAvailable} onChange={(event) => set("isAvailable", event.target.checked)} />Available for bookings</label><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20" type="submit">{editingId ? "Save changes" : "Add vehicle"} <span aria-hidden="true">→</span></button>{editingId && <button className="mt-3 w-full text-sm font-medium text-slate-400 hover:text-slate-700" onClick={() => { setEditingId(null); setForm({ ...initial }); }} type="button">Cancel editing</button>}</form>
        </div>
      </div>
    </div>
  );
}

