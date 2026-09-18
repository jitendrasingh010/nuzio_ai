const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: (process.env.MAIL_USER || "").trim(),
    pass: (process.env.MAIL_PASS || "").replace(/\s+/g, "").trim(),
  },
});

/**
 * Send password reset email with styled template
 */
const sendResetEmail = async ({ to, otp, userName = "User" }) => {
  const mailOptions = {
    from: `"Nuzio AI" <${process.env.MAIL_USER || "no-reply@nuzio.ai"}>`,
    to,
    subject: "Nuzio AI — Password Reset Verification Code",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F5; padding: 40px 20px; color: #18191B;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EAE6DF; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 44px; height: 44px; background: #1E2024; border-radius: 12px; line-height: 44px; color: #E86A33; font-weight: bold; font-size: 20px;">
              N
            </div>
            <h2 style="font-size: 20px; font-weight: 700; margin-top: 12px; color: #18191B;">Password Reset Request</h2>
            <p style="font-size: 13px; color: #6B7280; margin: 4px 0 0 0;">Nuzio AI — Personalized Audio Briefs</p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            Hello <strong>${userName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            We received a request to reset your password. Use the 6-digit verification code below to complete the reset process.
          </p>

          <div style="text-align: center; margin: 28px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: 800; letter-spacing: 8px; background: #FAF8F5; border: 1px dashed #E86A33; color: #1E2024; padding: 14px 28px; border-radius: 12px;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 12px; color: #6B7280; line-height: 1.5; text-align: center;">
            This code will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #F0ECE4; margin: 24px 0;" />
          <p style="font-size: 11px; color: #9CA3AF; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} Nuzio AI. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`Nodemailer delivery error (${error.message}). Logging fallback OTP code:`, otp);
    return {
      success: false,
      error: error.message,
      fallbackOtp: otp,
    };
  }
};

module.exports = {
  transporter,
  sendResetEmail,
};
