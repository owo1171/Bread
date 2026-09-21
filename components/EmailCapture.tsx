"use client";

import { useState } from "react";

interface EmailCaptureProps {
  /** label above the field */
  label: string;
  /** button text */
  button?: string;
  /** file name shown in the confirmation line */
  docName?: string;
}

/**
 * Single-field lead capture. There is no backend yet: the address is kept in
 * localStorage and the UI confirms immediately, so the funnel can be measured
 * before wiring a provider (MailerLite / ConvertKit / Beehiiv).
 */
export default function EmailCapture({
  label,
  button = "Email it to me",
  docName = "payoff plan",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setState("error");
      return;
    }
    try {
      const key = "tool-site:leads";
      const list = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
      list.push(value);
      localStorage.setItem(key, JSON.stringify(list.slice(-50)));
    } catch {
      /* storage disabled — still show the confirmation */
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
        Check your inbox for the {docName} — no newsletter you cannot quit.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <label htmlFor="lead-email" className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="lead-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          className={`h-12 flex-1 rounded-xl border bg-white px-3 ${
            state === "error" ? "border-red-500" : "border-slate-300"
          }`}
          aria-invalid={state === "error"}
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-blue-700 px-6 font-semibold text-white active:bg-blue-800"
        >
          {button}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-1 text-sm text-red-600">That email does not look right.</p>
      )}
    </form>
  );
}
