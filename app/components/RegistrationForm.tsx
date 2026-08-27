"use client";

import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  jobTitle: string;
  companyName: string;
  country: string;
  phoneCountry: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  areaOfInterest: string;
  registrationType: string;
  galaNight: boolean;
  amount: number;
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    email: "",
    firstName: "",
    lastName: "",
    title: "",
    jobTitle: "",
    companyName: "",
    country: "",
    phoneCountry: "+233",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    areaOfInterest: "",
    registrationType: "",
    galaNight: false,
    amount: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [usePaystackPayment, setUsePaystackPayment] = useState<any>(null);

  // Pricing cutoff: before 11 Sept 2026 => early prices
  const cutoff = new Date(2026, 8, 11); // months are 0-indexed (8 = September)
  const isEarly = Date.now() < cutoff.getTime();

  const basePrices: Record<string, number> = {
    ghig_member: isEarly ? 800 : 1000,
    non_member: isEarly ? 1000 : 1200,
    company_group: isEarly ? 700 : 900,
    international: 3000,
    student_member: 250,
    student_non_member: 300,
    volunteers: 250,
  };

  useEffect(() => {
    setIsClient(true);
    // dynamically load react-paystack on client only
    const load = async () => {
      try {
        const mod = await import("react-paystack");
        setUsePaystackPayment(() => mod.usePaystackPayment);
      } catch (err) {
        console.warn("react-paystack not available:", err);
      }
    };
    load();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function submitRegistration() {
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        const err = data?.error || "Request failed";
        throw new Error(err);
      }

      // Show mail send status when available
      if (data?.mail) {
        if (data.mail.sent) {
          setMessage("Registration submitted — welcome email sent!");
        } else {
          setMessage("Registered, but welcome email failed to send.");
        }
      } else {
        setMessage("Registration submitted — thank you!");
      }

      // Clear form only on overall success
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        title: "",
        jobTitle: "",
        companyName: "",
        country: "",
        phoneCountry: "+233",
        phoneNumber: "",
        streetAddress: "",
        city: "",
        postalCode: "",
        areaOfInterest: "",
        registrationType: "",
        galaNight: false,
        amount: 0,
      });
    } catch (err: any) {
      setMessage(`Submission failed — ${err?.message || "please try again."}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitRegistration();
  }

  // Primary button - decides to pay (when amount > 0) or submit directly
  const handlePrimary = async () => {
    if (form.amount && form.amount > 0) {
      if (!initializePayment) {
        setMessage("Payment system loading — try again shortly.");
        return;
      }
      setSubmitting(true);
      initializePayment({ onSuccess, onClose });
    } else {
      await submitRegistration();
    }
  };

  // Paystack payment flow
  const paystackPublicKey = "pk_live_f3b615e142ef313c212a99dd33a7fb70faf8cf6f";

  const getAmountKobo = () => {
    // convert GHS to pesewas (smallest unit)
    return Math.round((form.amount || 0) * 100);
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: form.email,
    amount: getAmountKobo(),
    currency: "GHS",
    publicKey: paystackPublicKey,
    metadata: {
      registrationType: form.registrationType,
      jobTitle: form.jobTitle,
      phone: `${form.phoneCountry} ${form.phoneNumber}`,
    },
  };

  const onSuccess = async (reference: any) => {
    setSubmitting(true);
    setMessage(null);

    // generate 6-digit pin code (client-side)
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // 1) Persist to Firestore (collection: webinar-1) — client-side write
      await addDoc(collection(db, "ghigcon-2026"), {
        ...form,
        pinCode,
        payed: true,
        paid: true,
        reference,
        amount: form.amount,
        createdAt: new Date().toISOString(),
      });

      // 2) Call server API to trigger welcome email (server may validate further)
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, payed: true, reference, pinCode }),
      });

      setMessage("Payment successful — registration saved and email queued.");
    } catch (err: any) {
      console.error(err);
      setMessage("Payment succeeded but saving registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const onClose = () => {
    setMessage("Payment dialog closed.");
    setSubmitting(false);
  };

  const initializePayment = usePaystackPayment ? usePaystackPayment(config) : null;

  const handlePayAndRegister = async () => {
    // basic guard
    if (!form.email || !form.firstName || !form.lastName || !form.registrationType) {
      setMessage("Please complete required fields before paying.");
      return;
    }
    if (!initializePayment) {
      setMessage("Payment system loading — try again shortly.");
      return;
    }
    setSubmitting(true);
    initializePayment({ onSuccess, onClose });
  };

  return (
    <form className="grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        />
        <input
          required
          placeholder="Title (Mr/Ms/Dr)"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          required
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        />
        <input
          required
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        />
      </div>

      <label className="text-sm text-[#5a4b44]">Job / Role</label>
      <select
        value={form.jobTitle}
        onChange={(e) => update("jobTitle", e.target.value)}
        className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
      >
        <option value="">Select job role</option>
        <option value="Mining">Mining</option>
        <option value="Exploration">Exploration</option>
        <option value="Regulatory">Regulatory</option>
        <option value="Government">Government</option>
        <option value="Academia">Academia</option>
        <option value="Mine Support">Mine Support</option>
        <option value="Machinery">Machinery</option>
        <option value="Petroleum">Petroleum</option>
        <option value="Consultant">Consultant</option>
        <option value="Investors">Investors</option>
        <option value="Mineral Assay">Mineral Assay</option>
      </select>

      <label className="text-sm text-[#5a4b44]">Registration Type</label>
      <select
        value={form.registrationType}
        onChange={(e) => {
          const val = e.target.value;
          const base = basePrices[val] || 0;
          const total = base + (form.galaNight ? 200 : 0);
          update("registrationType", val);
          update("amount", total);
        }}
        className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        required
      >
        <option value="">Select registration type</option>
        {isEarly ? (
          <>
            <option value="ghig_member">GHIG Member — GHS 800 (Early)</option>
            <option value="non_member">Non-Member — GHS 1000 (Early)</option>
            <option value="company_group">Company Group — GHS 700 (Early)</option>
          </>
        ) : (
          <>
            <option value="ghig_member">GHIG Member — GHS 1000 (After)</option>
            <option value="non_member">Non-Member — GHS 1200 (After)</option>
            <option value="company_group">Company Group — GHS 900 (After)</option>
          </>
        )}
        <option value="international">International — GHS 3000</option>
        <option value="student_member">Student (Member) — GHS 250</option>
        <option value="student_non_member">Student (Non-member) — GHS 300</option>
        <option value="volunteers">Volunteers — GHS 250</option>
      </select>

      <div className="flex items-center gap-3">
        <input
          id="gala"
          type="checkbox"
          checked={form.galaNight}
          onChange={(e) => {
            const checked = e.target.checked;
            update("galaNight", checked);
            // compute base from current registration type
            const base = basePrices[form.registrationType] || 0;
            update("amount", base + (checked ? 200 : 0));
          }}
          className="h-4 w-4"
        />
        <label htmlFor="gala" className="text-sm text-[#5a4b44]">Add Gala Night (GHS 200)</label>
      </div>

      <div className="mt-1 text-lg font-semibold text-[#3b2f2f]">Total: GHS {form.amount}</div>

      <input
        placeholder="Company name"
        value={form.companyName}
        onChange={(e) => update("companyName", e.target.value)}
        className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="Country"
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          <input
            placeholder="Code"
            value={form.phoneCountry}
            onChange={(e) => update("phoneCountry", e.target.value)}
            className="md:col-span-1 w-full rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
          />
          <input
            placeholder="Phone number"
            value={form.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
            className="md:col-span-2 w-full rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
          />
        </div>
      </div>

      <input
        placeholder="Street address"
        value={form.streetAddress}
        onChange={(e) => update("streetAddress", e.target.value)}
        className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        />
        <input
          placeholder="Postal code"
          value={form.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        />
      </div>

      <textarea
        placeholder="Area of interest"
        value={form.areaOfInterest}
        onChange={(e) => update("areaOfInterest", e.target.value)}
        className="h-24 rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
      />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrimary}
          disabled={submitting || (form.amount > 0 && !isClient)}
          className="w-full md:w-auto rounded bg-[#6b21a8] px-4 py-2 text-white disabled:opacity-50 hover:bg-[#581c9b]"
        >
          {submitting ? "Processing…" : form.amount > 0 ? "Pay & Register" : "Submit registration"}
        </button>

        {message && <div className="text-sm text-[#2d6a2d]">{message}</div>}
      </div>
    </form>
  );
}
