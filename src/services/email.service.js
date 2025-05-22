import { sendEmail } from "../utils/sendMail.js";
import { generateActivationEmail } from "../utils/generateHTML.js";

export const EmailService = {
  async sendActivationEmail({ email, activationCode }) {
    const link = `${process.env.FE_URL}/auth/confirmEmail/${activationCode}`; 
    const html = generateActivationEmail(link);

    return await sendEmail({
      to: email,
      subject: "Activate Account",
      html,
    });
  },
};
