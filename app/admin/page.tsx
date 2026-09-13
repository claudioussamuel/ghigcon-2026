import AdminRegistrations from "../components/AdminRegistrations";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin
            </p>
            <h1 className="mt-1 text-3xl font-bold">GHIGCON registrations</h1>
          </div>
          <a
            href="/"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to registration
          </a>
        </div>

        <AdminRegistrations />
      </div>
    </main>
  );
}
