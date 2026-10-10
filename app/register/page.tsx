import Image from "next/image";
import RegistrationForm from "../components/RegistrationForm";

const REGISTRATION_OPEN = false;

export const metadata = {
  title: 'Ghicon',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-600 to-blue-900 font-sans text-white">
      <main className="w-full max-w-4xl rounded-lg bg-white/5 p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <section className="md:w-1/2">
            {REGISTRATION_OPEN ? (
              <>
                <h2 className="text-2xl font-semibold">Conference Registration</h2>
                <p className="mt-2 text-sm text-white/80">
                  Fill the form to register for GHIGCON YGF 2026. Fields marked required
                  must be completed.
                </p>

                <div className="mt-6">
                  <RegistrationForm />
                </div>
              </>
            ) : (
              <div className="mt-6 rounded border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Portal status</p>
                <h2 className="mt-2 text-2xl font-semibold">Registration closed</h2>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Registrations for GHIGCON YGF 2026 are currently closed. Please contact the event team for further information.
                </p>
              </div>
            )}
          </section>

          <aside className="md:w-1/2">
            <div className="rounded border border-white/10 bg-white/3 p-4">
              <h3 className="text-lg font-medium">Event & Fees</h3>
              <p className="mt-2 text-sm text-white/80">
                GHIGCON YGF 2026 — 13-15 October 2026. Use this page to register and
                provide attendee details.
              </p>

              <div className="mt-4">
                <Image
                  src="/ghigcon-flyer.jpg"
                  alt="GHIGCON flyer"
                  width={600}
                  height={400}
                  className="rounded"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
