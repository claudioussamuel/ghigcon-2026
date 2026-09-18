"use client";

import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";

const COUNTRIES: { name: string; code: string; dial_code: string }[] = [
  { name: "Afghanistan", code: "AF", dial_code: "+93" },
  { name: "Albania", code: "AL", dial_code: "+355" },
  { name: "Algeria", code: "DZ", dial_code: "+213" },
  { name: "Andorra", code: "AD", dial_code: "+376" },
  { name: "Angola", code: "AO", dial_code: "+244" },
  { name: "Antigua and Barbuda", code: "AG", dial_code: "+1-268" },
  { name: "Argentina", code: "AR", dial_code: "+54" },
  { name: "Armenia", code: "AM", dial_code: "+374" },
  { name: "Australia", code: "AU", dial_code: "+61" },
  { name: "Austria", code: "AT", dial_code: "+43" },
  { name: "Azerbaijan", code: "AZ", dial_code: "+994" },
  { name: "Bahamas", code: "BS", dial_code: "+1-242" },
  { name: "Bahrain", code: "BH", dial_code: "+973" },
  { name: "Bangladesh", code: "BD", dial_code: "+880" },
  { name: "Barbados", code: "BB", dial_code: "+1-246" },
  { name: "Belarus", code: "BY", dial_code: "+375" },
  { name: "Belgium", code: "BE", dial_code: "+32" },
  { name: "Belize", code: "BZ", dial_code: "+501" },
  { name: "Benin", code: "BJ", dial_code: "+229" },
  { name: "Bhutan", code: "BT", dial_code: "+975" },
  { name: "Bolivia", code: "BO", dial_code: "+591" },
  { name: "Bosnia and Herzegovina", code: "BA", dial_code: "+387" },
  { name: "Botswana", code: "BW", dial_code: "+267" },
  { name: "Brazil", code: "BR", dial_code: "+55" },
  { name: "Brunei", code: "BN", dial_code: "+673" },
  { name: "Bulgaria", code: "BG", dial_code: "+359" },
  { name: "Burkina Faso", code: "BF", dial_code: "+226" },
  { name: "Burundi", code: "BI", dial_code: "+257" },
  { name: "Cambodia", code: "KH", dial_code: "+855" },
  { name: "Cameroon", code: "CM", dial_code: "+237" },
  { name: "Canada", code: "CA", dial_code: "+1" },
  { name: "Cape Verde", code: "CV", dial_code: "+238" },
  { name: "Central African Republic", code: "CF", dial_code: "+236" },
  { name: "Chad", code: "TD", dial_code: "+235" },
  { name: "Chile", code: "CL", dial_code: "+56" },
  { name: "China", code: "CN", dial_code: "+86" },
  { name: "Colombia", code: "CO", dial_code: "+57" },
  { name: "Comoros", code: "KM", dial_code: "+269" },
  { name: "Congo (Brazzaville)", code: "CG", dial_code: "+242" },
  { name: "Congo (Kinshasa)", code: "CD", dial_code: "+243" },
  { name: "Costa Rica", code: "CR", dial_code: "+506" },
  { name: "Côte d'Ivoire", code: "CI", dial_code: "+225" },
  { name: "Croatia", code: "HR", dial_code: "+385" },
  { name: "Cuba", code: "CU", dial_code: "+53" },
  { name: "Cyprus", code: "CY", dial_code: "+357" },
  { name: "Czech Republic", code: "CZ", dial_code: "+420" },
  { name: "Denmark", code: "DK", dial_code: "+45" },
  { name: "Djibouti", code: "DJ", dial_code: "+253" },
  { name: "Dominica", code: "DM", dial_code: "+1-767" },
  { name: "Dominican Republic", code: "DO", dial_code: "+1-809" },
  { name: "Ecuador", code: "EC", dial_code: "+593" },
  { name: "Egypt", code: "EG", dial_code: "+20" },
  { name: "El Salvador", code: "SV", dial_code: "+503" },
  { name: "Equatorial Guinea", code: "GQ", dial_code: "+240" },
  { name: "Eritrea", code: "ER", dial_code: "+291" },
  { name: "Estonia", code: "EE", dial_code: "+372" },
  { name: "Eswatini", code: "SZ", dial_code: "+268" },
  { name: "Ethiopia", code: "ET", dial_code: "+251" },
  { name: "Fiji", code: "FJ", dial_code: "+679" },
  { name: "Finland", code: "FI", dial_code: "+358" },
  { name: "France", code: "FR", dial_code: "+33" },
  { name: "Gabon", code: "GA", dial_code: "+241" },
  { name: "Gambia", code: "GM", dial_code: "+220" },
  { name: "Georgia", code: "GE", dial_code: "+995" },
  { name: "Germany", code: "DE", dial_code: "+49" },
  { name: "Ghana", code: "GH", dial_code: "+233" },
  { name: "Greece", code: "GR", dial_code: "+30" },
  { name: "Grenada", code: "GD", dial_code: "+1-473" },
  { name: "Guatemala", code: "GT", dial_code: "+502" },
  { name: "Guinea", code: "GN", dial_code: "+224" },
  { name: "Guinea-Bissau", code: "GW", dial_code: "+245" },
  { name: "Guyana", code: "GY", dial_code: "+592" },
  { name: "Haiti", code: "HT", dial_code: "+509" },
  { name: "Honduras", code: "HN", dial_code: "+504" },
  { name: "Hungary", code: "HU", dial_code: "+36" },
  { name: "Iceland", code: "IS", dial_code: "+354" },
  { name: "India", code: "IN", dial_code: "+91" },
  { name: "Indonesia", code: "ID", dial_code: "+62" },
  { name: "Iran", code: "IR", dial_code: "+98" },
  { name: "Iraq", code: "IQ", dial_code: "+964" },
  { name: "Ireland", code: "IE", dial_code: "+353" },
  { name: "Israel", code: "IL", dial_code: "+972" },
  { name: "Italy", code: "IT", dial_code: "+39" },
  { name: "Jamaica", code: "JM", dial_code: "+1-876" },
  { name: "Japan", code: "JP", dial_code: "+81" },
  { name: "Jordan", code: "JO", dial_code: "+962" },
  { name: "Kazakhstan", code: "KZ", dial_code: "+7" },
  { name: "Kenya", code: "KE", dial_code: "+254" },
  { name: "Kiribati", code: "KI", dial_code: "+686" },
  { name: "Kuwait", code: "KW", dial_code: "+965" },
  { name: "Kyrgyzstan", code: "KG", dial_code: "+996" },
  { name: "Laos", code: "LA", dial_code: "+856" },
  { name: "Latvia", code: "LV", dial_code: "+371" },
  { name: "Lebanon", code: "LB", dial_code: "+961" },
  { name: "Lesotho", code: "LS", dial_code: "+266" },
  { name: "Liberia", code: "LR", dial_code: "+231" },
  { name: "Libya", code: "LY", dial_code: "+218" },
  { name: "Liechtenstein", code: "LI", dial_code: "+423" },
  { name: "Lithuania", code: "LT", dial_code: "+370" },
  { name: "Luxembourg", code: "LU", dial_code: "+352" },
  { name: "Madagascar", code: "MG", dial_code: "+261" },
  { name: "Malawi", code: "MW", dial_code: "+265" },
  { name: "Malaysia", code: "MY", dial_code: "+60" },
  { name: "Maldives", code: "MV", dial_code: "+960" },
  { name: "Mali", code: "ML", dial_code: "+223" },
  { name: "Malta", code: "MT", dial_code: "+356" },
  { name: "Marshall Islands", code: "MH", dial_code: "+692" },
  { name: "Mauritania", code: "MR", dial_code: "+222" },
  { name: "Mauritius", code: "MU", dial_code: "+230" },
  { name: "Mexico", code: "MX", dial_code: "+52" },
  { name: "Micronesia", code: "FM", dial_code: "+691" },
  { name: "Moldova", code: "MD", dial_code: "+373" },
  { name: "Monaco", code: "MC", dial_code: "+377" },
  { name: "Mongolia", code: "MN", dial_code: "+976" },
  { name: "Montenegro", code: "ME", dial_code: "+382" },
  { name: "Morocco", code: "MA", dial_code: "+212" },
  { name: "Mozambique", code: "MZ", dial_code: "+258" },
  { name: "Myanmar", code: "MM", dial_code: "+95" },
  { name: "Namibia", code: "NA", dial_code: "+264" },
  { name: "Nauru", code: "NR", dial_code: "+674" },
  { name: "Nepal", code: "NP", dial_code: "+977" },
  { name: "Netherlands", code: "NL", dial_code: "+31" },
  { name: "New Zealand", code: "NZ", dial_code: "+64" },
  { name: "Nicaragua", code: "NI", dial_code: "+505" },
  { name: "Niger", code: "NE", dial_code: "+227" },
  { name: "Nigeria", code: "NG", dial_code: "+234" },
  { name: "North Korea", code: "KP", dial_code: "+850" },
  { name: "North Macedonia", code: "MK", dial_code: "+389" },
  { name: "Norway", code: "NO", dial_code: "+47" },
  { name: "Oman", code: "OM", dial_code: "+968" },
  { name: "Pakistan", code: "PK", dial_code: "+92" },
  { name: "Palau", code: "PW", dial_code: "+680" },
  { name: "Panama", code: "PA", dial_code: "+507" },
  { name: "Papua New Guinea", code: "PG", dial_code: "+675" },
  { name: "Paraguay", code: "PY", dial_code: "+595" },
  { name: "Peru", code: "PE", dial_code: "+51" },
  { name: "Philippines", code: "PH", dial_code: "+63" },
  { name: "Poland", code: "PL", dial_code: "+48" },
  { name: "Portugal", code: "PT", dial_code: "+351" },
  { name: "Qatar", code: "QA", dial_code: "+974" },
  { name: "Romania", code: "RO", dial_code: "+40" },
  { name: "Russia", code: "RU", dial_code: "+7" },
  { name: "Rwanda", code: "RW", dial_code: "+250" },
  { name: "Saint Kitts and Nevis", code: "KN", dial_code: "+1-869" },
  { name: "Saint Lucia", code: "LC", dial_code: "+1-758" },
  { name: "Saint Vincent and the Grenadines", code: "VC", dial_code: "+1-784" },
  { name: "Samoa", code: "WS", dial_code: "+685" },
  { name: "San Marino", code: "SM", dial_code: "+378" },
  { name: "Sao Tome and Principe", code: "ST", dial_code: "+239" },
  { name: "Saudi Arabia", code: "SA", dial_code: "+966" },
  { name: "Senegal", code: "SN", dial_code: "+221" },
  { name: "Serbia", code: "RS", dial_code: "+381" },
  { name: "Seychelles", code: "SC", dial_code: "+248" },
  { name: "Sierra Leone", code: "SL", dial_code: "+232" },
  { name: "Singapore", code: "SG", dial_code: "+65" },
  { name: "Slovakia", code: "SK", dial_code: "+421" },
  { name: "Slovenia", code: "SI", dial_code: "+386" },
  { name: "Solomon Islands", code: "SB", dial_code: "+677" },
  { name: "Somalia", code: "SO", dial_code: "+252" },
  { name: "South Africa", code: "ZA", dial_code: "+27" },
  { name: "South Sudan", code: "SS", dial_code: "+211" },
  { name: "Spain", code: "ES", dial_code: "+34" },
  { name: "Sri Lanka", code: "LK", dial_code: "+94" },
  { name: "Sudan", code: "SD", dial_code: "+249" },
  { name: "Suriname", code: "SR", dial_code: "+597" },
  { name: "Sweden", code: "SE", dial_code: "+46" },
  { name: "Switzerland", code: "CH", dial_code: "+41" },
  { name: "Syria", code: "SY", dial_code: "+963" },
  { name: "Taiwan", code: "TW", dial_code: "+886" },
  { name: "Tajikistan", code: "TJ", dial_code: "+992" },
  { name: "Tanzania", code: "TZ", dial_code: "+255" },
  { name: "Thailand", code: "TH", dial_code: "+66" },
  { name: "Togo", code: "TG", dial_code: "+228" },
  { name: "Tonga", code: "TO", dial_code: "+676" },
  { name: "Trinidad and Tobago", code: "TT", dial_code: "+1-868" },
  { name: "Tunisia", code: "TN", dial_code: "+216" },
  { name: "Turkey", code: "TR", dial_code: "+90" },
  { name: "Turkmenistan", code: "TM", dial_code: "+993" },
  { name: "Tuvalu", code: "TV", dial_code: "+688" },
  { name: "Uganda", code: "UG", dial_code: "+256" },
  { name: "Ukraine", code: "UA", dial_code: "+380" },
  { name: "United Arab Emirates", code: "AE", dial_code: "+971" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "Uruguay", code: "UY", dial_code: "+598" },
  { name: "Uzbekistan", code: "UZ", dial_code: "+998" },
  { name: "Vanuatu", code: "VU", dial_code: "+678" },
  { name: "Vatican City", code: "VA", dial_code: "+379" },
  { name: "Venezuela", code: "VE", dial_code: "+58" },
  { name: "Vietnam", code: "VN", dial_code: "+84" },
  { name: "Yemen", code: "YE", dial_code: "+967" },
  { name: "Zambia", code: "ZM", dial_code: "+260" },
  { name: "Zimbabwe", code: "ZW", dial_code: "+263" },
];

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

  // Pricing cutoff: before 8 Oct 2026 => early prices
  const cutoff = new Date(2026, 9, 8); // months are 0-indexed (9 = October)
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
        <select
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
          className="rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          <select
            value={form.phoneCountry}
            onChange={(e) => update("phoneCountry", e.target.value)}
            className="md:col-span-1 w-full rounded border border-[#e6dccb] bg-white p-2 text-[#3b2f2f]"
          >
            <option value="">Code</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.dial_code}>
                {c.dial_code} {c.name}
              </option>
            ))}
          </select>

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
