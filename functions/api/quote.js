const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

const required = ["moveType", "origin", "destination", "homeSize", "moveDate", "name", "email"];

export async function onRequestPost({ request, env }) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "Expected a JSON request." }, 415);
  }

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request body." }, 400); }

  for (const key of required) {
    if (typeof body[key] !== "string" || !body[key].trim()) {
      return json({ error: "Please complete all required fields." }, 400);
    }
  }

  const email = body.email.trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please provide a valid email address." }, 400);
  }

  const clean = (value, max = 500) => String(value || "").trim().slice(0, max);
  const enquiry = {
    move_type: clean(body.moveType, 80),
    origin: clean(body.origin, 250),
    destination: clean(body.destination, 250),
    home_size: clean(body.homeSize, 80),
    special_items: clean(body.specialItems, 2000),
    move_date: clean(body.moveDate, 20),
    customer_name: clean(body.name, 120),
    customer_email: email,
    customer_phone: clean(body.phone, 50),
    source: "website_quote_form",
    created_at: new Date().toISOString()
  };

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.SUPABASE_QUOTES_TABLE) {
    return json({ error: "The enquiry service is not configured yet. Please contact the business directly." }, 503);
  }

  const dbResponse = await fetch(`${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${encodeURIComponent(env.SUPABASE_QUOTES_TABLE)}`, {
    method: "POST",
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(enquiry)
  });

  if (!dbResponse.ok) {
    return json({ error: "We couldn't save your enquiry. Please try again shortly." }, 502);
  }

  if (env.BREVO_API_KEY && env.BREVO_SENDER_EMAIL && env.BREVO_NOTIFY_EMAIL) {
    const details = Object.entries({
      "Move type": enquiry.move_type,
      "From": enquiry.origin,
      "To": enquiry.destination,
      "Move size": enquiry.home_size,
      "Move date": enquiry.move_date,
      "Customer": enquiry.customer_name,
      "Email": enquiry.customer_email,
      "Phone": enquiry.customer_phone || "Not provided",
      "Special details": enquiry.special_items || "None provided"
    }).map(([key, value]) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">${key}</td><td style="padding:8px;border-bottom:1px solid #eee">${String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}</td></tr>`).join("");

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        sender: { email: env.BREVO_SENDER_EMAIL, name: "Levi's Movers Website" },
        to: [{ email: env.BREVO_NOTIFY_EMAIL }],
        replyTo: { email: enquiry.customer_email, name: enquiry.customer_name },
        subject: "New moving quote enquiry",
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><h2>New moving enquiry</h2><table style="width:100%;border-collapse:collapse">${details}</table></div>`
      })
    }).catch(() => null);
  }

  return json({ success: true }, 201);
}