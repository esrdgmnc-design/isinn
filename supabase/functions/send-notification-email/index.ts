// Supabase Edge Function: send-notification-email
// Called by the `trg_notify_pending_media_approval` database trigger (see
// schema.sql) whenever a review photo/video needs the provider's consent.
// Sends a real email via Resend (https://resend.com — free tier is enough
// to start with, no credit card required for the first 100 emails/day).
//
// Setup:
//   1. Create a free Resend account, verify a sending domain (or use their
//      shared onboarding domain for testing), get an API key.
//   2. Deploy this function: `supabase functions deploy send-notification-email`
//   3. Set the secret:      `supabase secrets set RESEND_API_KEY=re_xxx`
//   4. In the database, set the base URL this function is reachable at, so
//      the trigger knows where to call:
//        alter database postgres set app.settings.edge_function_base_url =
//          'https://<your-project-ref>.supabase.co/functions/v1';
//
// If RESEND_API_KEY is missing or the call fails, this function fails
// silently from the trigger's point of view (see schema.sql's comment on
// the trigger) — the in-app `notifications` row still exists either way,
// so nobody loses the notification entirely, they just don't get the email.

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_ADDRESS = Deno.env.get("NOTIFICATION_FROM_ADDRESS") || "İşinn <onboarding@resend.dev>";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY ortam değişkeni ayarlanmamış." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { to, subject, body } = await req.json();

  if (!to || !subject || !body) {
    return new Response(
      JSON.stringify({ error: "to, subject ve body alanları zorunludur." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject,
      text: body,
    }),
  });

  const data = await resendResponse.json();
  return new Response(JSON.stringify(data), {
    status: resendResponse.status,
    headers: { "Content-Type": "application/json" },
  });
});
