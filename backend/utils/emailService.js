const nodemailer = require("nodemailer");

/**
 * Send OTP Email to user
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (toEmail, otp) => {
  console.log(`\n==================================================`);
  console.log(`🔑 FORGOT PASSWORD OTP FOR [${toEmail}]: ${otp}`);
  console.log(`==================================================\n`);

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.log("ℹ️ SMTP credentials (EMAIL_USER / EMAIL_PASS) not set in backend/.env. Using console OTP logging for development testing.");
    return { success: true, message: "OTP logged to server console (Development mode)" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"Worker Safety System" <${emailUser}>`,
      to: toEmail,
      subject: "Password Reset OTP - Worker Safety System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Worker Safety System</h2>
          <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;" />
          <p style="font-size: 16px; color: #333333;">Hello,</p>
          <p style="font-size: 16px; color: #333333;">You requested a password reset for your Worker Safety System account. Use the following 6-digit OTP code to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; background-color: #f0f4f8; padding: 10px 25px; border-radius: 6px; border: 1px dashed #007bff; display: inline-block;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666666;">This OTP is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px; margin-bottom: 15px;" />
          <p style="font-size: 12px; color: #999999; text-align: center;">Worker Safety System &bull; Ensure your safety every day</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP successfully sent to ${toEmail}`);
    return { success: true, message: "OTP sent to email" };
  } catch (error) {
    console.error("⚠️ Failed to send email via SMTP:", error.message);
    // Even if SMTP fails, return true so development flow isn't blocked (since OTP is logged above)
    return { success: true, message: "OTP generated (logged to server console)", error: error.message };
  }
};

module.exports = { sendOTPEmail };
