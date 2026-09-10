"use client";

import { useState, type FormEvent } from "react";
import {
  loginAgency,
  registerAgency,
  requestAgencyPasswordReset,
  updateAgencyPassword,
} from "../actions/agency-auth";

export function AgencyAuthForm({
  mode,
}: {
  mode: "login" | "register" | "forgot" | "reset";
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result =
      mode === "login"
        ? await loginAgency({ email, password })
        : mode === "register"
          ? await registerAgency({ email, password })
          : mode === "forgot"
            ? await requestAgencyPasswordReset({ email })
            : await updateAgencyPassword({ password });
    setMessage(result.message);
    setBusy(false);
  }
  const title = {
    login: "Welcome back",
    register: "Create an agency account",
    forgot: "Reset your password",
    reset: "Choose a new password",
  }[mode];
  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-7"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
          MoroccoDrive for agencies
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">{title}</h1>
      </div>
      {mode !== "reset" && (
        <label className="block space-y-2 text-sm text-slate-300">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400"
          />
        </label>
      )}
      {mode !== "forgot" && (
        <label className="block space-y-2 text-sm text-slate-300">
          Password
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400"
          />
        </label>
      )}
      {message && (
        <p className="rounded-lg bg-sky-400/10 p-3 text-sm text-sky-200">
          {message}
        </p>
      )}
      <button
        disabled={busy}
        className="w-full rounded-lg bg-sky-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60"
      >
        {busy
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : mode === "register"
              ? "Create account"
              : mode === "forgot"
                ? "Send reset email"
                : "Update password"}
      </button>
      <p className="text-center text-sm text-slate-400">
        <a
          href={mode === "login" ? "/agency/register" : "/agency/login"}
          className="text-sky-300 hover:text-white"
        >
          {mode === "login" ? "Create an agency account" : "Back to sign in"}
        </a>
      </p>
    </form>
  );
}
