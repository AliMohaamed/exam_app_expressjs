import { sendEmail } from "../utils/email/sendMail.js";
import { generateActivationEmail } from "../utils/email/generateHTML.js";

export const EmailService = {
  async sendActivationEmail({ email, activationCode }) {
    // const link = `http://localhost:3000/api/v1/auth/confirmEmail/${activationCode}`;
    const link = `${process.env.FE_URL}/auth/confirmEmail/${activationCode}`;
    const html = generateActivationEmail(link);

    return await sendEmail({
      to: email,
      subject: "Activate Account",
      html,
    });
  },
};
