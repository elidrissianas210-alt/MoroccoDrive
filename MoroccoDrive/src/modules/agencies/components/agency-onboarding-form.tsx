"use client";

import { useState, type FormEvent } from "react";
import { createAgencyProfile } from "../actions/manage-agency";

export function AgencyOnboardingForm() {
  const [form, setForm] = useState({ name: "", city: "", phone: "", email: "", description: "", logoUrl: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const result = await createAgencyProfile(form);
    if (result.success) window.location.assign("/agency"); else { setMessage(result.message); setBusy(false); }
  }
  return <form onSubmit={submit} className="w-full max-w-2xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-7"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">Agency setup</p><h1 className="mt-3 text-3xl font-semibold text-white">Tell us about your agency</h1><p className="mt-2 text-slate-400">Complete your profile before adding vehicles to your fleet.</p></div>{message && <p className="rounded-lg bg-rose-400/10 p-3 text-sm text-rose-200">{message}</p>}<div className="grid gap-4 sm:grid-cols-2">{([["name","Agency name"],["city","City"],["phone","Phone"],["email","Business email"]] as const).map(([key,label]) => <label key={key} className="space-y-2 text-sm text-slate-300">{label}<input required type={key === "email" ? "email" : "text"} value={form[key]} onChange={(event) => set(key,event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400" /></label>)}</div><label className="block space-y-2 text-sm text-slate-300">Description<textarea value={form.description} onChange={(event) => set("description",event.target.value)} rows={4} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400" /></label><label className="block space-y-2 text-sm text-slate-300">Logo URL <span className="text-slate-500">(optional)</span><input type="url" value={form.logoUrl} onChange={(event) => set("logoUrl",event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400" /></label><button disabled={busy} className="w-full rounded-lg bg-sky-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60">{busy ? "Saving profile…" : "Continue to fleet"}</button></form>;
}
