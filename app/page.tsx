import Image from "next/image";
import RegistrationForm from "../app/components/RegistrationForm";

const REGISTRATION_OPEN = false;

export const metadata = {
  title: 'Ghicon',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f9f0e5_0%,#f3e7d5_35%,#e9dcc4_100%)] px-4 py-8 font-sans text-[#2e221f] sm:px-6 lg:px-8">
      <main className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[28px] border border-[#e8d5b6] bg-[#f9f4ee]/90 shadow-[0_30px_80px_rgba(74,48,32,0.12)] backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-8 p-5 md:p-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[22px] bg-[#f1e8db] p-3 shadow-inner shadow-[#d8c3a4]/40">
              <Image
                src="/ghigcon-flyer.jpeg"
                alt="GHIGCON flyer"
                width={800}
                height={520}
                loading="eager"
                className="h-full w-full rounded-[18px] object-cover shadow-[0_16px_30px_rgba(67,46,34,0.12)]"
              />

              <div className="px-2 pb-2 pt-5">
                <div className="inline-flex items-center rounded-full border border-[#d7b98f] bg-[#fffaf3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7d5d42]">
                  13–15 October 2026
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#2e221f] sm:text-4xl">
                  GHIGCON YGF 2026
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#5d463f] sm:text-base">
                  From Earth to Policy: Geoscience, Legislation & National Development
                  — a flagship forum for leaders, researchers, and policymakers.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[22px] border border-[#e7d8c2] bg-white p-5 shadow-[0_16px_35px_rgba(90,61,42,0.08)] sm:p-6">
                {REGISTRATION_OPEN ? (
                  <>
                    <h2 className="text-2xl font-semibold text-[#2e221f]">Register</h2>
                    <p className="mt-2 text-sm text-[#5a4b44]">Complete your attendee details.</p>
                    <div className="mt-5">
                      <RegistrationForm />
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-[#e8d5b6] bg-[#f8f1e8] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d5d42]">Registration</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#2e221f]">Portal closed</h2>
                    <p className="mt-3 text-sm leading-6 text-[#5a4b44]">
                      Registration for GHIGCON YGF 2026 is currently closed. Please check back later or contact the event team for updates.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-[22px] border border-[#e7d8c2] bg-[#fffdfb] p-5 shadow-[0_16px_35px_rgba(90,61,42,0.08)] sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-[#2e221f]">Accommodation options</h3>
                  <span className="rounded-full border border-[#ead6b1] bg-[#f9f1df] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7d5d42]">
                    Stay nearby
                  </span>
                </div>

                <p className="text-sm leading-6 text-[#5a4b44]">
                  Contact the guest houses below for room bookings during the conference.
                </p>

                <div className="mt-5 space-y-4">
                  {[
                    {
                      name: "KNUST Guest House",
                      phone: "0302250708",
                      rooms: [
                        ["Standard", "GHS 670"],
                        ["Double", "GHS 730"],
                        ["Twin", "GHS 770"],
                        ["Suite", "GHS 900"],
                      ],
                    },
                    {
                      name: "UDS Guest House",
                      phone: "0302783717",
                      rooms: [
                        ["Standard", "GHS 650"],
                        ["Basement", "GHS 630"],
                        ["Deluxe", "GHS 800"],
                      ],
                    },
                    {
                      name: "Assemblies of God Guest House",
                      phone: "0302788588",
                      rooms: [["All rooms", "GHS 600/night"]],
                    },
                    {
                      name: "Aklin Hotel",
                      phone: "0202886590",
                      rooms: [
                        ["Standard Single", "GHS 800"],
                        ["Standard Double", "GHS 950"],
                        ["Executive", "GHS 1100"],
                        ["Executive Plus", "GHS 1200"],
                      ],
                    },
                  ].map((hotel) => (
                    <div
                      key={hotel.name}
                      className="rounded-2xl border border-[#f0e0c8] bg-[#fffaf4] p-4 shadow-[0_10px_20px_rgba(96,73,53,0.04)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#2e221f]">{hotel.name}</p>
                        <a
                          href={`tel:${hotel.phone}`}
                          className="text-xs font-medium text-[#6f5242] underline decoration-[#6f5242]/60 underline-offset-2"
                          aria-label={`Call ${hotel.name}`}
                        >
                          {hotel.phone}
                        </a>
                      </div>

                      <ul className="mt-3 space-y-1.5 text-sm text-[#5a4b44]">
                        {hotel.rooms.map(([label, price]) => (
                          <li key={label} className="flex items-center justify-between gap-2 border-b border-dashed border-[#f1dcb7] pb-1 last:border-b-0 last:pb-0">
                            <span>{label}</span>
                            <span className="font-medium text-[#2d221d]">{price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
