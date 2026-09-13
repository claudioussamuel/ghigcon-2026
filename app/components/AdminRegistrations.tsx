"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";

type RegistrationRecord = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  registrationType?: string;
  amount?: number;
  paid?: boolean;
  payed?: boolean;
  createdAt?: string;
};

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadRegistrations() {
      try {
        const registrationsQuery = query(
          collection(db, "ghigcon-2026"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(registrationsQuery);
        const rows = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Record<string, unknown>),
        })) as RegistrationRecord[];

        if (isMounted) {
          setRegistrations(rows);
        }
      } catch (err) {
        console.error("Failed to load registrations:", err);
        if (isMounted) {
          setError("Unable to load registrants right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRegistrations = registrations.filter((person) => {
    const fullName = `${person.firstName || ""} ${person.lastName || ""}`.trim().toLowerCase();
    const searchableText = [fullName, person.email || "", person.companyName || "", person.registrationType || ""]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(search.toLowerCase().trim());
    const paid = Boolean(person.paid || person.payed);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && paid) ||
      (statusFilter === "unpaid" && !paid);

    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    const header = [
      "Name",
      "Email",
      "Registration Type",
      "Company",
      "Amount",
      "Paid",
      "Created At",
    ];

    const rows = filteredRegistrations.map((person) => {
      const name = `${person.firstName || ""} ${person.lastName || ""}`.trim();
      const paid = person.paid || person.payed ? "Yes" : "No";
      const amount = typeof person.amount === "number" ? person.amount : 0;
      const createdAt = person.createdAt ? new Date(person.createdAt).toISOString() : "";

      return [
        name,
        person.email || "",
        person.registrationType || "",
        person.companyName || "",
        String(amount),
        paid,
        createdAt,
      ];
    });

    const csvContent = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ghigcon-registrations.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p className="text-sm text-slate-600">Loading registered attendees...</p>;
  }

  if (error) {
    return <p className="text-sm font-medium text-red-600">{error}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Dashboard
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Registered attendees</h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid only</option>
            <option value="unpaid">Unpaid only</option>
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span>Showing {filteredRegistrations.length} of {registrations.length}</span>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          {registrations.length} total
        </span>
      </div>

      {filteredRegistrations.length === 0 ? (
        <div className="p-6 text-sm text-slate-600">No registrations match your current filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Paid</th>
                <th className="px-4 py-3 font-semibold">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredRegistrations.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {person.firstName || ""} {person.lastName || ""}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{person.email || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {person.registrationType || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {person.companyName || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {typeof person.amount === "number" ? `GHS ${person.amount}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        person.paid || person.payed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {person.paid || person.payed ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {person.createdAt ? new Date(person.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
