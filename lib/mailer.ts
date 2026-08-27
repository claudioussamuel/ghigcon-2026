import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
  console.warn(
    "Mailer environment variables GMAIL_USER and/or GMAIL_PASS are not set. Emails may fail to send."
  );
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "webofficerbruno@gmail.com",
    pass:  "etay odvx xrnp ujfd",
  },
});

// Verify transporter configuration at startup (will log to the server console)
transporter.verify().then(
  () => console.log("Mailer: transporter verified"),
  (err) => console.warn("Mailer: transporter verification failed:", err)
);

export async function sendWelcomeEmail(details: any) {
  const to = details?.email;
  const name = (details?.firstName || details?.lastName || "Attendee");
  const subject = "GHIGCON YGF 2026 — Registration Confirmation";

  const regMap: Record<string, string> = {
    ghig_member: "GHIG Member",
    non_member: "Non-Member",
    company_group: "Company Group",
    international: "International",
    student_member: "Student (Member)",
    student_non_member: "Student (Non-member)",
    volunteers: "Volunteer",
  };

  const registrationLabel = details?.registrationType ? (regMap[details.registrationType] || details.registrationType) : "Not provided";
  const galaLabel = details?.galaNight ? "Yes (GHS 200)" : "No";
  const amount = details?.amount ?? 0;

  const textLines = [
    `Hello ${name},`,
    "\nThanks for registering for GHIGCON YGF 2026.",
    "Here are the details you submitted:",
    `Email: ${details?.email || ""}`,
    `Name: ${details?.firstName || ""} ${details?.lastName || ""}`,
    `Title: ${details?.title || ""}`,
    `Role: ${details?.jobTitle || ""}`,
    `Company: ${details?.companyName || ""}`,
    `Country: ${details?.country || ""}`,
    `Phone: ${details?.phoneCountry || ""} ${details?.phoneNumber || ""}`,
    `Address: ${details?.streetAddress || ""}, ${details?.city || ""} ${details?.postalCode || ""}`,
    `Area of interest: ${details?.areaOfInterest || ""}`,
    `Registration type: ${registrationLabel}`,
    `Gala night: ${galaLabel}`,
    `Amount: GHS ${amount}`,
    "\nWe will contact you with further details.\n\nBest regards,\nGHIG",
  ];

  const text = textLines.join("\n");

  const html = `
  <div style="background:#f6efe6;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#3b2f2f;">
    <div style="max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;border:1px solid #e6dccb;background:#fff;">
      <div style="background:#f2eadf;padding:18px 20px;border-bottom:1px solid #e6dccb;">
        <h1 style="margin:0;font-size:20px;color:#3b2f2f">GHIGCON YGF 2026 — Registration Confirmation</h1>
        <p style="margin:6px 0 0;color:#5a4b44">Hello ${name}, thank you for registering.</p>
      </div>
      <div style="padding:20px;">
        <h2 style="font-size:16px;margin:0 0 12px;color:#3b2f2f">Your submitted details</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3b2f2f">
          <tbody>
            <tr><td style="padding:6px 0;width:160px;color:#5a4b44">Email</td><td style="padding:6px 0">${details?.email || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Name</td><td style="padding:6px 0">${details?.firstName || ""} ${details?.lastName || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Title</td><td style="padding:6px 0">${details?.title || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Role</td><td style="padding:6px 0">${details?.jobTitle || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Company</td><td style="padding:6px 0">${details?.companyName || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Country</td><td style="padding:6px 0">${details?.country || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Phone</td><td style="padding:6px 0">${details?.phoneCountry || ""} ${details?.phoneNumber || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Address</td><td style="padding:6px 0">${details?.streetAddress || ""}, ${details?.city || ""} ${details?.postalCode || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Area of interest</td><td style="padding:6px 0">${details?.areaOfInterest || ""}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Registration</td><td style="padding:6px 0">${registrationLabel}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Gala night</td><td style="padding:6px 0">${galaLabel}</td></tr>
            <tr><td style="padding:6px 0;color:#5a4b44">Amount</td><td style="padding:6px 0"><strong>GHS ${amount}</strong></td></tr>
          </tbody>
        </table>

        <p style="margin-top:16px;color:#5a4b44">Fee includes conference access, materials & daily meals. Gala night is optional.</p>

        <p style="margin-top:18px;color:#3b2f2f">If any of the information above is incorrect, reply to this email or contact the organisers.</p>
      </div>
      <div style="background:#f2eadf;padding:12px 20px;text-align:center;color:#5a4b44;font-size:13px;border-top:1px solid #e6dccb">GHIG — Connecting Geoscientists. Shaping Policy. Building Ghana.</div>
    </div>
  </div>
  `;

  return transporter.sendMail({
    from: GMAIL_USER ? `GHIG <${GMAIL_USER}>` : "GHIG <no-reply@ghig.org>",
    to,
    subject,
    text,
    html,
  });
}
