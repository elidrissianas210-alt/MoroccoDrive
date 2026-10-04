"use client";

export default function AgencyError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#fbfbfa] px-6"><div className="max-w-md rounded-lg border border-[#e5e7eb] bg-white p-8 text-center"><h2 className="font-[family-name:var(--font-jakarta)] text-xl font-semibold text-[#111827]">Unable to load your fleet</h2><p className="mt-2 text-sm text-[#6b7280]">Something went wrong while loading the agency portal.</p><button className="mt-5 rounded-md bg-[#0d9488] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/25" onClick={reset} type="button">Try again</button></div></main>;
}
