export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {

    const data = req.body;

    // 🔥 Convert full form into HTML automatically
    let htmlContent = "<h2>New Job Application</h2><hr>";

    for (const key in data) {
      htmlContent += `
        <p>
          <b>${key}:</b> ${data[key] || "N/A"}
        </p>
      `;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DNA Global Staffing <onboarding@resend.dev>",
        to: ["dnaglobalstaffing@gmail.com"],
        subject: "New Job Application - DNA Staffing",
        html: htmlContent
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend error:", error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false });
  }
}
