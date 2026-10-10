import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "../../../lib/mailer";

const REGISTRATION_OPEN = false;

export async function POST(req: Request) {
  try {
    if (!REGISTRATION_OPEN) {
      return NextResponse.json({ error: "Registration is currently closed." }, { status: 403 });
    }

    const body = await req.json();

    // Minimal server-side validation
    if (!body || !body.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: persist to a database

    // Try sending welcome email (don't fail registration on email errors)
    let mailResult = null;
    try {
      await sendWelcomeEmail(body);
      mailResult = { sent: true };
    } catch (mailErr) {
      // log full error on server for debugging
      console.error("Welcome email failed:", mailErr);
      mailResult = { sent: false, error: String(mailErr) };
    }

    return NextResponse.json(
      { ok: true, received: { email: body.email }, mail: mailResult },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 }); 
  }
}
