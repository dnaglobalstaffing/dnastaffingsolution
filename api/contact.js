import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, service, location, message } = req.body;

  try {
    await resend.emails.send({
      from: "DNA Global Staffing <onboarding@resend.dev>",
      to: ["dnaglobalstaffing@googlegroups.com"],
      subject: "New Service Request - DNA Global Staffing",
      html: `
        <h2>New Service Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Message:</b> ${message || "N/A"}</p>
      `,
    });

    return res.status(200).send("Request sent successfully");
  } catch (error) {
    return res.status(500).send("Error sending email");
  }
}
