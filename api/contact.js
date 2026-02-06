export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // ---------- READ FORM DATA ----------
    let body = "";
    for await (const chunk of req) {
      body += chunk.toString();
    }

    const params = new URLSearchParams(body);

    const name = params.get("name");
    const phone = params.get("phone");
    const service = params.get("service");
    const location = params.get("location");
    const message = params.get("message") || "N/A";

    // ---------- SEND EMAIL VIA RESEND API ----------
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DNA Global Staffing <onboarding@resend.dev>",
        to: ["dnaglobalstaffing@gmail.com"], // test first
        subject: "New Service Request - DNA Global Staffing",
        html: `
          <h2>New Service Request</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Service:</b> ${service}</p>
          <p><b>Location:</b> ${location}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      return res.status(500).send(JSON.stringify(result));
    }

    // ---------- SUCCESS ----------
    res.status(302).setHeader("Location", "/contact.html");
    res.end();

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).send("Server error");
  }
}
