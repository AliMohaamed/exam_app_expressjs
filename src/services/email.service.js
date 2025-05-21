import { sendEmail } from "../utils/sendMail.js";
import { generateActivationEmail } from "../utils/generateHTML.js";

export const EmailService = {
  async sendActivationEmail({ email, activationCode }) {
    // const link = `${FE_URL}/auth/confirmEmail/${activationCode}`; // Front
    const link = `${process.env.API_URL}/api/auth/confirmEmail/${activationCode}`; // Backend
    const html = generateActivationEmail(link);

    return await sendEmail({
      to: email,
      subject: "Activate Account",
      html,
    });
  },
};
