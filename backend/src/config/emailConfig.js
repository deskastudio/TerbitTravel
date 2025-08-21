import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_REFRESH_TOKEN
    ) {
      throw new Error("Missing required OAuth2 credentials");
    }

    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    // 🔍 DEBUG LOGGING
    console.log("📥 [OAuth2 Debug]");
    console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Email from:", process.env.EMAIL_FROM);
    console.log("Refresh token starts with:", process.env.GOOGLE_REFRESH_TOKEN?.slice(0, 10));
    console.log("Access token:", accessToken?.token);

    if (!accessToken?.token) {
      throw new Error("Failed to get access token");
    }

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_FROM,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  } catch (error) {
    console.error("❌ Error creating transporter:", error);
    throw error;
  }
};

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log("📨 Sending email to:", email);
    const transporter = await createTransporter();

    const mailOptions = {
      from: `Terbit Travel <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verifikasi Email Travel App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50; text-align: center;">Verifikasi Email Anda</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="text-align: center; color: #3498db;">${otp}</h2>
            <p style="text-align: center; color: #7f8c8d;">Kode OTP Anda akan kedaluwarsa dalam 24 jam</p>
          </div>
          <p style="color: #34495e;">Gunakan kode OTP di atas untuk memverifikasi email Anda.</p>
          <p style="color: #7f8c8d; font-size: 12px;">Jika Anda tidak merasa mendaftar di aplikasi kami, abaikan email ini.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};
