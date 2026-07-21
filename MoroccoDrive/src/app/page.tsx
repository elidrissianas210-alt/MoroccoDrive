export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-2xl space-y-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          MoroccoDrive
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Project initialized
        </h1>
        <p className="text-base leading-7 text-slate-300 sm:text-lg">
          Next.js, React, TypeScript, Tailwind CSS, and ESLint are ready for the
          first implementation task.
        </p>
      </section>
    </main>
  );
}
