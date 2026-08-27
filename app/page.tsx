import Image from "next/image";
import RegistrationForm from "../app/components/RegistrationForm";

export const metadata = {
  title: 'Ghicon',
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6efe6] font-sans text-[#3b2f2f]">
      <main className="w-full max-w-6xl p-8">
        <div className="grid grid-cols-1 gap-8 rounded bg-[#f2eadf] p-6 md:grid-cols-2">
          <div>
            <Image
              src="/ghigcon-flyer.jpeg"
              alt="GHIGCON flyer"
              width={800}
              height={520}
              className="rounded shadow-sm"
            />
            <h1 className="mt-4 text-3xl font-semibold text-[#3b2f2f]">GHIGCON YGF 2026</h1>
            <p className="mt-2 text-sm text-[#5a4b44]">
              From Earth to Policy: Geoscience, Legislation & National Development
              — 13-15 October 2026. Register below to secure your spot.
            </p>
          </div>

          <div>
            <div className="rounded bg-white p-6 border border-[#e6dccb]">
              <h2 className="text-2xl font-semibold text-[#3b2f2f]">Register</h2>
              <p className="mt-2 text-sm text-[#5a4b44]">Complete your attendee details.</p>
              <div className="mt-4">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
