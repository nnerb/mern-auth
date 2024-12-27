import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }]

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Account Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification"
    })

    console.log("Email sent successfully: ", res)

  } catch (error) {
    console.log(`Error sending email`, error);
    res.status(400).json({ success: false, error: error.message });
  }
}

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }]

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "09a53350-b2f0-4da4-8cac-47a9642b7b26",
      template_variables: {
        "company_info_name": "MERN Auth",
        "name": name
      }
    })

    console.log("Welcome email sent successfully", res)

  } catch (error) {
    console.log(`Error sending welcome email`, error);
    res.status(400).json({ success: false, error: error.message });
  }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }]

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset"
    })

    console.log("Forgot password email sent successfully", res)

  } catch (error) {
    console.log(`Error sending forgot password email`, error);
    res.status(400).json({ success: false, error: error.message });
  }
}