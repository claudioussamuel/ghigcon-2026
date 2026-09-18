"use client";

import { useEffect, useState } from "react";
import AdminRegistrations from "../components/AdminRegistrations";

const ADMIN_PIN = "452365";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const savedPin = sessionStorage.getItem("ghig-admin-pin");
    if (savedPin === ADMIN_PIN) {
      setIsUnlocked(true);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (pin === ADMIN_PIN) {
      sessionStorage.setItem("ghig-admin-pin", ADMIN_PIN);
      setIsUnlocked(true);
      return;
    }

    setPin("");
    alert("Incorrect admin PIN.");
  };

  const handleLock = () => {
    sessionStorage.removeItem("ghig-admin-pin");
    setPin("");
    setIsUnlocked(false);
  };

  if (!isUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Restricted area
          </p>
          <h1 className="mt-3 text-3xl font-bold">Admin access</h1>
          <p className="mt-2 text-sm text-slate-300">
            This dashboard is protected from public access. Enter the admin PIN to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-200">PIN</span>
              <input
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Enter admin PIN"
                className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-3 text-lg tracking-[0.35em] text-white outline-none placeholder:text-slate-500 focus:border-slate-400"
                autoComplete="off"
                inputMode="numeric"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Unlock admin
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin
            </p>
            <h1 className="mt-1 text-3xl font-bold">GHIGCON registrations</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLock}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Lock
            </button>
            <a
              href="/"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back to registration
            </a>
          </div>
        </div>

        <AdminRegistrations />
      </div>
    </main>
  );
}
