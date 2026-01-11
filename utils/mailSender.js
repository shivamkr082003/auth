import axios from "axios";

const mailSender = async (email, title, body) => {
  try {
    const data = {
      sender: {
        name: "Auth",
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email }],
      subject: title || "OTP Verification",
      htmlContent: body,
    };

    const config = {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      config
    );

    console.log("✅ Email sent via Brevo:", response.data.messageId);
    return response.data;

  } catch (error) {
    console.error(
      "❌ MailSender Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export default mailSender;
