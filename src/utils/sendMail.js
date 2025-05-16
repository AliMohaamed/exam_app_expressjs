import nodemailer from "nodemailer";
import { host } from "../constants.js";
export const sendEmail = async ({ to, subject, html }) => {
  // sender
  const transporter = nodemailer.createTransport({
    host: host,
    post: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS,
    },
  });
  // receiver
  const emailInfo = await transporter.sendMail({
    from: `'Ali Mohamed' <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
  return emailInfo.accepted.length < 1 ? false : true;
};
