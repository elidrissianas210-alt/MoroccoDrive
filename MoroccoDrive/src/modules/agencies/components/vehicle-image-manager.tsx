"use client";

import { useState, type ChangeEvent } from "react";
import { deleteVehicleImage, uploadVehicleImages } from "../actions/manage-images";
import type { CarImage } from "../types";

interface VehicleImageManagerProps {
  vehicleId: string;
  images: CarImage[];
  coverImageUrl?: string | null;
  onClose: () => void;
  onImagesChange: (images: CarImage[]) => void;
}

export function VehicleImageManager({ vehicleId, images, coverImageUrl, onClose, onImagesChange }: VehicleImageManagerProps) {
  const [items, setItems] = useState(images);
  const [selected, setSelected] = useState<CarImage | null>(images[0] ?? null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function updateItems(nextItems: CarImage[]) {
    setItems(nextItems);
    onImagesChange(nextItems);
    setSelected((current) => current && nextItems.some((item) => item.id === current.id) ? current : nextItems[0] ?? null);
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;
    const data = new FormData();
    Array.from(files).forEach((file) => data.append("images", file));
    setBusy(true);
    setMessage("");
    const result = await uploadVehicleImages(vehicleId, data);
    if (result.success && result.data) updateItems([...items, ...(result.data as CarImage[])]);
    else setMessage(result.message ?? "The request could not be completed.");
    setBusy(false);
    event.target.value = "";
  }

  async function remove(id: string) {
    setBusy(true);
    setMessage("");
    const result = await deleteVehicleImage(id);
    if (result.success) updateItems(items.filter((image) => image.id !== id));
    else setMessage(result.message ?? "The request could not be completed.");
    setBusy(false);
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221f]/70 p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="vehicle-gallery-title">
    <div className="flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgba(0,0,0,.22)]">
      <div className="flex items-start justify-between gap-4 border-b border-[#edf0ed] px-5 py-4 sm:px-7">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#0d766e]">Vehicle photos</p><h2 id="vehicle-gallery-title" className="mt-1 font-[family-name:var(--font-jakarta)] text-xl font-semibold text-[#18201e]">Gallery <span className="text-sm font-medium text-[#89938f]">{items.length} {items.length === 1 ? "photo" : "photos"}</span></h2></div>
        <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-[#6b7772] transition hover:bg-[#f3f5f3] hover:text-[#18201e]" aria-label="Close gallery">x</button>
      </div>
      <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-lg bg-[#f1f4f2] lg:min-h-0">{selected?.publicUrl || coverImageUrl ? <img src={selected?.publicUrl || coverImageUrl || ""} alt="Selected vehicle photo" className="max-h-[52vh] w-full object-contain" /> : <div className="text-center text-sm text-[#89938f]"><p className="text-3xl">+</p><p className="mt-2">No photos uploaded yet</p></div>}</div>
        <aside className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#89938f]">All photos</p><label className="cursor-pointer text-xs font-semibold text-[#0d766e] hover:text-[#045c57]">{busy ? "Working..." : "Add photos"}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={upload} className="sr-only" /></label></div>
          {message && <p className="mt-3 rounded-md bg-[#fff2f1] px-3 py-2 text-xs font-medium text-[#9b625f]" role="alert">{message}</p>}
          <div className="mt-3 grid grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 lg:grid-cols-2">{items.map((item, index) => <div key={item.id} className="group relative aspect-[4/3] overflow-hidden rounded-md bg-[#edf0ed]"><button type="button" onClick={() => setSelected(item)} className="h-full w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0d9488]" aria-label={`View vehicle photo ${index + 1}`}>{item.publicUrl ? <img src={item.publicUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[10px] text-[#89938f]">No preview</span>}</button>{index === 0 && <span className="absolute bottom-1 left-1 rounded bg-[#18201e]/80 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">Cover</span>}<button type="button" onClick={() => remove(item.id)} disabled={busy} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-sm text-[#b42318] shadow-sm group-hover:flex disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Delete vehicle photo ${index + 1}`}>x</button></div>)}</div>
          {!items.length && <label className="mt-3 flex cursor-pointer items-center justify-center rounded-md border border-dashed border-[#b9c6c1] bg-[#fbfcfa] px-4 py-5 text-xs font-semibold text-[#0d766e]">Add the first photo<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={upload} className="sr-only" /></label>}
        </aside>
      </div>
    </div>
  </div>;
}