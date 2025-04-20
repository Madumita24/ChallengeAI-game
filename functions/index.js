const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const sgMail = require("@sendgrid/mail");
const jsPDF = require("jspdf");
require("jspdf-autotable");

initializeApp();
const db = getFirestore();

sgMail.setApiKey("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"); // Replace with your real SendGrid API key

exports.sendReportEmail = functions.https.onCall(async (data, context) => {
  const sessionId = data.sessionId;
  const recipientEmail = "m3d2hackathon@gmail.com"; // ✅ or array of emails

  try {
    const collections = ["phaseOneData", "PhaseTwoVotes", "debates", "phaseThreeReflections"];
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Refugee Education Policy Report", 20, 20);

    let y = 30;

    for (const col of collections) {
      const docSnap = await db.collection(col).doc(sessionId).get();
      const content = docSnap.exists ? docSnap.data() : {};
      pdf.setFontSize(14);
      pdf.text(col, 20, y);
      y += 6;

      const entries = Object.entries(content || {}).map(([key, val]) => {
        return [key, typeof val === "object" ? JSON.stringify(val) : `${val}`];
      });

      require("jspdf-autotable")(pdf);
      pdf.autoTable({
        startY: y,
        head: [["Field", "Value"]],
        body: entries,
        styles: { fontSize: 8 },
      });

      y = pdf.lastAutoTable.finalY + 10;
    }

    const pdfBuffer = pdf.output("arraybuffer");

    await sgMail.send({
      to: recipientEmail,
      from: "dheerajkiran.e@gmail.com", // ✅ Use your verified sender
      subject: "Refugee Education Policy Report",
      text: `Here is the final report for session: ${sessionId}`,
      attachments: [
        {
          content: Buffer.from(pdfBuffer).toString("base64"),
          filename: `Report_${sessionId}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email.");
  }
});
